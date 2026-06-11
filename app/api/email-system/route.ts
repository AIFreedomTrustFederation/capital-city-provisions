import { NextResponse } from 'next/server';
import { makeCustomerEmail, makeInboundEmail, queueEmail, readEmailRecords, saveEmailRecord, sendEmailOpenTransport } from '../../../lib/email-system';
import { postgresConfigured } from '../../../lib/pg-database';

const memory=globalThis as typeof globalThis&{ccpEmailSystem?:any[]};
function mem(){if(!memory.ccpEmailSystem)memory.ccpEmailSystem=[];return memory.ccpEmailSystem}
function accessRole(request:Request){const cookie=request.headers.get('cookie')||'';return cookie.match(/(?:^|; )ccp_access=([^;]+)/)?.[1]||''}
function requiresPostgres(){return process.env.NODE_ENV==='production'||process.env.CCP_REQUIRE_POSTGRES==='true'}

export async function GET(request:Request){
  if(accessRole(request)!=='owner')return NextResponse.json({ok:false,message:'Owner access required'},{status:401});
  if(postgresConfigured()){const records=await readEmailRecords();return NextResponse.json({ok:true,storage:'postgres',records:records||[]});}
  if(requiresPostgres())return NextResponse.json({ok:false,databaseRequired:true,message:'PostgreSQL is required for live email records.'},{status:503});
  return NextResponse.json({ok:true,storage:'memory',records:mem()});
}

export async function POST(request:Request){
  try{
    if(accessRole(request)!=='owner')return NextResponse.json({ok:false,message:'Owner access required'},{status:401});
    if(!postgresConfigured()&&requiresPostgres())return NextResponse.json({ok:false,databaseRequired:true,message:'PostgreSQL is required for live email writes.'},{status:503});
    const input=await request.json();
    const action=input.action||'queue-generated';
    let record:any;
    if(action==='queue-generated')record=makeCustomerEmail(input.message||input);
    else if(action==='import-received')record=makeInboundEmail(input.message||input);
    else if(action==='save-draft')record={...(input.record||{}),status:'draft'};
    else return NextResponse.json({ok:false,message:'Unknown email action'},{status:400});
    const queued=action==='queue-generated'?await queueEmail(record):await saveEmailRecord(record);
    if(!postgresConfigured())mem().unshift(record);
    const transport=action==='queue-generated'?await sendEmailOpenTransport(record):{configured:false,ok:false,message:'No send attempted.'};
    return NextResponse.json({ok:true,record,queued,transport});
  }catch(error:any){return NextResponse.json({ok:false,message:error?.message||'Email system action failed'},{status:500})}
}
