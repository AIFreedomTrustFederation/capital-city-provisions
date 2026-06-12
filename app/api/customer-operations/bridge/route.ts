import {NextResponse} from 'next/server';
import {getCustomerOperationsStore} from '../../../../lib/customer-operations';

function accessRole(request:Request){
  const cookie=request.headers.get('cookie')||'';
  return cookie.match(/(?:^|; )ccp_access=([^;]+)/)?.[1]||'';
}

export async function GET(request:Request){
  const role=accessRole(request);
  if(role!=='owner')return NextResponse.json({ok:false,message:'Owner access required'},{status:401});
  const store=getCustomerOperationsStore();
  const records=store.ops
    .filter(item=>item.status!=='closed')
    .map(item=>item.internalBoardRecord)
    .filter(Boolean);
  return NextResponse.json({ok:true,records});
}
