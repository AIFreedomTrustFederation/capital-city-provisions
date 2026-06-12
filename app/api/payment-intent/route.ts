import {NextResponse} from 'next/server';

type PaymentStatus='pending'|'invoice-requested'|'deposit-requested'|'paid'|'cancelled'|'refunded';
type PaymentProvider='manual'|'stripe'|'square'|'btcpay'|'cash';

type PaymentIntentRecord={
  id:string;
  customerName:string;
  email:string;
  phone:string;
  zip:string;
  quoteId:string;
  orderId:string;
  box:string;
  amount:number;
  provider:PaymentProvider;
  status:PaymentStatus;
  note:string;
  ownerAction:string;
  createdAt:string;
  updatedAt:string;
};

const memory=globalThis as typeof globalThis&{ccpPaymentIntents?:PaymentIntentRecord[]};

function store(){
  if(!memory.ccpPaymentIntents)memory.ccpPaymentIntents=[];
  return memory.ccpPaymentIntents;
}

function clean(value:any){
  return String(value||'').trim();
}

function money(value:any){
  const n=Number(value||0);
  return Number.isFinite(n)&&n>0?n:0;
}

function accessRole(request:Request){
  const cookie=request.headers.get('cookie')||'';
  return cookie.match(/(?:^|; )ccp_access=([^;]+)/)?.[1]||'';
}

function provider(value:any):PaymentProvider{
  const raw=clean(value).toLowerCase();
  if(['stripe','square','btcpay','cash','manual'].includes(raw))return raw as PaymentProvider;
  return 'manual';
}

function status(value:any):PaymentStatus{
  const raw=clean(value).toLowerCase();
  if(['pending','invoice-requested','deposit-requested','paid','cancelled','refunded'].includes(raw))return raw as PaymentStatus;
  return 'pending';
}

function ownerAction(record:PaymentIntentRecord){
  if(record.status==='paid')return 'Confirm payment against quote/order, then schedule or release fulfillment.';
  if(record.provider==='manual')return 'Send manual invoice or payment link after confirming inventory and delivery timing.';
  if(record.provider==='stripe')return 'Create Stripe payment link or checkout session when Stripe is connected.';
  if(record.provider==='square')return 'Create Square invoice/payment link when Square is connected.';
  if(record.provider==='btcpay')return 'Create BTCPay invoice when BTCPay Server is connected.';
  if(record.provider==='cash')return 'Confirm cash-on-delivery policy before promising fulfillment.';
  return 'Review deposit intent and choose payment provider.';
}

export async function GET(request:Request){
  const role=accessRole(request);
  if(role!=='owner')return NextResponse.json({ok:false,message:'Owner access required'},{status:401});
  return NextResponse.json({ok:true,records:store().slice(0,250)});
}

export async function POST(request:Request){
  const input=await request.json().catch(()=>({}));
  const now=new Date().toISOString();

  const amount=money(input.amount)||50;
  const record:PaymentIntentRecord={
    id:clean(input.id)||`PAY-${Date.now()}-${Math.random().toString(36).slice(2,7)}`.toUpperCase(),
    customerName:clean(input.customerName)||clean(input.name)||'Customer',
    email:clean(input.email).toLowerCase(),
    phone:clean(input.phone),
    zip:clean(input.zip),
    quoteId:clean(input.quoteId),
    orderId:clean(input.orderId),
    box:clean(input.box)||clean(input.preferredBox)||'Freezer Box Quote',
    amount,
    provider:provider(input.provider),
    status:status(input.status)||'pending',
    note:clean(input.note),
    ownerAction:'',
    createdAt:now,
    updatedAt:now,
  };

  record.ownerAction=ownerAction(record);
  store().unshift(record);

  return NextResponse.json({
    ok:true,
    record,
    message:'Deposit intent saved. The team will confirm quote, inventory, delivery timing, and payment instructions before fulfillment.',
  });
}

export async function PATCH(request:Request){
  const role=accessRole(request);
  if(role!=='owner')return NextResponse.json({ok:false,message:'Owner access required'},{status:401});
  const input=await request.json().catch(()=>({}));
  const id=clean(input.id);
  const list=store();
  const record=list.find(item=>item.id===id);
  if(!record)return NextResponse.json({ok:false,message:'Payment intent not found'},{status:404});

  if(input.status)record.status=status(input.status);
  if(input.provider)record.provider=provider(input.provider);
  if(input.note!==undefined)record.note=clean(input.note);
  record.ownerAction=ownerAction(record);
  record.updatedAt=new Date().toISOString();

  return NextResponse.json({ok:true,record});
}
