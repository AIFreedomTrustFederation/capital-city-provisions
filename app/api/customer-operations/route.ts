import {NextResponse} from 'next/server';
import {getCustomerOperationsStore,summarizeCustomerOperations,createCustomerOpsItem,findCustomer} from '../../../lib/customer-operations';

function clean(value:any){
  return String(value||'').trim();
}

export async function GET(){
  const store=getCustomerOperationsStore();
  return NextResponse.json({
    ok:true,
    summary:summarizeCustomerOperations(),
    customers:store.customers.slice(0,200),
    quotes:store.quotes.slice(0,200),
    ratings:store.ratings.slice(0,200),
    ops:store.ops.slice(0,300),
  });
}

export async function POST(request:Request){
  const input=await request.json().catch(()=>({}));
  const customer=findCustomer({id:input.customerId,email:input.customerEmail,phone:input.phone});
  if(!customer){
    return NextResponse.json({ok:false,message:'Customer not found for operations item.'},{status:400});
  }

  const item=createCustomerOpsItem({
    kind:input.kind||'customer-profile',
    customer,
    subject:clean(input.subject)||`Customer Operation: ${customer.name}`,
    body:clean(input.body)||'Customer operation item created.',
    priority:input.priority||'normal',
    status:input.status||'open',
    ownerAction:clean(input.ownerAction)||'Review customer operation item.',
    orderId:clean(input.orderId),
    quoteId:clean(input.quoteId),
    ratingId:clean(input.ratingId),
    metadata:input.metadata||{},
  });

  return NextResponse.json({ok:true,item,summary:summarizeCustomerOperations()});
}
