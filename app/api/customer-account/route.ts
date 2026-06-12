import {NextResponse} from 'next/server';
import {getCustomerOperationsStore,upsertCustomerProfile} from '../../../lib/customer-operations';

export async function GET(){
  const store=getCustomerOperationsStore();
  return NextResponse.json({ok:true,records:store.customers.slice(0,200)});
}

export async function POST(request:Request){
  const input=await request.json().catch(()=>({}));
  const account=upsertCustomerProfile(input);
  return NextResponse.json({ok:true,record:account});
}
