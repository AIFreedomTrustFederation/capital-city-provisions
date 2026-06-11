import { NextResponse } from 'next/server';
import { applyPayment, createPayment, createReceipt, invoiceEmail, receiptEmail, sanitizeInvoice, type InvoiceRecord, type PaymentProvider } from '../../../../lib/billing';
import { billingPostgresConfigured, readBillingFromPostgres, saveInvoiceToPostgres, savePaymentAndReceiptToPostgres } from '../../../../lib/pg-billing';
import { withContextTrust, type ContextRecordSource } from '../../../../lib/context-trust';

const memory=globalThis as typeof globalThis&{ccpBilling?:{invoices:any[];payments:any[];receipts:any[];emails:any[]}};
function db(){if(!memory.ccpBilling)memory.ccpBilling={invoices:[],payments:[],receipts:[],emails:[]};return memory.ccpBilling}
function accessRole(request:Request){const cookie=request.headers.get('cookie')||'';return cookie.match(/(?:^|; )ccp_access=([^;]+)/)?.[1]||''}
function emailLog(subject:string,body:string,customerEmail:string,type:string,invoiceId?:string,receiptId?:string){return {id:`EMAIL-${Date.now()}`,invoiceId,receiptId,customerEmail,emailType:type,status:'queued',subject,body,createdAt:new Date().toISOString()}}
function requiresPostgres(){return process.env.NODE_ENV==='production'||process.env.CCP_REQUIRE_POSTGRES==='true'}
function labelRows(rows:any[],source:ContextRecordSource,reason?:string){return (rows||[]).map(row=>row?.contextTrust?row:withContextTrust(row,source,reason?{reason}:{}))}
function labelBilling(billing:any,source:ContextRecordSource){return {invoices:labelRows(billing?.invoices||[],source),payments:labelRows(billing?.payments||[],source),receipts:labelRows(billing?.receipts||[],source),emails:labelRows(billing?.emails||[],source)}}
function findInvoice(invoices:any[],input:any){return invoices.find((item:any)=>item.id===input.invoiceId||item.invoiceNumber===input.invoiceNumber) as InvoiceRecord|undefined}
function paymentProvider(value:any):PaymentProvider{const provider=String(value||'manual');return ['manual','cash','ach','zelle','check','btcpay','hosted-card'].includes(provider)?provider as PaymentProvider:'manual'}

export async function GET(request:Request){
  if(accessRole(request)!=='owner')return NextResponse.json({ok:false,message:'Owner access required'},{status:401});
  if(billingPostgresConfigured()){
    const billing=labelBilling(await readBillingFromPostgres(),'postgres');
    return NextResponse.json({ok:true,mode:'live',storage:'postgres',...billing});
  }
  if(requiresPostgres())return NextResponse.json({ok:false,storage:'unavailable',databaseRequired:true,message:'PostgreSQL is required for live billing records.'},{status:503});
  const store=db();
  return NextResponse.json({ok:true,mode:'live',storage:'memory-billing-mvp',...labelBilling(store,'memory')});
}

