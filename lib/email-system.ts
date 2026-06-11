import { getPgPool } from './pg-database';
import { generateCustomerMessage, type CustomerMessageInput } from './customer-messages';
import { sendWithOptionalNodemailer, smtpReady } from './smtp-transport';

export type EmailDirection='outbound'|'inbound';
export type EmailStatus='draft'|'queued'|'sent'|'failed'|'received'|'archived';
export type EmailRecord={id:string;direction:EmailDirection;customerEmail:string;customerName?:string;subject:string;body:string;status:EmailStatus;stage?:string;source?:string;invoiceId?:string;receiptId?:string;appointmentId?:string;provider?:string;providerMessageId?:string;receivedAt?:string;sentAt?:string;createdAt:string;metadata?:Record<string,any>};

function clean(value:unknown){return String(value||'').trim()}
function now(){return new Date().toISOString()}
function id(prefix='MSG'){return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`}
function json(value:unknown){return JSON.stringify(value||{})}

export function smtpConfigured(){return smtpReady()}
export function makeCustomerEmail(input:CustomerMessageInput&{source?:string;invoiceId?:string;receiptId?:string;appointmentId?:string}):EmailRecord{
  const message=generateCustomerMessage(input);
  return {id:id('EMAIL'),direction:'outbound',customerEmail:clean(input.customerEmail).toLowerCase(),customerName:input.customerName||'',subject:message.subject,body:message.body,status:'draft',stage:input.stage,source:input.source||'ai-generated',invoiceId:input.invoiceId,receiptId:input.receiptId,appointmentId:input.appointmentId,provider:'manual',createdAt:now(),metadata:{zip:input.zip,box:input.box,offerCode:input.offerCode,offerText:input.offerText}}
}
export function makeInboundEmail(input:{customerEmail:string;customerName?:string;subject:string;body:string;source?:string;providerMessageId?:string;metadata?:Record<string,any>}):EmailRecord{
  return {id:id('INBOX'),direction:'inbound',customerEmail:clean(input.customerEmail).toLowerCase(),customerName:input.customerName||'',subject:clean(input.subject)||'Customer reply',body:clean(input.body),status:'received',stage:'reply',source:input.source||'manual-import',provider:'manual',providerMessageId:input.providerMessageId||'',receivedAt:now(),createdAt:now(),metadata:input.metadata||{}}
}

export async function saveEmailRecord(record:EmailRecord){
  const pool=getPgPool();
  if(!pool)return {configured:false,ok:false,skipped:true,record};
  try{
    await pool.query('insert into customer_email_messages (id,direction,customer_email,customer_name,subject,body,status,stage,source,invoice_id,receipt_id,appointment_id,provider,provider_message_id,received_at,sent_at,created_at,metadata) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18::jsonb) on conflict (id) do update set status=excluded.status, provider_message_id=excluded.provider_message_id, sent_at=excluded.sent_at, received_at=excluded.received_at',[
      record.id,record.direction,record.customerEmail,record.customerName||'',record.subject,record.body,record.status,record.stage||'',record.source||'',record.invoiceId||null,record.receiptId||null,record.appointmentId||'',record.provider||'manual',record.providerMessageId||'',record.receivedAt||null,record.sentAt||null,record.createdAt,json(record.metadata)
    ]);
    return {configured:true,ok:true,record};
  }catch(error){console.error('Email record save failed:',error);return {configured:true,ok:false,error:'Email record save failed',record}}
}

export async function readEmailRecords(limit=100){
  const pool=getPgPool();
  if(!pool)return null;
  const result=await pool.query('select * from customer_email_messages order by created_at desc limit $1',[limit]);
  return result.rows.map(row=>({id:row.id,direction:row.direction,customerEmail:row.customer_email,customerName:row.customer_name,subject:row.subject,body:row.body,status:row.status,stage:row.stage,source:row.source,invoiceId:row.invoice_id,receiptId:row.receipt_id,appointmentId:row.appointment_id,provider:row.provider,providerMessageId:row.provider_message_id,receivedAt:row.received_at?new Date(row.received_at).toISOString():undefined,sentAt:row.sent_at?new Date(row.sent_at).toISOString():undefined,createdAt:new Date(row.created_at).toISOString(),metadata:row.metadata||{}}));
}

export async function queueEmail(record:EmailRecord){return await saveEmailRecord({...record,status:'queued',provider:smtpConfigured()?'smtp':'manual'})}
export async function markEmailSent(record:EmailRecord,providerMessageId='manual-sent'){return await saveEmailRecord({...record,status:'sent',providerMessageId,sentAt:now()})}
export async function markEmailFailed(record:EmailRecord,error='send failed'){return await saveEmailRecord({...record,status:'failed',metadata:{...(record.metadata||{}),error}})}

export async function sendEmailOpenTransport(record:EmailRecord){
  const queued={...record,status:'queued' as EmailStatus,provider:smtpConfigured()?'smtp':'manual'};
  await saveEmailRecord(queued);
  if(!smtpConfigured())return {configured:false,ok:false,message:'SMTP is not configured. Email remains queued.',record:queued};
  const result=await sendWithOptionalNodemailer(queued);
  if(result.ok){await markEmailSent({...queued,provider:'smtp'},result.providerMessageId||'smtp-sent');return {...result,record:{...queued,status:'sent',providerMessageId:result.providerMessageId}}}
  await markEmailFailed({...queued,provider:'smtp'},result.error||result.message);
  return {...result,record:{...queued,status:'failed'}};
}
