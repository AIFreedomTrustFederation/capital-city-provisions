import { NextResponse } from 'next/server';
import { applyPayment, createPayment, createReceipt, invoiceEmail, receiptEmail, sanitizeInvoice } from '../../../../lib/billing';

const memory=globalThis as typeof globalThis&{ccpBilling?:{invoices:any[];payments:any[];receipts:any[];emails:any[]}};
function db(){if(!memory.ccpBilling)memory.ccpBilling={invoices:[],payments:[],receipts:[],emails:[]};return memory.ccpBilling}
function accessRole(request:Request){const cookie=request.headers.get('cookie')||'';return cookie.match(/(?:^|; )ccp_access=([^;]+)/)?.[1]||''}
function emailLog(subject:string,body:string,customerEmail:string,type:string,invoiceId?:string,receiptId?:string){return {id:`EMAIL-${Date.now()}`,invoiceId,receiptId,customerEmail,emailType:type,status:'queued',subject,body,createdAt:new Date().toISOString()}}

export async function GET(request:Request){
  if(accessRole(request)!=='owner')return NextResponse.json({ok:false,message:'Owner access required'},{status:401});
  const store=db();
  return NextResponse.json({ok:true,mode:'live',storage:'memory-billing-mvp',invoices:store.invoices,payments:store.payments,receipts:store.receipts,emails:store.emails});
}

export async function POST(request:Request){
  try{
    if(accessRole(request)!=='owner')return NextResponse.json({ok:false,message:'Owner access required'},{status:401});
    const input=await request.json();
    const store=db();
    const action=input.action||'create-invoice';
    if(action==='create-invoice'){
      const invoice=sanitizeInvoice(input.invoice||input);
      const email=invoiceEmail(invoice);
      invoice.status='sent';invoice.sentAt=new Date().toISOString();invoice.updatedAt=invoice.sentAt;
      store.invoices.unshift(invoice);
      store.emails.unshift(emailLog(email.subject,email.body,invoice.customerEmail,'invoice',invoice.id));
      return NextResponse.json({ok:true,invoice,email,message:'Invoice created and queued for email.'});
    }
    if(action==='record-payment'){
      const invoice=store.invoices.find(item=>item.id===input.invoiceId||item.invoiceNumber===input.invoiceNumber);
      if(!invoice)return NextResponse.json({ok:false,message:'Invoice not found'},{status:404});
      const payment=createPayment(invoice,input.provider||'manual',Number(input.amount||invoice.balanceDue),input.method||input.provider||'manual',{processorPaymentId:input.processorPaymentId,processorFee:input.processorFee,cardBrand:input.cardBrand,cardLast4:input.cardLast4,notes:input.notes});
      const updated=applyPayment(invoice,payment);
      Object.assign(invoice,updated);
      const receipt=createReceipt(invoice,payment);
      const email=receiptEmail(invoice,receipt,payment);
      store.payments.unshift(payment);
      store.receipts.unshift(receipt);
      store.emails.unshift(emailLog(email.subject,email.body,invoice.customerEmail,'receipt',invoice.id,receipt.id));
      return NextResponse.json({ok:true,invoice,payment,receipt,email,message:'Payment recorded and receipt queued for email.'});
    }
    if(action==='void-invoice'){
      const invoice=store.invoices.find(item=>item.id===input.invoiceId||item.invoiceNumber===input.invoiceNumber);
      if(!invoice)return NextResponse.json({ok:false,message:'Invoice not found'},{status:404});
      invoice.status='void';invoice.voidedAt=new Date().toISOString();invoice.updatedAt=invoice.voidedAt;
      return NextResponse.json({ok:true,invoice,message:'Invoice voided.'});
    }
    return NextResponse.json({ok:false,message:'Unknown billing action'},{status:400});
  }catch(error:any){
    return NextResponse.json({ok:false,message:error?.message||'Billing invoice action failed'},{status:500});
  }
}
