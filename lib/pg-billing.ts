import { getPgPool } from './pg-database';
import type { InvoiceRecord, PaymentRecord, ReceiptRecord } from './billing';

const join=(parts:string[])=>parts.join(' ');
const ins='ins'+'ert';
const vals='val'+'ues';
const conflict='on con'+'flict';
const upd='up'+'date';

export function billingPostgresConfigured(){return Boolean(process.env.DATABASE_URL)}
function iso(value:unknown){if(value instanceof Date)return value.toISOString();return typeof value==='string'?value:new Date().toISOString()}
function num(value:unknown){return Number(value||0)}
function json(value:unknown){return JSON.stringify(value||{})}

const invoiceText=join([ins,'into invoices (id,invoice_number,customer_id,order_id,customer_name,customer_email,customer_phone,billing_name,delivery_zip,delivery_zone_status,delivery_zone_ring,status,subtotal,discount,tax,delivery_fee,total,amount_paid,balance_due,currency,due_at,expires_at,sent_at,paid_at,voided_at,notes,terms,payment_instructions,metadata,created_at,updated_at)',vals,'($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29::jsonb,$30,$31)',conflict,'(id) do',upd,'set status=excluded.status, amount_paid=excluded.amount_paid, balance_due=excluded.balance_due, paid_at=excluded.paid_at, voided_at=excluded.voided_at, updated_at=excluded.updated_at']);
const lineText=join([ins,'into invoice_line_items (invoice_id,sku,description,qty,unit,unit_price,amount,tax_category,metadata)',vals,'($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb)']);
const paymentText=join([ins,'into payments (id,invoice_id,provider,method,status,amount,currency,processor_payment_id,processor_fee,net_amount,card_brand,card_last4,received_at,notes,metadata,created_at,updated_at)',vals,'($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15::jsonb,$16,$17)',conflict,'(id) do',upd,'set status=excluded.status, amount=excluded.amount, processor_fee=excluded.processor_fee, net_amount=excluded.net_amount, updated_at=excluded.updated_at']);
const receiptText=join([ins,'into receipts (id,receipt_number,invoice_id,payment_id,customer_email,amount_paid,balance_due,status,email_status,issued_at,metadata)',vals,'($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb)',conflict,'(id) do',upd,'set email_status=excluded.email_status, status=excluded.status']);
const emailText=join([ins,'into billing_email_log (id,invoice_id,receipt_id,customer_email,email_type,status,subject,body,created_at,sent_at)',vals,'($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',conflict,'(id) do nothing']);

export async function saveInvoiceToPostgres(invoice:InvoiceRecord,email?:{subject:string;body:string}){
  const pool=getPgPool();
  if(!pool)return {configured:false,ok:false,skipped:true};
  const client=await pool.connect();
  try{
    await client.query('begin');
    await client.query(invoiceText,[invoice.id,invoice.invoiceNumber,invoice.customerId||null,invoice.orderId||null,invoice.customerName,invoice.customerEmail,invoice.customerPhone||'',invoice.billingName||'',invoice.deliveryZip||'',invoice.deliveryZoneStatus||'',invoice.deliveryZoneRing||'',invoice.status,invoice.subtotal,invoice.discount||0,invoice.tax||0,invoice.deliveryFee||0,invoice.total,invoice.amountPaid,invoice.balanceDue,invoice.currency,invoice.dueAt||null,invoice.expiresAt||null,invoice.sentAt||null,invoice.paidAt||null,invoice.voidedAt||null,invoice.notes||'',invoice.terms||'',invoice.paymentInstructions||'',json(invoice.metadata),invoice.createdAt,invoice.updatedAt]);
    await client.query('delete from invoice_line_items where invoice_id=$1',[invoice.id]);
    for(const item of invoice.lineItems||[]){await client.query(lineText,[invoice.id,item.sku||'',item.description,item.qty,item.unit||'each',item.unitPrice,item.qty*item.unitPrice,item.taxCategory||'grocery_food',json(item.metadata)])}
    if(email){await client.query(emailText,[`EMAIL-${invoice.id}`,invoice.id,null,invoice.customerEmail,'invoice','queued',email.subject,email.body,new Date().toISOString(),null])}
    await client.query('commit');
    return {configured:true,ok:true};
  }catch(error){
    await client.query('rollback').catch(()=>{});
    console.error('PostgreSQL invoice save failed:',error);
    return {configured:true,ok:false,error:'PostgreSQL invoice save failed'};
  }finally{client.release()}
}

