import {NextResponse} from 'next/server';
import {createCustomerRating,getCustomerOperationsStore} from '../../../lib/customer-operations';

export async function GET(){
  const store=getCustomerOperationsStore();
  return NextResponse.json({ok:true,records:store.ratings.slice(0,200)});
}

export async function POST(request:Request){
  const input=await request.json().catch(()=>({}));
  const {customer,rating}=createCustomerRating(input);
  return NextResponse.json({ok:true,record:rating,customer});
}
