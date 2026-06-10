import { NextResponse } from 'next/server';
import { aiTrainingDataset, fullSystemSnapshot, generateOwnerReport } from '../../../../lib/ccp-database';

export async function GET(request:Request){
  const url=new URL(request.url);
  const includeTraining=url.searchParams.get('training')==='1';
  return NextResponse.json({ok:true,mode:'live',report:generateOwnerReport(),trainingDataset:includeTraining?aiTrainingDataset():undefined,snapshot:includeTraining?fullSystemSnapshot():undefined});
}
