import {NextResponse} from 'next/server';
import {createOrder} from '../../../lib/ccp-database';
import {createQuoteRequest,getCustomerOperationsStore} from '../../../lib/customer-operations';

function clean(value:any){
  return String(value||'').trim();
}

function money(value:any){
  const n=Number(value||0);
  return Number.isFinite(n)?n:0;
}

function products(input:any){
  const raw=clean(input.proteins)||clean(input.box)||'Premium proteins';
  return raw.split(',').map((name:string,index:number)=>({
    sku:`CUSTOM-${index+1}`,
    name:name.trim()||'Premium protein',
    qty:1,
    unit:'selection',
    fulfilled:0,
  }));
}

export async function GET(){
  const store=getCustomerOperationsStore();
  return NextResponse.json({ok:true,records:store.quotes.slice(0,200)});
}

export async function POST(request:Request){
  const input=await request.json().catch(()=>({}));
  const createdAt=new Date().toISOString();
  const value=money(input.value)||497;
  const box=clean(input.box)||clean(input.preferredBox)||'Premium Freezer Box';

  const order=createOrder({
    customerName:clean(input.name)||'New Customer',
    email:clean(input.email).toLowerCase(),
    phone:clean(input.phone),
    zip:clean(input.zip),
    routeId:'quote-request',
    box,
    status:'lead',
    fulfillment:'pending',
    value,
    products:products({...input,box}),
    notes:[
      clean(input.interest)||'Freezer box quote request',
      clean(input.household)&&`Household: ${clean(input.household)}`,
      clean(input.freezerSpace)&&`Freezer space: ${clean(input.freezerSpace)}`,
      clean(input.notes),
    ].filter(Boolean).join(' | '),
    createdAt,
  });

  const {customer,quote}=createQuoteRequest({...input,box,value,orderId:order.id});
  return NextResponse.json({ok:true,record:quote,customer,order});
}
