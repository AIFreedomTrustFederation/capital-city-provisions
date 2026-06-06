import { NextResponse } from 'next/server';
import { aiTrainingDataset } from '../../../../lib/ccp-database';

export async function GET(){return NextResponse.json({ok:true,dataset:aiTrainingDataset()});}
