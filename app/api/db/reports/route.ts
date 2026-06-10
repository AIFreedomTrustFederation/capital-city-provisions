import { NextResponse } from 'next/server';
import { aiTrainingDataset, fullSystemSnapshot, generateOwnerReport } from '../../../../lib/ccp-database';
import { aiTrainingDatasetFromPostgres, generateOwnerReportFromPostgres, postgresConfigured } from '../../../../lib/pg-database';

function productionRequiresPostgres(){return process.env.NODE_ENV==='production'||process.env.CCP_REQUIRE_POSTGRES==='true'}

export async function GET(request:Request){
  const url=new URL(request.url);
  const includeTraining=url.searchParams.get('training')==='1';
  const hasPostgres=postgresConfigured();
  if(hasPostgres){
    return NextResponse.json({ok:true,mode:'live',storage:'postgres',report:await generateOwnerReportFromPostgres(),trainingDataset:includeTraining?await aiTrainingDatasetFromPostgres():undefined});
  }
  if(productionRequiresPostgres())return NextResponse.json({ok:false,mode:'live',storage:'unavailable',databaseRequired:true,message:'PostgreSQL is required for production reports. Configure DATABASE_URL and apply database/schema.sql.'},{status:503});
  return NextResponse.json({ok:true,mode:'live',storage:'memory',report:generateOwnerReport(),trainingDataset:includeTraining?aiTrainingDataset():undefined,snapshot:includeTraining?fullSystemSnapshot():undefined});
}
