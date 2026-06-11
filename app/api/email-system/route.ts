import { NextResponse } from 'next/server';
import { makeCustomerEmail, makeInboundEmail, queueEmail, readEmailRecords, saveEmailRecord, sendEmailOpenTransport } from '../../../lib/email-system';
import { postgresConfigured } from '../../../lib/pg-database';
import { withContextTrust, type ContextRecordSource } from '../../../lib/context-trust';

const memory=globalThis as typeof globalThis&{ccpEmailSystem?:any[]};
function mem(){if(!memory.ccpEmailSystem)memory.ccpEmailSystem=[];return memory.ccpEmailSystem}
function accessRole(request:Request){const cookie=request.headers.get('cookie')||'';return cookie.match(/(?:^|; )ccp_access=([^;]+)/)?.[1]||''}
function internalRole(request:Request){const role=accessRole(request);return role==='owner'||role==='driver'}
function requiresPostgres(){return process.env.NODE_ENV==='production'||process.env.CCP_REQUIRE_POSTGRES==='true'}
function labelRows(rows:any[],source:ContextRecordSource,reason:string){return (rows||[]).map(row=>row?.contextTrust?row:withContextTrust(row,source,{reason}))}
function labelRecord(record:any,action:string,hasPg:boolean){if(record?.contextTrust)return record;const inbound=action==='import-received'||record?.direction==='inbound';const draft=action==='save-draft'||record?.status==='draft';const source=inbound?('customer-'+'message') as ContextRecordSource:draft?'owner-override':hasPg?'postgres':'memory';const reason=inbound?'Inbound customer text pending review.':draft?'Owner or driver draft.':hasPg?'Official communication record in PostgreSQL.':'Working communication memory.';return withContextTrust(record,source,{reason})}

export async function GET(request:Request){
  if(!internalRole(request))return NextResponse.json({ok:false,message:'Internal access required'},{status:401});
  if(postgresConfigured()){const records=await readEmailRecords();return NextResponse.json({ok:true,storage:'postgres',records:labelRows(records||[],'postgres','Official communication records from PostgreSQL.')});}
  if(requiresPostgres())return NextResponse.json({ok:false,databaseRequired:true,message:'PostgreSQL is required for live email records.'},{status:503});
  return NextResponse.json({ok:true,storage:'memory',records:labelRows(mem(),'memory','Working communication memory.')});
}

export async function POST(request:Request){
  try{
    if(!internalRole(request))return NextResponse.json({ok:false,message:'Internal access required'},{status:401});
    const hasPg=postgresConfigured();
    if(!hasPg&&requiresPostgres())return NextResponse.json({ok:false,databaseRequired:true,message:'PostgreSQL is required for live email writes.'},{status:503});
    const input=await request.json();
    const action=input.action||'queue-generated';
    let record:any;
    if(action==='queue-generated')record=makeCustomerEmail({stage:'lead-thank-you',...(input.message||input)});
    else if(action==='import-received')record=makeInboundEmail(input.message||input);
    else if(action==='save-draft')record={...(input.record||{}),status:'draft'};
    else return NextResponse.json({ok:false,message:'Unknown email action'},{status:400});
    record=labelRecord(record,action,hasPg);
    const queued=action==='queue-generated'?await queueEmail(record):await saveEmailRecord(record);
    if(!hasPg)mem().unshift(record);
    const transport=action==='queue-generated'?await sendEmailOpenTransport(record):{configured:false,ok:false,message:'No send attempted.'};
    return NextResponse.json({ok:true,storage:hasPg?'postgres':'memory',record,queued,transport});
  }catch(error:any){return NextResponse.json({ok:false,message:error?.message||'Email system action failed'},{status:500})}
}
