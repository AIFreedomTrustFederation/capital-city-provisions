import { NextResponse } from 'next/server';
import { applyDriverUpdate, getOrderLifecycle } from '../../../../lib/ccp-database';
import { getOrderLifecycleFromPostgres, postgresConfigured, saveDriverUpdateToPostgres } from '../../../../lib/pg-database';

export async function POST(request:Request){
  try{
    const required=process.env.NODE_ENV==='production'||process.env.CCP_REQUIRE_POSTGRES==='true';
    const hasDb=postgresConfigured();
    if(required&&!hasDb)return NextResponse.json({ok:false,mode:'live',storage:'unavailable',databaseRequired:true,message:'PostgreSQL is required for live fulfillment writes.'},{status:503});
    const input=await request.json();
    const update=applyDriverUpdate(input);
    const persistence=hasDb?await saveDriverUpdateToPostgres(update):{configured:false,ok:false,skipped:true};
    if(hasDb&&!persistence.ok)return NextResponse.json({ok:false,mode:'live',storage:'postgres',persistence,message:'PostgreSQL save failed.'},{status:503});
    const lifecycle=hasDb?((await getOrderLifecycleFromPostgres(update.orderId))||[])[0]:getOrderLifecycle(update.orderId)[0];
    return NextResponse.json({ok:true,mode:'live',storage:hasDb?'postgres':'memory',persistence,update,lifecycle});
  }catch(error){
    console.error('Fulfillment write failed:',error);
    return NextResponse.json({ok:false,message:'Fulfillment write failed'},{status:500});
  }
}
