import { NextResponse } from 'next/server';
import { createOrder, getOrderLifecycle, type DatabaseMode } from '../../../../lib/ccp-database';

function modeFromRequest(request:Request):DatabaseMode{
  const url=new URL(request.url);
  return url.searchParams.get('sample')==='1'?'sample':'live';
}

export async function GET(request:Request){
  const url=new URL(request.url);
  const orderId=url.searchParams.get('orderId')||undefined;
  const mode=modeFromRequest(request);
  return NextResponse.json({ok:true,mode,orders:getOrderLifecycle(orderId,{mode})});
}

export async function POST(request:Request){
  try{
    const mode=modeFromRequest(request);
    const input=await request.json();
    const order=createOrder(input,{mode});
    return NextResponse.json({ok:true,mode,order,lifecycle:getOrderLifecycle(order.id,{mode})[0]});
  }catch(error){
    console.error('Order create failed:',error);
    return NextResponse.json({ok:false,message:'Order create failed'},{status:500});
  }
}
