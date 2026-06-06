import { NextResponse } from 'next/server';
import { applyDriverUpdate, getOrderLifecycle, type DatabaseMode } from '../../../../lib/ccp-database';

function modeFromRequest(request:Request):DatabaseMode{
  const url=new URL(request.url);
  return url.searchParams.get('sample')==='1'?'sample':'live';
}

export async function POST(request:Request){
  try{
    const mode=modeFromRequest(request);
    const input=await request.json();
    const update=applyDriverUpdate(input,{mode});
    return NextResponse.json({ok:true,mode,update,lifecycle:getOrderLifecycle(update.orderId,{mode})[0]});
  }catch(error){
    console.error('Driver update failed:',error);
    return NextResponse.json({ok:false,message:'Driver update failed'},{status:500});
  }
}
