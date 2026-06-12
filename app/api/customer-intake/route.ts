import {NextResponse} from 'next/server';
import {createOrder} from '../../../lib/ccp-database';

type IntakeRecord={
  id:string;
  name:string;
  email:string;
  phone:string;
  zip:string;
  box:string;
  proteins:string;
  value:number;
  household:string;
  freezerSpace:string;
  interest:string;
  notes:string;
  orderId:string;
  createdAt:string;
};

const memory=globalThis as typeof globalThis&{ccpCustomerIntake?:IntakeRecord[]};

function records(){
  if(!memory.ccpCustomerIntake)memory.ccpCustomerIntake=[];
  return memory.ccpCustomerIntake;
}

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
  return NextResponse.json({ok:true,records:records().slice(0,200)});
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

  const record:IntakeRecord={
    id:`INTAKE-${Date.now()}`,
    name:clean(input.name)||'New Customer',
    email:clean(input.email).toLowerCase(),
    phone:clean(input.phone),
    zip:clean(input.zip),
    box,
    proteins:clean(input.proteins),
    value,
    household:clean(input.household),
    freezerSpace:clean(input.freezerSpace),
    interest:clean(input.interest)||'Freezer box quote request',
    notes:clean(input.notes),
    orderId:order.id,
    createdAt,
  };

  records().unshift(record);
  return NextResponse.json({ok:true,record,order});
}
