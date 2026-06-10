import { NextResponse } from 'next/server';
import { createOrder, getOrderLifecycle } from '../../../../lib/ccp-database';
import { getOrderLifecycleFromPostgres, postgresConfigured, saveOrderToPostgres } from '../../../../lib/pg-database';

export async function GET(request:Request){
  const url=new URL(request.url);
  const orderId=url.searchParams.get('orderId')||undefined;
  if(postgresConfigured()){
    const orders=await getOrderLifecycleFromPostgres(orderId);
    return NextResponse.json({ok:true,mode:'live',storage:'postgres',orders});
  }
  return NextResponse.json({ok:true,mode:'live',storage:'memory',orders:getOrderLifecycle(orderId)});
}

export async function POST(request:Request){
  try{
    const input=await request.json();
    const order=createOrder(input);
    const persistence=postgresConfigured()?await saveOrderToPostgres(order):{configured:false,ok:false,skipped:true};
    const lifecycle=postgresConfigured()?((await getOrderLifecycleFromPostgres(order.id))||[])[0]:getOrderLifecycle(order.id)[0];
    return NextResponse.json({ok:true,mode:'live',storage:postgresConfigured()?'postgres':'memory',persistence,order,lifecycle});
  }catch(error){
    console.error('Order create failed:',error);
    return NextResponse.json({ok:false,message:'Order create failed'},{status:500});
  }
}
