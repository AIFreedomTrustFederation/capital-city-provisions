import { NextResponse } from 'next/server';
import { customerSnapshot } from '../../../../lib/ops-memory';
import { getOrderLifecycleFromPostgres, getDriverSalesLeadsFromPostgres, generateOwnerReportFromPostgres, aiTrainingDatasetFromPostgres, postgresConfigured } from '../../../../lib/pg-database';

type WebAIRole='customer'|'driver'|'owner';

function clean(value:unknown){return String(value||'').trim()}
function productionRequiresPostgres(){return process.env.NODE_ENV==='production'||process.env.CCP_REQUIRE_POSTGRES==='true'}
function accessRole(request:Request){const cookie=request.headers.get('cookie')||'';const match=cookie.match(/(?:^|; )ccp_access=([^;]+)/);return match?.[1]||''}
function canAccess(requested:WebAIRole,access:string){if(requested==='customer')return true;if(requested==='driver')return access==='driver'||access==='owner';return access==='owner'}
function publicProductContext(){return {boxes:['Starter Box','Family Box','Rancher Box','Premium Owner Box'],topics:['freezer boxes','steak delivery','delivery route estimates','wholesale inquiries','cheesecake order bonus','free giveaway rules'],giveaway:{purchaseRequired:false,purchaseImprovesOdds:false,entryPath:'/giveaway'},promo:{cheesecake:'Limited order bonus for qualifying first freezer-box orders while supplies last. Keep separate from giveaway odds.'}}}
function unavailable(role:WebAIRole){return NextResponse.json({ok:false,role,storage:'unavailable',databaseRequired:true,message:'PostgreSQL is required before live WebAI operational context can be generated.'},{status:503})}

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
      const orders=hasDb?await getOrderLifecycleFromPostgres():[];
      const salesLeads=hasDb?await getDriverSalesLeadsFromPostgres():[];
      const assignedOrders=(orders||[]).filter((order:any)=>!driver||String(order.driver||order.assignedDriver||driver).toLowerCase()===driver.toLowerCase()||String(order.routeId||'').toLowerCase().includes(driver.toLowerCase()));
      const driverSales=(salesLeads||[]).filter((lead:any)=>String(lead.driver||'').toLowerCase()===driver.toLowerCase());
      return NextResponse.json({ok:true,role:'driver',storage:hasDb?'postgres':'memory',databaseRequired:dbRequired,context:{mode:'live',driver,orders:assignedOrders.slice(0,20),salesQueue:driverSales.slice(0,20),permissions:['assigned route help','stop notes','fulfillment status','restock issues','fuel and mileage','turn-ins','driver sales queue'],blocked:['owner profit/loss','all-customer exports','owner-only training review','access codes'],message:hasDb?'Driver context is generated from PostgreSQL source-of-truth records.':'Development fallback context; production should use PostgreSQL.'}});
    }

    const [orders,report,trainingDataset]=hasDb?await Promise.all([getOrderLifecycleFromPostgres(),generateOwnerReportFromPostgres(),aiTrainingDatasetFromPostgres()]):[[],null,null];
    return NextResponse.json({ok:true,role:'owner',storage:hasDb?'postgres':'memory',databaseRequired:dbRequired,context:{mode:'live',orders:(orders||[]).slice(0,50),report,trainingSummary:{generatedAt:trainingDataset?.generatedAt||null,recordCount:trainingDataset?.records?.length||0,records:(trainingDataset?.records||[]).slice(0,20)},permissions:['orders','reports','profit/loss','restock planning','route learning','driver updates','sales queue','training review'],blocked:['customer-facing claims that purchase improves giveaway odds'],message:hasDb?'Owner context is generated from PostgreSQL source-of-truth records.':'Development fallback context; production should use PostgreSQL.'}});
  }catch(error){
    console.error('WebAI context failed:',error);
    return NextResponse.json({ok:false,message:'WebAI context failed'},{status:500});
  }
}
