import { NextResponse } from 'next/server';
import { createOrder, getOrderLifecycle } from '../../../../lib/ccp-database';

export async function GET(request:Request){
  const url=new URL(request.url);
  const orderId=url.searchParams.get('orderId')||undefined;
  return NextResponse.json({ok:true,mode:'live',orders:getOrderLifecycle(orderId)});
}

export async function POST(request:Request){
  try{
    const input=await request.json();
    const order=createOrder(input);
    return NextResponse.json({ok:true,mode:'live',order,lifecycle:getOrderLifecycle(order.id)[0]});
  }catch(error){
    console.error('Order create failed:',error);
    return NextResponse.json({ok:false,message:'Order create failed'},{status:500});
  }
}
