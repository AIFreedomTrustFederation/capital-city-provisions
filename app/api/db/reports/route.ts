import { NextResponse } from 'next/server';
import { aiTrainingDataset, fullSystemSnapshot, generateOwnerReport } from '../../../../lib/ccp-database';
import { aiTrainingDatasetFromPostgres, generateOwnerReportFromPostgres, postgresConfigured } from '../../../../lib/pg-database';

export async function GET(request:Request){
  const url=new URL(request.url);
  const includeTraining=url.searchParams.get('training')==='1';
  if(postgresConfigured()){
    return NextResponse.json({ok:true,mode:'live',storage:'postgres',report:await generateOwnerReportFromPostgres(),trainingDataset:includeTraining?await aiTrainingDatasetFromPostgres():undefined});
  }
  return NextResponse.json({ok:true,mode:'live',storage:'memory',report:generateOwnerReport(),trainingDataset:includeTraining?aiTrainingDataset():undefined,snapshot:includeTraining?fullSystemSnapshot():undefined});
}
