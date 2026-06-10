import { NextResponse } from 'next/server';
import { customerSnapshot, driverSnapshot, ownerSnapshot } from '../../../../lib/ops-memory';

function accessRole(request:Request){
  const cookie=request.headers.get('cookie')||'';
  const match=cookie.match(/(?:^|; )ccp_access=([^;]+)/);
  return match?.[1]||'';
}

export async function GET(request:Request){
  const url=new URL(request.url);
  const requestedRole=url.searchParams.get('role')||'owner';
  const zip=url.searchParams.get('zip')||'';
  const driver=url.searchParams.get('driver')||'Driver';
  const access=accessRole(request);

  if(requestedRole==='customer')return NextResponse.json({ok:true,role:'customer',memory:customerSnapshot(zip)});
  if(requestedRole==='driver'){
    if(access!=='driver'&&access!=='owner')return NextResponse.json({ok:false,message:'Driver access required'},{status:401});
    return NextResponse.json({ok:true,role:'driver',memory:driverSnapshot(driver)});
  }
  if(access!=='owner')return NextResponse.json({ok:false,message:'Owner access required'},{status:401});
  return NextResponse.json({ok:true,role:'owner',memory:ownerSnapshot()});
}
