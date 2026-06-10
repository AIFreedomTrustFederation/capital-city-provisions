import { NextResponse } from 'next/server';
import { aiTrainingDataset } from '../../../../lib/ccp-database';
import { aiTrainingDatasetFromPostgres, postgresConfigured } from '../../../../lib/pg-database';

export async function GET(){
  if(postgresConfigured()){
    return NextResponse.json({ok:true,mode:'live',storage:'postgres',dataset:await aiTrainingDatasetFromPostgres()});
  }
  return NextResponse.json({ok:true,mode:'live',storage:'memory',dataset:aiTrainingDataset()});
}