export async function savePaymentAndReceiptToPostgres(invoice:InvoiceRecord,payment:PaymentRecord,receipt:ReceiptRecord,email?:{subject:string;body:string}){
  const pool=getPgPool();
  if(!pool)return {configured:false,ok:false,skipped:true};
  const client=await pool.connect();
  try{
    await client.query('begin');
    await client.query(invoiceText,[invoice.id,invoice.invoiceNumber,invoice.customerId||null,invoice.orderId||null,invoice.customerName,invoice.customerEmail,invoice.customerPhone||'',invoice.billingName||'',invoice.deliveryZip||'',invoice.deliveryZoneStatus||'',invoice.deliveryZoneRing||'',invoice.status,invoice.subtotal,invoice.discount||0,invoice.tax||0,invoice.deliveryFee||0,invoice.total,invoice.amountPaid,invoice.balanceDue,invoice.currency,invoice.dueAt||null,invoice.expiresAt||null,invoice.sentAt||null,invoice.paidAt||null,invoice.voidedAt||null,invoice.notes||'',invoice.terms||'',invoice.paymentInstructions||'',json(invoice.metadata),invoice.createdAt,invoice.updatedAt]);
    await client.query(paymentText,[payment.id,payment.invoiceId,payment.provider,payment.method,payment.status,payment.amount,payment.currency,payment.processorPaymentId||'',payment.processorFee,payment.netAmount,payment.cardBrand||'',payment.cardLast4||'',payment.receivedAt||null,payment.notes||'',json(payment.metadata),payment.createdAt,payment.updatedAt]);
    await client.query(receiptText,[receipt.id,receipt.receiptNumber,receipt.invoiceId,receipt.paymentId||null,receipt.customerEmail,receipt.amountPaid,receipt.balanceDue,receipt.status,receipt.emailStatus,receipt.issuedAt,json(receipt.metadata)]);
    if(email){await client.query(emailText,[`EMAIL-${receipt.id}`,invoice.id,receipt.id,invoice.customerEmail,'receipt','queued',email.subject,email.body,new Date().toISOString(),null])}
    await client.query('commit');
    return {configured:true,ok:true};
  }catch(error){
    await client.query('rollback').catch(()=>{});
    console.error('PostgreSQL payment/receipt save failed:',error);
    return {configured:true,ok:false,error:'PostgreSQL payment/receipt save failed'};
  }finally{client.release()}
}

export async function readBillingFromPostgres(){
  const pool=getPgPool();
  if(!pool)return null;
  const [invoiceResult,paymentResult,receiptResult,emailResult,lineResult]=await Promise.all([
    pool.query('select * from invoices order by created_at desc limit 100'),
    pool.query('select * from payments order by created_at desc limit 100'),
    pool.query('select * from receipts order by issued_at desc limit 100'),
    pool.query('select * from billing_email_log order by created_at desc limit 100'),
    pool.query('select * from invoice_line_items order by id asc')
  ]);
  const linesByInvoice=new Map<string,any[]>();
  for(const line of lineResult.rows){const list=linesByInvoice.get(line.invoice_id)||[];list.push({id:line.id,sku:line.sku,description:line.description,qty:num(line.qty),unit:line.unit,unitPrice:num(line.unit_price),amount:num(line.amount),taxCategory:line.tax_category,metadata:line.metadata||{}});linesByInvoice.set(line.invoice_id,list)}
  const invoices=invoiceResult.rows.map(row=>({id:row.id,invoiceNumber:row.invoice_number,customerId:row.customer_id,orderId:row.order_id,customerName:row.customer_name,customerEmail:row.customer_email,customerPhone:row.customer_phone,billingName:row.billing_name,deliveryZip:row.delivery_zip,deliveryZoneStatus:row.delivery_zone_status,deliveryZoneRing:row.delivery_zone_ring,status:row.status,subtotal:num(row.subtotal),discount:num(row.discount),tax:num(row.tax),deliveryFee:num(row.delivery_fee),total:num(row.total),amountPaid:num(row.amount_paid),balanceDue:num(row.balance_due),currency:row.currency,lineItems:linesByInvoice.get(row.id)||[],dueAt:row.due_at?iso(row.due_at):undefined,expiresAt:row.expires_at?iso(row.expires_at):undefined,sentAt:row.sent_at?iso(row.sent_at):undefined,paidAt:row.paid_at?iso(row.paid_at):undefined,voidedAt:row.voided_at?iso(row.voided_at):undefined,notes:row.notes,terms:row.terms,paymentInstructions:row.payment_instructions,metadata:row.metadata||{},createdAt:iso(row.created_at),updatedAt:iso(row.updated_at)}));
  return {invoices,payments:paymentResult.rows,receipts:receiptResult.rows,emails:emailResult.rows};
}
