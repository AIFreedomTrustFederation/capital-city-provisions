import { NextResponse } from 'next/server';

function expectedCode(role:string){
  if(role==='owner')return process.env.OWNER_ACCESS_CODE||'OWNER2026';
  if(role==='driver')return process.env.DRIVER_ACCESS_CODE||'DRIVER2026';
  return '';
}

export async function POST(request:Request){
  try{
    const {role,code}=await request.json();
    const normalizedRole=role==='owner'?'owner':'driver';
    const submitted=String(code||'').trim().toUpperCase();
    const expected=expectedCode(normalizedRole).trim().toUpperCase();
    const valid=submitted===expected;
    if(!valid)return NextResponse.json({ok:false,message:'Access code not recognized'},{status:401});
    const response=NextResponse.json({ok:true,role:normalizedRole});
    response.cookies.set('ccp_access',normalizedRole,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*12});
    return response;
  }catch(error){
    return NextResponse.json({ok:false,message:'Access check failed'},{status:500});
  }
}

export async function DELETE(){
  const response=NextResponse.json({ok:true});
  response.cookies.set('ccp_access','',{httpOnly:true,path:'/',maxAge:0});
  return response;
}
