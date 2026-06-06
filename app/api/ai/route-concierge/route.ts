import { NextResponse } from 'next/server';

type ConciergeInput=Record<string,any>;

function clean(value:unknown){return String(value||'').trim();}

function routePlan(zip=''){
  const cleanZip=(zip.match(/\d{5}/)?.[0]||'').trim();
  const routes:Record<string,any>={
    '95628':{route:'Fair Oaks / Carmichael Route',day:'Tuesday',window:'3-7 PM',status:'Delivery available',capacity:12,reserved:7,slotsRemaining:5,fill:58},
    '95608':{route:'Fair Oaks / Carmichael Route',day:'Tuesday',window:'3-7 PM',status:'Delivery available',capacity:12,reserved:7,slotsRemaining:5,fill:58},
    '95661':{route:'Roseville Route',day:'Wednesday',window:'2-6 PM',status:'Confirmed route',capacity:12,reserved:9,slotsRemaining:3,fill:75},
    '95678':{route:'Roseville Route',day:'Wednesday',window:'2-6 PM',status:'Confirmed route',capacity:12,reserved:9,slotsRemaining:3,fill:75},
    '95765':{route:'Rocklin / Lincoln Route',day:'Thursday',window:'2-6 PM',status:'Almost full',capacity:12,reserved:10,slotsRemaining:2,fill:83},
    '95677':{route:'Rocklin / Lincoln Route',day:'Thursday',window:'2-6 PM',status:'Almost full',capacity:12,reserved:10,slotsRemaining:2,fill:83},
    '95648':{route:'Rocklin / Lincoln Route',day:'Thursday',window:'2-6 PM',status:'Almost full',capacity:12,reserved:10,slotsRemaining:2,fill:83},
    '95630':{route:'Folsom / Orangevale Route',day:'Friday',window:'2-6 PM',status:'Building route',capacity:12,reserved:5,slotsRemaining:7,fill:42},
    '95662':{route:'Folsom / Orangevale Route',day:'Friday',window:'2-6 PM',status:'Building route',capacity:12,reserved:5,slotsRemaining:7,fill:42}
  };
  return routes[cleanZip]||{route:'Expansion / Waitlist Route',day:'Next grouped route',window:'To be confirmed',status:'Join waitlist',capacity:12,reserved:0,slotsRemaining:12,fill:0};
}

