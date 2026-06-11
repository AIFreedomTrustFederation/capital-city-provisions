import { NextResponse } from 'next/server';
import { customerSnapshot } from '../../../../lib/ops-memory';
import { getOrderLifecycleFromPostgres, getDriverSalesLeadsFromPostgres, generateOwnerReportFromPostgres, aiTrainingDatasetFromPostgres, postgresConfigured, getPgPool } from '../../../../lib/pg-database';

type WebAIRole='customer'|'driver'|'owner';

function clean(value:unknown){return String(value||'').trim()}
function productionRequiresPostgres(){return process.env.NODE_ENV==='production'||process.env.CCP_REQUIRE_POSTGRES==='true'}
function accessRole(request:Request){const cookie=request.headers.get('cookie')||'';const match=cookie.match(/(?:^|; )ccp_access=([^;]+)/);return match?.[1]||''}
function canAccess(requested:WebAIRole,access:string){if(requested==='customer')return true;if(requested==='driver')return access==='driver'||access==='owner';return access==='owner'}
function publicProductContext(){return {boxes:['Starter Box','Family Box','Rancher Box','Premium Owner Box'],topics:['freezer boxes','steak delivery','delivery route estimates','wholesale inquiries','cheesecake order bonus','free giveaway rules'],giveaway:{purchaseRequired:false,purchaseImprovesOdds:false,entryPath:'/giveaway'},promo:{cheesecake:'Limited order bonus for qualifying first freezer-box orders while supplies last. Keep separate from giveaway odds.'}}}
function unavailable(role:WebAIRole){return NextResponse.json({ok:false,role,storage:'unavailable',databaseRequired:true,message:'PostgreSQL is required before live WebAI operational context can be generated.'},{status:503})}
function ownerBrainSummary(orders:any[],salesLeads:any[]){
  const zipMap:Record<string,any>={};
  for(const order of orders||[]){const zip=clean(order.zip)||'unknown';zipMap[zip]=zipMap[zip]||{zip,orders:0,leads:0,value:0};zipMap[zip].orders+=1;zipMap[zip].value+=Number(order.value||0)}
  for(const lead of salesLeads||[]){const zip=clean(lead.zip)||'unknown';zipMap[zip]=zipMap[zip]||{zip,orders:0,leads:0,value:0};zipMap[zip].leads+=1;zipMap[zip].value+=Number(lead.estimatedValue||0)}
  const hotZips=Object.values(zipMap).sort((a:any,b:any)=>(b.value+b.orders*100+b.leads*75)-(a.value+a.orders*100+a.leads*75)).slice(0,5);
  const salesPriorities=(salesLeads||[]).map((lead:any)=>({id:lead.id,leadName:lead.leadName,status:lead.status,zip:lead.zip,estimatedValue:lead.estimatedValue,nextAction:['reserved','pitched'].includes(lead.status)?'Call or text now; route the box only if timing is real.':'Qualify timing, freezer space, need, and delivery ZIP.'})).sort((a:any,b:any)=>Number(b.estimatedValue||0)-Number(a.estimatedValue||0)).slice(0,5);
  const restockRisks=(orders||[]).filter((order:any)=>`${order.fulfillment||''} ${order.notes||''}`.toLowerCase().match(/partial|restock|blocked|issue/)).slice(0,8).map((order:any)=>({orderId:order.id,box:order.box,zip:order.zip,signal:order.fulfillment||order.notes||'restock risk'}));
  const recommendedActions=[] as string[];
  if(hotZips[0])recommendedActions.push(`Push demand in ${hotZips[0].zip}: ${hotZips[0].orders} order(s), ${hotZips[0].leads} lead(s), ${hotZips[0].value} attached value.`);
  if(restockRisks[0])recommendedActions.push(`Check inventory before promising ${restockRisks[0].box}.`);
  if(salesPriorities[0])recommendedActions.push(`Follow up with ${salesPriorities[0].leadName||'top sales lead'} first.`);
  if(!recommendedActions.length)recommendedActions.push('Create the first live order or driver sales lead, then the operator brain will prioritize the day.');
  return {recommendedActions,hotZips,salesPriorities,restockRisks};
}
async function setupProfile(role:'owner'|'driver'){
  const pool=getPgPool();
  if(!pool)return null;
  try{const result=await pool.query('select id,role,display_name,preferred_sender_email,default_department,backup_route,message_permissions,setup_complete,updated_at from ccp_user_profiles where id=$1 limit 1',[`${role}-default`]);return result.rows[0]||null}catch{return null}
}

