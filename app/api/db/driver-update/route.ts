import { NextResponse } from 'next/server';
import { applyDriverUpdate, getOrderLifecycle } from '../../../../lib/ccp-database';
import { getOrderLifecycleFromPostgres, postgresConfigured, saveDriverUpdateToPostgres } from '../../../../lib/pg-database';

export async function POST(request:Request){
  try{
    const input=await request.json();
    const update=applyDriverUpdate(input);
    const persistence=postgresConfigured()?await saveDriverUpdateToPostgres(update):{configured:false,ok:false,skipped:true};
    const lifecycle=postgresConfigured()?((await getOrderLifecycleFromPostgres(update.orderId))||[])[0]:getOrderLifecycle(update.orderId)[0];
    return NextResponse.json({ok:true,mode:'live',storage:postgresConfigured()?'postgres':'memory',persistence,update,lifecycle});
  }catch(error){
    console.error('Driver update failed:',error);
    return NextResponse.json({ok:false,message:'Driver update failed'},{status:500});
  }
}
