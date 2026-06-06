import { NextResponse } from 'next/server';
import { upsertDriverSalesLead, type DatabaseMode } from '../../../../lib/ccp-database';

function clean(value:unknown){return String(value||'').trim()}
function modeFromRequest(request:Request):DatabaseMode{
  const url=new URL(request.url);
  return url.searchParams.get('sample')==='1'?'sample':'live';
}
async function postJson(url:string|undefined,body:unknown){
  if(!url)return {configured:false,ok:false};
  const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  return {configured:true,ok:response.ok,status:response.status};
}

export async function POST(request:Request){
  try{
    const mode=modeFromRequest(request);
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
    },{mode});
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
    return NextResponse.json({ok:true,mode,lead,notifications:{ownerWebhook:ownerWebhook.status==='fulfilled'?ownerWebhook.value:{configured:false,ok:false},googleSheets:sheetWebhook.status==='fulfilled'?sheetWebhook.value:{configured:false,ok:false}}});
  }catch(error){
    console.error('Driver sales queue failed:',error);
    return NextResponse.json({ok:false,message:'Driver sales queue failed'},{status:500});
  }
}
