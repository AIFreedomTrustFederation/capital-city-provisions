import { NextResponse } from 'next/server';
import { applyDriverUpdate, getOrderLifecycle } from '../../../../lib/ccp-database';

export async function POST(request:Request){
  try{
    const input=await request.json();
    const update=applyDriverUpdate(input);
    return NextResponse.json({ok:true,update,lifecycle:getOrderLifecycle(update.orderId)[0]});
  }catch(error){
    console.error('Driver update failed:',error);
    return NextResponse.json({ok:false,message:'Driver update failed'},{status:500});
  }
}
