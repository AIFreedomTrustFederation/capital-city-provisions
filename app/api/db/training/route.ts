import { NextResponse } from 'next/server';
import { aiTrainingDataset, type DatabaseMode } from '../../../../lib/ccp-database';

function modeFromRequest(request:Request):DatabaseMode{
  const url=new URL(request.url);
  return url.searchParams.get('sample')==='1'?'sample':'live';
}

export async function GET(request:Request){
  const mode=modeFromRequest(request);
  return NextResponse.json({ok:true,mode,dataset:aiTrainingDataset({mode})});
}
