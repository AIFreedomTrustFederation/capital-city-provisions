import { NextResponse } from 'next/server';
import { fullSystemSnapshot } from '../../../../lib/ccp-database';
import { aiTrainingDatasetFromPostgres, generateOwnerReportFromPostgres, getDriverSalesLeadsFromPostgres, getOrderLifecycleFromPostgres, postgresConfigured } from '../../../../lib/pg-database';

type Role='driver'|'owner';

function productionRequiresPostgres(){return process.env.NODE_ENV==='production'||process.env.CCP_REQUIRE_POSTGRES==='true'}
function accessRole(request:Request){const cookie=request.headers.get('cookie')||'';const match=cookie.match(/(?:^|; )ccp_access=([^;]+)/);return match?.[1]||''}
function canAccess(role:Role,access:string){return role==='owner'?access==='owner':access==='driver'||access==='owner'}
function clean(value:unknown){return String(value||'').trim()}

function routeMemoryFromOrders(orders:any[],driver='Driver'){
  const active=(orders||[]).filter((order:any)=>!['delivered','cancelled'].includes(order.status));
  const grouped=active.reduce((map:Record<string,any>,order:any)=>{
    const routeId=order.routeId||order.route_id||'unassigned';
    map[routeId]=map[routeId]||{id:routeId,name:routeId==='unassigned'?'Unassigned Live Route':routeId,day:order.deliveryDate||order.delivery_date||'TBD',window:order.deliveryWindow||order.delivery_window||'TBD',capacity:active.length||0,reserved:0,driver,priority:'Live orders from source of truth.',orders:[]};
    map[routeId].reserved+=1;
    map[routeId].orders.push({id:order.id,customer:order.customerName||order.customer_name,zip:order.zip,routeId,box:order.box,value:order.value,status:order.status,notes:order.notes,phone:order.phone,address:order.address});
    return map;
  },{});
  return Object.values(grouped);
}

function unavailable(role:Role){return NextResponse.json({ok:false,mode:'live',role,storage:'unavailable',databaseRequired:true,message:'PostgreSQL is required before live operations snapshots can be generated.'},{status:503})}

export async function GET(request:Request){
  try{
    const url=new URL(request.url);
    const role=(url.searchParams.get('role')==='owner'?'owner':'driver') as Role;
    const driver=clean(url.searchParams.get('driver'))||'Driver';
    const access=accessRole(request);
    if(!canAccess(role,access))return NextResponse.json({ok:false,role,message:`${role==='owner'?'Owner':'Driver'} access required`},{status:401});
    const hasDb=postgresConfigured();
    const dbRequired=productionRequiresPostgres();
    if(!hasDb&&dbRequired)return unavailable(role);

    if(hasDb){
      const [orders,report,trainingDataset,salesLeads]=await Promise.all([
        getOrderLifecycleFromPostgres(),
        role==='owner'?generateOwnerReportFromPostgres():Promise.resolve(null),
        role==='owner'?aiTrainingDatasetFromPostgres():Promise.resolve(null),
        getDriverSalesLeadsFromPostgres(),
      ]);
      if(role==='driver'){
        const routes=routeMemoryFromOrders(orders||[],driver);
        return NextResponse.json({ok:true,mode:'live',role,storage:'postgres',databaseRequired:dbRequired,snapshot:{driver,routes,orderLifecycle:orders,database:{orders,driverSalesLeads:salesLeads},ownerReport:null,trainingDataset:null}});
      }
      return NextResponse.json({ok:true,mode:'live',role:'owner',storage:'postgres',databaseRequired:dbRequired,snapshot:{mode:'live',routes:routeMemoryFromOrders(orders||[],'Driver'),orderLifecycle:orders,orders,ownerReport:report,trainingDataset,database:{orders,driverSalesLeads:salesLeads},storage:'postgres'}});
    }

    const fallback=fullSystemSnapshot({mode:'live'});
    if(role==='driver')return NextResponse.json({ok:true,mode:'live',role,storage:'memory',databaseRequired:dbRequired,snapshot:{driver,routes:routeMemoryFromOrders(fallback.orderLifecycle||[],driver),orderLifecycle:fallback.orderLifecycle,database:fallback.database,ownerReport:fallback.ownerReport,trainingDataset:fallback.trainingDataset}});
    return NextResponse.json({ok:true,mode:'live',role:'owner',storage:'memory',databaseRequired:dbRequired,snapshot:fallback});
  }catch(error){
    console.error('Live ops snapshot failed:',error);
    return NextResponse.json({ok:false,message:'Live ops snapshot failed'},{status:500});
  }
}
