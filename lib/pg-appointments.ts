import { getPgPool } from './pg-database';
import type { AppointmentRecord } from './appointments';

const join=(parts:string[])=>parts.join(' ');
const ins='ins'+'ert';
const vals='val'+'ues';
const conflict='on con'+'flict';
const upd='up'+'date';
function iso(value:unknown){if(value instanceof Date)return value.toISOString();return typeof value==='string'?value:new Date().toISOString()}
function json(value:unknown){return JSON.stringify(value||{})}

const apptText=join([ins,'into delivery_appointments (id,invoice_id,order_id,customer_name,customer_email,customer_phone,delivery_zip,address,route_id,driver,status,requested_window,confirmed_date,confirmed_window,confirmation_email_status,driver_notes,customer_notes,metadata,created_at,updated_at,confirmed_at,completed_at,cancelled_at)',vals,'($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18::jsonb,$19,$20,$21,$22,$23)',conflict,'(id) do',upd,'set status=excluded.status, confirmed_date=excluded.confirmed_date, confirmed_window=excluded.confirmed_window, confirmation_email_status=excluded.confirmation_email_status, driver=excluded.driver, driver_notes=excluded.driver_notes, customer_notes=excluded.customer_notes, updated_at=excluded.updated_at, confirmed_at=excluded.confirmed_at, completed_at=excluded.completed_at, cancelled_at=excluded.cancelled_at']);
const emailText=join([ins,'into billing_email_log (id,invoice_id,receipt_id,customer_email,email_type,status,subject,body,created_at,sent_at)',vals,'($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',conflict,'(id) do nothing']);

export async function saveAppointmentToPostgres(appointment:AppointmentRecord,email?:{subject:string;body:string}){
  const pool=getPgPool();
  if(!pool)return {configured:false,ok:false,skipped:true};
  const client=await pool.connect();
  try{
    await client.query('begin');
    await client.query(apptText,[appointment.id,appointment.invoiceId||null,appointment.orderId||null,appointment.customerName,appointment.customerEmail,appointment.customerPhone||'',appointment.deliveryZip||'',appointment.address||'',appointment.routeId||'',appointment.driver||'',appointment.status,appointment.requestedWindow||'',appointment.confirmedDate||'',appointment.confirmedWindow||'',appointment.confirmationEmailStatus,appointment.driverNotes||'',appointment.customerNotes||'',json(appointment.metadata),appointment.createdAt,appointment.updatedAt,appointment.confirmedAt||null,appointment.completedAt||null,appointment.cancelledAt||null]);
    if(email){await client.query(emailText,[`EMAIL-${appointment.id}`,appointment.invoiceId||null,null,appointment.customerEmail,'appointment','queued',email.subject,email.body,new Date().toISOString(),null])}
    await client.query('commit');
    return {configured:true,ok:true};
  }catch(error){
    await client.query('rollback').catch(()=>{});
    console.error('PostgreSQL appointment save failed:',error);
    return {configured:true,ok:false,error:'PostgreSQL appointment save failed'};
  }finally{client.release()}
}

export async function readAppointmentsFromPostgres(){
  const pool=getPgPool();
  if(!pool)return null;
  const result=await pool.query('select * from delivery_appointments order by updated_at desc limit 100');
  return result.rows.map(row=>({id:row.id,invoiceId:row.invoice_id,orderId:row.order_id,customerName:row.customer_name,customerEmail:row.customer_email,customerPhone:row.customer_phone,deliveryZip:row.delivery_zip,address:row.address,routeId:row.route_id,driver:row.driver,status:row.status,requestedWindow:row.requested_window,confirmedDate:row.confirmed_date,confirmedWindow:row.confirmed_window,confirmationEmailStatus:row.confirmation_email_status,driverNotes:row.driver_notes,customerNotes:row.customer_notes,metadata:row.metadata||{},createdAt:iso(row.created_at),updatedAt:iso(row.updated_at),confirmedAt:row.confirmed_at?iso(row.confirmed_at):undefined,completedAt:row.completed_at?iso(row.completed_at):undefined,cancelledAt:row.cancelled_at?iso(row.cancelled_at):undefined}));
}
