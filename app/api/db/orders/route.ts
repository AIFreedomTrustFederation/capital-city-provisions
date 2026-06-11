import { NextResponse } from 'next/server';
import { buildOrderRecord, createOrder, getOrderLifecycle } from '../../../../lib/ccp-database';
import { getOrderLifecycleFromPostgres, postgresConfigured, saveOrderToPostgres } from '../../../../lib/pg-database';

function productionRequiresPostgres(){
  return process.env.NODE_ENV==='production'||process.env.CCP_REQUIRE_POSTGRES==='true';
}

function postgresRequired(action:string){
  return NextResponse.json({ok:false,mode:'live',storage:'unavailable',databaseRequired:true,message:`PostgreSQL is required for ${action}. Configure DATABASE_URL and apply database/schema.sql before using live operations.`},{status:503});
}

export async function GET(request:Request){
  const url=new URL(request.url);
  const orderId=url.searchParams.get('orderId')||undefined;
  const hasPostgres=postgresConfigured();
  if(hasPostgres){
    const orders=await getOrderLifecycleFromPostgres(orderId);
    return NextResponse.json({ok:true,mode:'live',storage:'postgres',orders});
  }
  if(productionRequiresPostgres())return postgresRequired('reading live orders');
  return NextResponse.json({ok:true,mode:'live',storage:'memory',orders:getOrderLifecycle(orderId)});
}

export async function POST(request:Request){
  try{
    const hasPostgres=postgresConfigured();
    if(!hasPostgres&&productionRequiresPostgres())return postgresRequired('creating live orders');
    const input=await request.json();
    const order=hasPostgres?buildOrderRecord(input):createOrder(input);
    const persistence=hasPostgres?await saveOrderToPostgres(order):{configured:false,ok:false,skipped:true};
    if(hasPostgres&&!persistence.ok)return NextResponse.json({ok:false,mode:'live',storage:'postgres',persistence,message:'Order was not saved to PostgreSQL. Live order creation was rejected to protect the source of truth.'},{status:503});
    const lifecycle=hasPostgres?((await getOrderLifecycleFromPostgres(order.id))||[])[0]:getOrderLifecycle(order.id)[0];
    return NextResponse.json({ok:true,mode:'live',storage:hasPostgres?'postgres':'memory',persistence,order,lifecycle});
  }catch(error){
    console.error('Order create failed:',error);
    return NextResponse.json({ok:false,message:'Order create failed'},{status:500});
  }
}
