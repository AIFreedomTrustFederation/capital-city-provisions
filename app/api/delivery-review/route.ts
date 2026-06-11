import {NextResponse} from 'next/server';

function clean(v:unknown){return String(v||'').trim().slice(0,500)}
function estimate(box:string){const b=box.toLowerCase();if(b.includes('big'))return 1200;if(b.includes('papa'))return 900;if(b.includes('mama'))return 650;if(b.includes('baby'))return 350;return 500}

export async function POST(request:Request){
  try{
    const input=await request.json();
    const zip=clean(input.zip||input.address);
    const box=clean(input.box||input.recommendation||input.package||'CCP freezer plan');
    const lead={
      id:`ccp-review-${Date.now()}`,
      driver:'Owner Follow-Up',
      sourceStopId:'ccp-concierge',
      sourceCustomer:'CCP Concierge',
      leadName:clean(input.name)||'Delivery Review Lead',
      email:clean(input.email),
      phone:clean(input.phone),
      address:clean(input.address),
      zip,
      area:clean(input.area),
      need:`Delivery review: ${box}`,
      offer:'Schedule delivery review and close freezer box plan',
      estimatedValue:Number(input.estimatedValue||estimate(box)),
      status:'queued',
      temperature:'warm',
      note:clean(input.note||`Household: ${clean(input.household)}. Proteins: ${clean(input.proteins)}. Budget: ${clean(input.budget)}.`),
      ownerOverride:'Customer requested CCP delivery review. Owner should confirm route, package fit, and timing before assigning close-out.',
      driverRoutePlan:'After owner approval, assign to driver for close-deal call, text, or delivery route follow-up.'
    };
    const url=new URL('/api/ops/driver-sales',request.url);
    const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(lead)});
    const result=await response.json().catch(()=>({ok:false}));
    return NextResponse.json({ok:response.ok&&result.ok,lead:result.lead||lead,next:'Owner Follow-Up Queue'});
  }catch(error){return NextResponse.json({ok:false,message:'Delivery review request failed'},{status:500})}
}
