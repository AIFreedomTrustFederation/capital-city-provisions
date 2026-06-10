import { NextResponse } from 'next/server';
import { aiTrainingDataset } from '../../../../lib/ccp-database';
import { aiTrainingDatasetFromPostgres, postgresConfigured } from '../../../../lib/pg-database';

export async function GET(){
  const required=process.env.NODE_ENV==='production'||process.env.CCP_REQUIRE_POSTGRES==='true';
  const hasDb=postgresConfigured();
  if(hasDb){
    return NextResponse.json({ok:true,mode:'live',storage:'postgres',dataset:await aiTrainingDatasetFromPostgres()});
  }
  if(required)return NextResponse.json({ok:false,mode:'live',storage:'unavailable',databaseRequired:true,message:'PostgreSQL is required for production training exports.'},{status:503});
  return NextResponse.json({ok:true,mode:'live',storage:'memory',dataset:aiTrainingDataset()});
}
