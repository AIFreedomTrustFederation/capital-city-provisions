import { NextResponse } from 'next/server';
import { customerSnapshot, driverSnapshot, ownerSnapshot } from '../../../../lib/ops-memory';

export async function GET(request:Request){
  const url=new URL(request.url);
  const role=url.searchParams.get('role')||'owner';
  const zip=url.searchParams.get('zip')||'';
  const driver=url.searchParams.get('driver')||'Driver';
  if(role==='customer')return NextResponse.json({ok:true,role,memory:customerSnapshot(zip)});
  if(role==='driver')return NextResponse.json({ok:true,role,memory:driverSnapshot(driver)});
  return NextResponse.json({ok:true,role:'owner',memory:ownerSnapshot()});
}
