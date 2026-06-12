import {NextResponse} from 'next/server';

type RatingRecord={
  id:string;
  name:string;
  email:string;
  phone:string;
  orderId:string;
  rating:number;
  loved:string;
  improve:string;
  reorderInterest:boolean;
  restockInterest:boolean;
  sharePermission:boolean;
  status:'excellent'|'good'|'needs-recovery';
  createdAt:string;
};

const memory=globalThis as typeof globalThis&{ccpCustomerRatings?:RatingRecord[]};

function records(){
  if(!memory.ccpCustomerRatings)memory.ccpCustomerRatings=[];
  return memory.ccpCustomerRatings;
}

function clean(value:any){
  return String(value||'').trim();
}

function flag(value:any){
  return value===true||value==='true'||value==='on'||value==='yes';
}

function score(value:any){
  const n=Number(value||0);
  if(!Number.isFinite(n))return 5;
  return Math.max(1,Math.min(5,Math.round(n)));
}

function statusFromScore(value:number):RatingRecord['status']{
  if(value>=5)return 'excellent';
  if(value>=4)return 'good';
  return 'needs-recovery';
}

export async function GET(){
  return NextResponse.json({ok:true,records:records().slice(0,200)});
}

export async function POST(request:Request){
  const input=await request.json().catch(()=>({}));
  const rating=score(input.rating);
  const record:RatingRecord={
    id:`RATING-${Date.now()}`,
    name:clean(input.name)||'Customer',
    email:clean(input.email).toLowerCase(),
    phone:clean(input.phone),
    orderId:clean(input.orderId),
    rating,
    loved:clean(input.loved),
    improve:clean(input.improve),
    reorderInterest:flag(input.reorderInterest),
    restockInterest:flag(input.restockInterest),
    sharePermission:flag(input.sharePermission),
    status:statusFromScore(rating),
    createdAt:new Date().toISOString(),
  };

  records().unshift(record);
  return NextResponse.json({ok:true,record});
}
