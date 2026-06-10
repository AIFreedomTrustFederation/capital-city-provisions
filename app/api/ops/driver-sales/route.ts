import { NextResponse } from 'next/server';
import { upsertDriverSalesLead } from '../../../../lib/ccp-database';
import { postgresConfigured, saveDriverSalesLeadToPostgres } from '../../../../lib/pg-database';

function clean(value:unknown){return String(value||'').trim()}
async function postJson(url:string|undefined,body:unknown){
  if(!url)return {configured:false,ok:false};
  const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  return {configured:true,ok:response.ok,status:response.status};
}

export async function POST(request:Request){
  try{
    const required=process.env.NODE_ENV==='production'||process.env.CCP_REQUIRE_POSTGRES==='true';
    const hasDb=postgresConfigured();
    if(required&&!hasDb)return NextResponse.json({ok:false,mode:'live',storage:'unavailable',databaseRequired:true,message:'PostgreSQL is required for live sales queue writes.'},{status:503});
    const input=await request.json();
    const lead=upsertDriverSalesLead({
      id:clean(input.id),
      driver:clean(input.driver)||'Driver',
      sourceStopId:clean(input.sourceStopId),
      sourceCustomer:clean(input.sourceCustomer),
      routeId:clean(input.routeId),
      leadName:clean(input.leadName),
      email:clean(input.email),
      phone:clean(input.phone),
      address:clean(input.address),
      zip:clean(input.zip),
      area:clean(input.area),
      need:clean(input.need),
      offer:clean(input.offer),
      estimatedValue:Number(input.estimatedValue||0),
      status:input.status,
      temperature:input.temperature,
      note:clean(input.note),
      ownerOverride:clean(input.ownerOverride),
      aiInstruction:clean(input.aiInstruction),
      driverRoutePlan:clean(input.driverRoutePlan)
    });
    const persistence=hasDb?await saveDriverSalesLeadToPostgres(lead):{configured:false,ok:false,skipped:true};
    if(hasDb&&!persistence.ok)return NextResponse.json({ok:false,mode:'live',storage:'postgres',persistence,message:'PostgreSQL save failed.'},{status:503});
    const ownerText=[
      `Driver sales queue: ${lead.status}`,
      `Driver: ${lead.driver}`,
      `Lead: ${lead.leadName}`,
      `Contact: ${lead.phone||'no phone'} ${lead.email||'no email'}`,
      `Address: ${lead.address||'no address'}`,
      `Area / ZIP: ${lead.area} ${lead.zip}`,
      `Need: ${lead.need}`,
      `Offer: ${lead.offer}`,
      `Estimated value: ${lead.estimatedValue}`,
      `Source stop: ${lead.sourceStopId||'none'}`,
      `Note: ${lead.note}`,
      `Owner override: ${lead.ownerOverride||'none'}`,
      `Driver route plan: ${lead.driverRoutePlan||'none'}`
    ].join('\n');
    const [ownerWebhook,sheetWebhook]=await Promise.allSettled([
      postJson(process.env.OPS_WEBHOOK_URL||process.env.LEADS_WEBHOOK_URL,{text:ownerText,driverSalesLead:lead}),
      postJson(process.env.OPS_GOOGLE_SHEETS_WEBHOOK_URL||process.env.LEADS_GOOGLE_SHEETS_WEBHOOK_URL,lead)
    ]);
    return NextResponse.json({ok:true,mode:'live',storage:hasDb?'postgres':'memory',persistence,lead,notifications:{ownerWebhook:ownerWebhook.status==='fulfilled'?ownerWebhook.value:{configured:false,ok:false},googleSheets:sheetWebhook.status==='fulfilled'?sheetWebhook.value:{configured:false,ok:false}}});
  }catch(error){
    console.error('Driver sales queue failed:',error);
    return NextResponse.json({ok:false,message:'Driver sales queue failed'},{status:500});
  }
}
