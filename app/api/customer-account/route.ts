import {NextResponse} from 'next/server';

type CustomerAccount={
  id:string;
  name:string;
  email:string;
  phone:string;
  zip:string;
  household:string;
  freezerSpace:string;
  preferredBox:string;
  restockInterest:boolean;
  giveawayInterest:boolean;
  notes:string;
  createdAt:string;
  updatedAt:string;
};

const memory=globalThis as typeof globalThis&{ccpCustomerAccounts?:CustomerAccount[]};

function records(){
  if(!memory.ccpCustomerAccounts)memory.ccpCustomerAccounts=[];
  return memory.ccpCustomerAccounts;
}

function clean(value:any){
  return String(value||'').trim();
}

function flag(value:any){
  return value===true||value==='true'||value==='on'||value==='yes';
}

export async function GET(){
  return NextResponse.json({ok:true,records:records().slice(0,200)});
}

export async function POST(request:Request){
  const input=await request.json().catch(()=>({}));
  const now=new Date().toISOString();
  const email=clean(input.email).toLowerCase();
  const phone=clean(input.phone);
  const list=records();
  const existing=list.find(item=>(email&&item.email===email)||(phone&&item.phone===phone));

  const account:CustomerAccount={
    id:existing?.id||`CUSTOMER-${Date.now()}`,
    name:clean(input.name)||'New Customer',
    email,
    phone,
    zip:clean(input.zip),
    household:clean(input.household),
    freezerSpace:clean(input.freezerSpace),
    preferredBox:clean(input.preferredBox)||clean(input.box)||'Premium Freezer Box',
    restockInterest:flag(input.restockInterest),
    giveawayInterest:flag(input.giveawayInterest),
    notes:clean(input.notes),
    createdAt:existing?.createdAt||now,
    updatedAt:now,
  };

  if(existing)Object.assign(existing,account);
  else list.unshift(account);

  return NextResponse.json({ok:true,record:account});
}