export async function POST(request:Request){
  try{
    if(accessRole(request)!=='owner')return NextResponse.json({ok:false,message:'Owner access required'},{status:401});
    const input=await request.json();
    const store=db();
    const action=input.action||'create-invoice';
    const hasPg=billingPostgresConfigured();
    if(!hasPg&&requiresPostgres())return NextResponse.json({ok:false,storage:'unavailable',databaseRequired:true,message:'PostgreSQL is required for live billing writes.'},{status:503});
    if(action==='create-invoice'){
      const invoice=withContextTrust(sanitizeInvoice(input.invoice||input) as InvoiceRecord,hasPg?'postgres':'memory',{reason:hasPg?'Official invoice queued for PostgreSQL persistence.':'Working invoice stored in MVP runtime memory.'});
      const email=invoiceEmail(invoice);
      invoice.status='sent';invoice.sentAt=new Date().toISOString();invoice.updatedAt=invoice.sentAt;
      const persistence=hasPg?await saveInvoiceToPostgres(invoice,email):{configured:false,ok:false,skipped:true};
      if(hasPg&&!persistence.ok)return NextResponse.json({ok:false,message:'Invoice was created but not saved to PostgreSQL.',persistence},{status:503});
      if(!hasPg){store.invoices.unshift(invoice);store.emails.unshift(withContextTrust(emailLog(email.subject,email.body,invoice.customerEmail,'invoice',invoice.id),'memory',{reason:'Working billing email queued in MVP runtime memory.'}));}
      return NextResponse.json({ok:true,storage:hasPg?'postgres':'memory-billing-mvp',persistence,invoice,email:withContextTrust(email,hasPg?'postgres':'memory',{reason:'Billing email draft generated from invoice.'}),message:'Invoice created and queued for email.'});
    }
    if(action==='record-payment'){
      const billing=hasPg?await readBillingFromPostgres():store;
      const invoice=findInvoice(billing?.invoices||[],input);
      if(!invoice)return NextResponse.json({ok:false,message:'Invoice not found'},{status:404});
      const provider=paymentProvider(input.provider);
      const payment=withContextTrust(createPayment(invoice,provider,Number(input.amount||invoice.balanceDue),String(input.method||provider),{processorPaymentId:input.processorPaymentId,processorFee:input.processorFee,cardBrand:input.cardBrand,cardLast4:input.cardLast4,notes:input.notes}),hasPg?'postgres':'memory',{reason:hasPg?'Official payment record for PostgreSQL persistence.':'Working payment stored in MVP runtime memory.'});
      const updated=applyPayment(invoice,payment);
      Object.assign(invoice,updated);
      const labeledInvoice=withContextTrust(invoice,hasPg?'postgres':'memory',{reason:hasPg?'Official invoice updated after payment.':'Working invoice updated in MVP runtime memory.'});
      const receipt=withContextTrust(createReceipt(labeledInvoice,payment),hasPg?'postgres':'memory',{reason:hasPg?'Official receipt for PostgreSQL persistence.':'Working receipt stored in MVP runtime memory.'});
      const email=receiptEmail(labeledInvoice,receipt,payment);
      const persistence=hasPg?await savePaymentAndReceiptToPostgres(labeledInvoice,payment,receipt,email):{configured:false,ok:false,skipped:true};
      if(hasPg&&!persistence.ok)return NextResponse.json({ok:false,message:'Payment was recorded but not saved to PostgreSQL.',persistence},{status:503});
      if(!hasPg){store.payments.unshift(payment);store.receipts.unshift(receipt);store.emails.unshift(withContextTrust(emailLog(email.subject,email.body,labeledInvoice.customerEmail,'receipt',labeledInvoice.id,receipt.id),'memory',{reason:'Working receipt email queued in MVP runtime memory.'}));}
      return NextResponse.json({ok:true,storage:hasPg?'postgres':'memory-billing-mvp',persistence,invoice:labeledInvoice,payment,receipt,email:withContextTrust(email,hasPg?'postgres':'memory',{reason:'Receipt email draft generated from payment.'}),message:'Payment recorded and receipt queued for email.'});
    }
    if(action==='void-invoice'){
      const billing=hasPg?await readBillingFromPostgres():store;
      const invoice=findInvoice(billing?.invoices||[],input);
      if(!invoice)return NextResponse.json({ok:false,message:'Invoice not found'},{status:404});
      invoice.status='void';invoice.voidedAt=new Date().toISOString();invoice.updatedAt=invoice.voidedAt;
      const labeledInvoice=withContextTrust(invoice,hasPg?'owner-override':'memory',{reason:hasPg?'Owner void override persisted to PostgreSQL invoice record.':'Owner void override stored in MVP runtime memory.'});
      const persistence=hasPg?await saveInvoiceToPostgres(labeledInvoice):{configured:false,ok:false,skipped:true};
      if(hasPg&&!persistence.ok)return NextResponse.json({ok:false,message:'Invoice void was not saved to PostgreSQL.',persistence},{status:503});
      return NextResponse.json({ok:true,storage:hasPg?'postgres':'memory-billing-mvp',persistence,invoice:labeledInvoice,message:'Invoice voided.'});
    }
    return NextResponse.json({ok:false,message:'Unknown billing action'},{status:400});
  }catch(error:any){
    return NextResponse.json({ok:false,message:error?.message||'Billing invoice action failed'},{status:500});
  }
}
