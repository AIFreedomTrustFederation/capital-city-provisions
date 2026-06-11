import { NextResponse } from 'next/server';
import { appointmentConfirmationEmail, sanitizeAppointment, type AppointmentRecord } from '../../../../lib/appointments';
import { readAppointmentsFromPostgres, saveAppointmentToPostgres } from '../../../../lib/pg-appointments';
import { postgresConfigured } from '../../../../lib/pg-database';
import { withContextTrust, type ContextRecordSource } from '../../../../lib/context-trust';

const memory=globalThis as typeof globalThis&{ccpAppointments?:{appointments:any[];emails:any[]}};
function store(){if(!memory.ccpAppointments)memory.ccpAppointments={appointments:[],emails:[]};return memory.ccpAppointments}
function accessRole(request:Request){const cookie=request.headers.get('cookie')||'';return cookie.match(/(?:^|; )ccp_access=([^;]+)/)?.[1]||''}
function requiresPostgres(){return process.env.NODE_ENV==='production'||process.env.CCP_REQUIRE_POSTGRES==='true'}
function labelRows(rows:any[],source:ContextRecordSource,reason:string){return (rows||[]).map(row=>row?.contextTrust?row:withContextTrust(row,source,{reason}))}

export async function GET(request:Request){
  if(accessRole(request)!=='owner'&&accessRole(request)!=='driver')return NextResponse.json({ok:false,message:'Internal access required'},{status:401});
  if(postgresConfigured()){
    const appointments=await readAppointmentsFromPostgres();
    return NextResponse.json({ok:true,storage:'postgres',appointments:labelRows(appointments||[],'postgres','Official appointment record from PostgreSQL.')});
  }
  if(requiresPostgres())return NextResponse.json({ok:false,databaseRequired:true,message:'PostgreSQL is required for live appointments.'},{status:503});
  return NextResponse.json({ok:true,storage:'memory',appointments:labelRows(store().appointments,'memory','Working appointment memory.'),emails:labelRows(store().emails,'memory','Working appointment message memory.')});
}

export async function POST(request:Request){
  try{
    if(accessRole(request)!=='owner')return NextResponse.json({ok:false,message:'Owner access required'},{status:401});
    const hasPg=postgresConfigured();
    if(!hasPg&&requiresPostgres())return NextResponse.json({ok:false,databaseRequired:true,message:'PostgreSQL is required for live appointment writes.'},{status:503});
    const input=await request.json();
    const appointment=withContextTrust(sanitizeAppointment(input.appointment||input) as AppointmentRecord,hasPg?'postgres':'memory',{reason:hasPg?'Official appointment pending PostgreSQL save.':'Working appointment memory.'});
    const email=appointmentConfirmationEmail(appointment);
    appointment.confirmationEmailStatus='queued';appointment.updatedAt=new Date().toISOString();
    const persistence=hasPg?await saveAppointmentToPostgres(appointment,email):{configured:false,ok:false,skipped:true};
    if(hasPg&&!persistence.ok)return NextResponse.json({ok:false,message:'Appointment was not saved.',persistence},{status:503});
    const emailRecord=withContextTrust({id:`EMAIL-${appointment.id}`,appointmentId:appointment.id,invoiceId:appointment.invoiceId,customerEmail:appointment.customerEmail,emailType:'appointment',status:'queued',subject:email.subject,body:email.body,createdAt:new Date().toISOString()},hasPg?'postgres':'memory',{reason:'Appointment confirmation message.'});
    if(!hasPg){store().appointments.unshift(appointment);store().emails.unshift(emailRecord);}
    return NextResponse.json({ok:true,storage:hasPg?'postgres':'memory',appointment,email:withContextTrust(email,hasPg?'postgres':'memory',{reason:'Appointment confirmation draft.'}),persistence,message:'Appointment created and confirmation email queued.'});
  }catch(error:any){return NextResponse.json({ok:false,message:error?.message||'Appointment action failed'},{status:500})}
}
