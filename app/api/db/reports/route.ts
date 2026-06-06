import { NextResponse } from 'next/server';
import { aiTrainingDataset, fullSystemSnapshot, generateOwnerReport, type DatabaseMode } from '../../../../lib/ccp-database';

function modeFromRequest(request:Request):DatabaseMode{
  const url=new URL(request.url);
  return url.searchParams.get('sample')==='1'?'sample':'live';
}

export async function GET(request:Request){
  const url=new URL(request.url);
  const includeTraining=url.searchParams.get('training')==='1';
  const mode=modeFromRequest(request);
  return NextResponse.json({ok:true,mode,report:generateOwnerReport({mode}),trainingDataset:includeTraining?aiTrainingDataset({mode}):undefined,snapshot:includeTraining?fullSystemSnapshot({mode}):undefined});
}