export async function GET(request:Request){
  try{
    const url=new URL(request.url);
    const role=(clean(url.searchParams.get('role'))||'customer') as WebAIRole;
    const safeRole:WebAIRole=role==='owner'||role==='driver'||role==='customer'?role:'customer';
    const access=accessRole(request);
    if(!canAccess(safeRole,access))return NextResponse.json({ok:false,role:safeRole,message:`${safeRole==='owner'?'Owner':safeRole==='driver'?'Driver':'Customer'} access required`},{status:401});
    const hasDb=postgresConfigured();
    const dbRequired=productionRequiresPostgres();
    const zip=clean(url.searchParams.get('zip'));
    const driver=clean(url.searchParams.get('driver'))||'Driver';

    if(safeRole==='customer'){
      return NextResponse.json({ok:true,role:'customer',storage:'public',databaseRequired:false,context:{...customerSnapshot(zip),products:publicProductContext(),permissions:['customer-facing box help','delivery estimate help','promotion and giveaway explanation','wholesale inquiry intake'],blocked:['owner reports','profit/loss','driver tools','access codes','internal database details']}});
    }

    if(!hasDb&&dbRequired)return unavailable(safeRole);

    if(safeRole==='driver'){
      const profile=hasDb?await setupProfile('driver'):null;
      const orders=hasDb?await getOrderLifecycleFromPostgres():[];
      const salesLeads=hasDb?await getDriverSalesLeadsFromPostgres():[];
      const assignedOrders=(orders||[]).filter((order:any)=>!driver||String(order.driver||order.assignedDriver||driver).toLowerCase()===driver.toLowerCase()||String(order.routeId||'').toLowerCase().includes(driver.toLowerCase()));
      const driverSales=(salesLeads||[]).filter((lead:any)=>String(lead.driver||'').toLowerCase()===driver.toLowerCase());
      return NextResponse.json({ok:true,role:'driver',storage:hasDb?'postgres':'memory',databaseRequired:dbRequired,context:{mode:'live',driver,setupProfile:profile,orders:assignedOrders.slice(0,20),salesQueue:driverSales.slice(0,20),permissions:['assigned route help','stop notes','fulfillment status','restock issues','fuel and mileage','turn-ins','driver sales queue'],blocked:['owner profit/loss','all-customer exports','owner-only training review','access codes'],message:hasDb?'Driver context is generated from PostgreSQL source-of-truth records.':'Development fallback context; production should use PostgreSQL.'}});
    }

    const profile=hasDb?await setupProfile('owner'):null;
    const [orders,report,trainingDataset,salesLeads]=hasDb?await Promise.all([getOrderLifecycleFromPostgres(),generateOwnerReportFromPostgres(),aiTrainingDatasetFromPostgres(),getDriverSalesLeadsFromPostgres()]):[[],null,null,[]];
    const operatorBrain=ownerBrainSummary(orders||[],salesLeads||[]);
    return NextResponse.json({ok:true,role:'owner',storage:hasDb?'postgres':'memory',databaseRequired:dbRequired,context:{mode:'live',setupProfile:profile,orders:(orders||[]).slice(0,50),salesQueue:(salesLeads||[]).slice(0,30),operatorBrain,report,trainingSummary:{generatedAt:trainingDataset?.generatedAt||null,recordCount:trainingDataset?.records?.length||0,records:(trainingDataset?.records||[]).slice(0,20)},permissions:['orders','reports','operator brain','zip heat','sales priorities','profit/loss','restock planning','route learning','driver updates','sales queue','training review'],blocked:['customer-facing claims that purchase improves giveaway odds'],message:hasDb?'Owner context is generated from PostgreSQL source-of-truth records and operator brain signals.':'Development fallback context; production should use PostgreSQL.'}});
  }catch(error){
    console.error('WebAI context failed:',error);
    return NextResponse.json({ok:false,message:'WebAI context failed'},{status:500});
  }
}