function fallbackRecommendation(input:ConciergeInput){
  if(clean(input.role)==='driver'){
    const stops=Array.isArray(input.stops)?input.stops:[];
    const states=input.stopStates||{};
    const turnIn=input.turnIn||{};
    const activeStop=input.activeStop||stops[0]||{};
    const openStops=stops.filter((stop:any)=>states?.[stop.id]?.status!=='delivered');
    const issueStops=stops.filter((stop:any)=>states?.[stop.id]?.status==='issue'||states?.[stop.id]?.fulfillment==='partial'||states?.[stop.id]?.fulfillment==='restock-blocked'||states?.[stop.id]?.issue);
    const nextStop=openStops.find((stop:any)=>states?.[stop.id]?.status==='out-for-delivery')||openStops.sort((a:any,b:any)=>(b.value||0)-(a.value||0))[0]||activeStop;
    const intent=clean(input.intent);
    const driverAnswer=intent==='driver-sales-route'
      ? input.salesIntent==='queue'
        ? `Queue guidance: confirm ${activeStop.customer||'the current stop'} is handled, then capture ${input.lead?.name||'the next lead'} with ZIP, protein interest, box size, callback time, and route fit. Reserve the next sale only after the customer understands final confirmation comes from the team.`
        : `Sales script: keep it short and local. "Your area is already active on our route. I can note the box you want, queue the next freezer plan, and have the team confirm route timing and final details before anything is locked in."`
      : intent==='customerText'
      ? `Text draft: Hi, this is Capital City Provisions. Your ${activeStop.box||'order'} is on today's ${activeStop.routeName||'route'}. We are heading your way in the ${activeStop.window||'delivery'} window. Reply with any gate, parking, or drop-off note.`
      : intent==='issue'
        ? issueStops.length?`Issue review: ${issueStops.map((stop:any)=>`${stop.id} ${stop.customer}: ${states?.[stop.id]?.fulfillment||'issue'} ${states?.[stop.id]?.issue||''}`.trim()).join(' | ')}`:'No issue stops are flagged yet. Mark partial, restock-blocked, or add a voice issue as soon as a shortage appears.'
        : intent==='turnIn'
          ? `Turn-in prep: delivered ${Object.values(states).filter((state:any)=>state.status==='delivered').length}/${stops.length}, missed ${turnIn.missed||'0'}, rescheduled ${turnIn.rescheduled||'0'}, miles ${turnIn.milesDriven||'not entered'}. Add payments and owner follow-up before submitting.`
          : intent==='route'
            ? `Route summary: ${stops.length} stops, ${openStops.length} open, ${issueStops.length} issue flags. Keep call-ahead notes current, handle premium boxes carefully, and close restock blockers before turn-in.`
            : nextStop?.id?`Next best move: work ${nextStop.id} for ${nextStop.customer}. Box: ${nextStop.box}. ${nextStop.notes||'Confirm delivery details before arrival.'}`:'All visible stops are marked delivered. Start the turn-in and flag owner follow-up.';
    return {driverAnswer,role:'driver',source:'driver-rules-fallback',nextStop:nextStop?.id||null,openStops:openStops.length,issueStops:issueStops.length};
  }
  const zip=clean(input.zip||input.address);
  const route=routePlan(zip);
  const budget=clean(input.budget)||'$300-$500';
  const familySize=clean(input.familySize).toLowerCase();
  const interest=clean(input.interest).toLowerCase();
  const recommendation=interest.includes('wholesale')?'Wholesale Provisioning Account':familySize.includes('5')||familySize.includes('7')?'Family Box':'Starter Box';
  return {
    route,
    recommendation,
    budget,
    promo:{code:'CHEESECAKE-48',deadlineHours:48,description:'Free cheesecake with a qualifying first freezer-box order reserved within 48 hours of route check, while supplies last.'},
    giveaway:{available:true,entryPath:'/giveaway',purchaseRequired:false,purchaseImprovesOdds:false},
    ownerNote:'Use this recommendation for customer engagement. Do not claim fake scarcity and do not connect giveaway odds to purchase.'
  };
}

async function askSelfHostedModel(input:ConciergeInput){
  const url=process.env.AI_CONCIERGE_URL;
  if(!url)return null;
  const model=process.env.AI_CONCIERGE_MODEL||'local-route-concierge';
  const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json',...(process.env.AI_CONCIERGE_API_KEY?{Authorization:`Bearer ${process.env.AI_CONCIERGE_API_KEY}`}:{})},body:JSON.stringify({
    model,
    temperature:0.2,
    response_format:{type:'json_object'},
    messages:[
      {role:'system',content:'You are the Capital City Provisions route concierge. Return strict JSON only. Be useful, local, and honest. Never say purchase improves giveaway odds. Never invent fake scarcity. Keep giveaways no-purchase and separate from order bonuses.'},
      {role:'user',content:JSON.stringify({lead:input,deterministicRoute:routePlan(clean(input.zip||input.address))})}
    ]
  })});
  if(!response.ok)return null;
  const data=await response.json();
  const content=data?.choices?.[0]?.message?.content;
  if(!content)return data;
  try{return JSON.parse(content)}catch{return {raw:content}}
}

export async function POST(request:Request){
  try{
    const input=await request.json();
    const modelAnswer=await askSelfHostedModel(input);
    return NextResponse.json({ok:true,source:modelAnswer?'self-hosted-open-source-llm':'rules-fallback',recommendation:modelAnswer||fallbackRecommendation(input)});
  }catch(error){
    return NextResponse.json({ok:false,message:'AI route concierge failed',fallback:fallbackRecommendation({})},{status:500});
  }
}
