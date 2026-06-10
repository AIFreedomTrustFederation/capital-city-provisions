import { NextRequest, NextResponse } from 'next/server';

const OWNER_PATHS=['/owner','/reports','/ops','/system-database'];
const DRIVER_PATHS=['/driver'];
const OWNER_API_PREFIXES=['/api/db','/api/reports'];
const DRIVER_API_PREFIXES=['/api/ops'];

function hasAccess(request:NextRequest,required:'driver'|'owner'){
  const access=request.cookies.get('ccp_access')?.value||'';
  if(required==='owner')return access==='owner';
  return access==='driver'||access==='owner';
}

function requiredRole(pathname:string):'driver'|'owner'|null{
  if(OWNER_PATHS.some(path=>pathname===path||pathname.startsWith(`${path}/`)))return 'owner';
  if(DRIVER_PATHS.some(path=>pathname===path||pathname.startsWith(`${path}/`)))return 'driver';
  if(OWNER_API_PREFIXES.some(path=>pathname===path||pathname.startsWith(`${path}/`)))return 'owner';
  if(DRIVER_API_PREFIXES.some(path=>pathname===path||pathname.startsWith(`${path}/`)))return 'driver';
  return null;
}

export function proxy(request:NextRequest){
  const role=requiredRole(request.nextUrl.pathname);
  if(!role||hasAccess(request,role))return NextResponse.next();
  if(request.nextUrl.pathname.startsWith('/api/'))return NextResponse.json({ok:false,message:'Internal access required'},{status:401});
  const url=request.nextUrl.clone();
  url.pathname='/internal-access';
  url.searchParams.set('role',role);
  url.searchParams.set('returnTo',request.nextUrl.pathname+request.nextUrl.search);
  return NextResponse.redirect(url);
}

export const config={matcher:['/driver/:path*','/owner/:path*','/reports/:path*','/ops/:path*','/system-database/:path*','/api/db/:path*','/api/reports/:path*','/api/ops/:path*']};
