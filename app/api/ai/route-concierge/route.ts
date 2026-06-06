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
