import { NextResponse } from 'next/server';
import { buildDriverSalesLeadRecord, getDatabase, upsertDriverSalesLead, type DriverSalesLeadInput } from '../../../../lib/ccp-database';
import { getDriverSalesLeadsFromPostgres, postgresConfigured, saveDriverSalesLeadToPostgres } from '../../../../lib/pg-database';
import { withZipZone } from '../../../../lib/zip-zone';
import { makeCustomerEmail, queueEmail } from '../../../../lib/email-system';

function clean(value:unknown){return String(value||'').trim()}
function accessRole(request:Request){const cookie=request.headers.get('cookie')||'';return cookie.match(/(?:^|; )ccp_access=([^;]+)/)?.[1]||''}
function requiresPostgres(){return process.env.NODE_ENV==='production'||process.env.CCP_REQUIRE_POSTGRES==='true'}
async function postJson(url:string|undefined,body:unknown){if(!url)return {configured:false,ok:false};const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});return {configured:true,ok:response.ok,status:response.status}}
async function queueCloseEmails(lead:any){if(!lead.email)return [];const stage=lead.status==='reserved'?('driver-'+'close-out'):lead.status==='pitched'?'quote-reminder':'';if(!stage)return [];const base={customerEmail:lead.email,customerName:lead.leadName,zip:lead.zip,box:lead.need,notes:lead.note,source:`driver-sales-${lead.status}`};const first=makeCustomerEmail({...base,stage:stage as any});const drafts=[queueEmail(first)];if(lead.status==='reserved')drafts.push(queueEmail(makeCustomerEmail({...base,stage:'review-request'} as any)));const results=await Promise.allSettled(drafts);return results.map(r=>r.status==='fulfilled'?r.value:{ok:false})}
function leadInput(enriched:any):DriverSalesLeadInput{return {id:clean(enriched.id),driver:clean(enriched.driver)||'Driver',sourceStopId:clean(enriched.sourceStopId),sourceCustomer:clean(enriched.sourceCustomer),routeId:clean(enriched.routeId),leadName:clean(enriched.leadName),email:clean(enriched.email),phone:clean(enriched.phone),address:clean(enriched.address),zip:clean(enriched.zip),area:clean(enriched.area||enriched.deliveryZoneCity),need:clean(enriched.need),offer:clean(enriched.offer),estimatedValue:Number(enriched.estimatedValue||0),status:enriched.status,temperature:enriched.temperature,note:clean(enriched.note),ownerOverride:clean(enriched.ownerOverride),aiInstruction:clean(enriched.aiInstruction),driverRoutePlan:clean(enriched.driverRoutePlan)}}
function attachZone(lead:any,enriched:any){Object.assign(lead,{deliveryZoneStatus:clean(enriched.deliveryZoneStatus),deliveryZoneCity:clean(enriched.deliveryZoneCity),deliveryZoneCounty:clean(enriched.deliveryZoneCounty),deliveryZoneRing:clean(enriched.deliveryZoneRing),deliveryZoneMinutes:enriched.deliveryZoneMinutes,deliveryZonePriority:enriched.deliveryZonePriority,deliveryZoneMessage:clean(enriched.deliveryZoneMessage),deliveryZoneNotes:clean(enriched.deliveryZoneNotes),zipZone:enriched.zipZone});return lead}

export async function GET(request:Request){
  if(accessRole(request)!=='owner')return NextResponse.json({ok:false,message:'Owner access required'},{status:401});
  const hasDb=postgresConfigured();
  if(hasDb){const leads=await getDriverSalesLeadsFromPostgres();return NextResponse.json({ok:true,storage:'postgres',leads});}
  if(requiresPostgres())return NextResponse.json({ok:false,storage:'unavailable',databaseRequired:true,message:'PostgreSQL is required for live sales queue.'},{status:503});
  return NextResponse.json({ok:true,storage:'memory',leads:getDatabase().driverSalesLeads});
}

export async function POST(request:Request){
  try{
    const required=requiresPostgres();
    const hasDb=postgresConfigured();
    if(required&&!hasDb)return NextResponse.json({ok:false,mode:'live',storage:'unavailable',databaseRequired:true,message:'PostgreSQL is required for live sales queue writes.'},{status:503});
    const input=await request.json();
    const enriched=withZipZone(input) as any;
    const baseLead=leadInput(enriched);
    const lead:any=attachZone(hasDb?buildDriverSalesLeadRecord(baseLead):upsertDriverSalesLead(baseLead),enriched);
    const persistence=hasDb?await saveDriverSalesLeadToPostgres(lead):{configured:false,ok:false,skipped:true};
    if(hasDb&&!persistence.ok)return NextResponse.json({ok:false,mode:'live',storage:'postgres',persistence,message:'PostgreSQL save failed.'},{status:503});
    const emailQueue=await queueCloseEmails(lead);
    const ownerText=[`Driver sales queue: ${lead.status}`,`Driver: ${lead.driver}`,`Lead: ${lead.leadName}`,`Contact: ${lead.phone||'no phone'} ${lead.email||'no email'}`,`Address: ${lead.address||'no address'}`,`Area / ZIP: ${lead.area} ${lead.zip}`,`Delivery zone: ${lead.deliveryZoneStatus||'unknown'} ${lead.deliveryZoneCity||''} ${lead.deliveryZoneRing||''} ${lead.deliveryZoneMinutes||''}`.trim(),`Delivery note: ${lead.deliveryZoneMessage||lead.deliveryZoneNotes||'none'}`,`Need: ${lead.need}`,`Offer: ${lead.offer}`,`Estimated value: ${lead.estimatedValue}`,`Source stop: ${lead.sourceStopId||'none'}`,`Note: ${lead.note}`,`Owner override: ${lead.ownerOverride||'none'}`,`Driver route plan: ${lead.driverRoutePlan||'none'}`].join('\n');
    const [ownerWebhook,sheetWebhook]=await Promise.allSettled([postJson(process.env.OPS_WEBHOOK_URL||process.env.LEADS_WEBHOOK_URL,{text:ownerText,driverSalesLead:lead}),postJson(process.env.OPS_GOOGLE_SHEETS_WEBHOOK_URL||process.env.LEADS_GOOGLE_SHEETS_WEBHOOK_URL,lead)]);
    return NextResponse.json({ok:true,mode:'live',storage:hasDb?'postgres':'memory',persistence,lead,emailQueue,notifications:{ownerWebhook:ownerWebhook.status==='fulfilled'?ownerWebhook.value:{configured:false,ok:false},googleSheets:sheetWebhook.status==='fulfilled'?sheetWebhook.value:{configured:false,ok:false}}});
  }catch(error){console.error('Driver sales queue failed:',error);return NextResponse.json({ok:false,message:'Driver sales queue failed'},{status:500});}
}
