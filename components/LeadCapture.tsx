'use client';
import {useEffect,useState} from 'react';
import LocalAIConcierge from './LocalAIConcierge';

const ZIP_STORAGE_KEY='ccp_delivery_zip';
const LATEST_LEAD_KEY='ccp_latest_lead';
const PROMO_HOURS=48;

const steps=[
  {key:'address',bot:'What delivery ZIP code should we check first?',type:'text',placeholder:'ZIP code or delivery area'},
  {key:'familySize',bot:'How many people are you feeding?',type:'select',options:['1-2 people','3-4 people','5-6 people','7+ people','Wholesale / Event']},
  {key:'name',bot:'Great. What name should we put on the route request?',type:'text',placeholder:'Full name'},
  {key:'email',bot:'What email should we send freezer-box details to?',type:'email',placeholder:'Email address'},
  {key:'phone',bot:'What phone number can we use for delivery follow-up?',type:'tel',placeholder:'Phone number'},
  {key:'interest',bot:'Now let us match the right box. What brings you here today?',type:'select',options:['Family Freezer Box','Steak Lovers Club','Surf & Turf Club','Wholesale Account','Custom Freezer Restock']},
  {key:'proteins',bot:'Which proteins do you want most?',type:'select',options:['Mostly Beef','Beef + Chicken','Surf & Turf','Mixed Family Pack','Pork + Ribs','Custom Mix']},
  {key:'budget',bot:'What monthly freezer budget feels comfortable?',type:'select',options:['$200-$300','$300-$500','$500-$750','$750-$1,000','$1,000+']},
  {key:'message',bot:'Anything specific you want us to know?',type:'text',placeholder:'Favorite cuts, family needs, wholesale details...'}
];

function recommend(d:Record<string,string>){
  if((d.interest||'').includes('Wholesale')||(d.familySize||'').includes('Wholesale'))return {title:'Wholesale Provisioning Account',detail:'Best for restaurants, churches, lodges, caterers, food trucks, and events.',budget:'Custom account pricing'};
  if((d.proteins||'').includes('Surf'))return {title:'Surf & Turf Club',detail:'Premium beef paired with seafood selections for elevated dinners and special occasions.',budget:d.budget||'$500-$750'};
  if((d.interest||'').includes('Steak')||(d.proteins||'').includes('Mostly Beef'))return {title:'Steak Lovers Club',detail:'Ribeye, filet, New York strip, sirloin, and premium steakhouse-style cuts.',budget:d.budget||'$300-$500'};
  if((d.familySize||'').includes('5')||(d.familySize||'').includes('7'))return {title:'Family Freezer Box',detail:'A practical freezer restock with beef, chicken, pork, and flexible portions.',budget:d.budget||'$500-$750'};
  return {title:'Custom Freezer Restock',detail:'A personalized mix based on your household size, protein preference, and budget.',budget:d.budget||'$300-$500'};
}

function routePlan(address=''){
  const zip=(address.match(/\d{5}/)?.[0]||'').trim();
  const map:Record<string,any>={
    '95628':{route:'Fair Oaks / Carmichael Route',day:'Tuesday',window:'3-7 PM',status:'Delivery available',capacity:12,reserved:7,slotsRemaining:5,fill:58,badge:'5 route spots open'},
    '95608':{route:'Fair Oaks / Carmichael Route',day:'Tuesday',window:'3-7 PM',status:'Delivery available',capacity:12,reserved:7,slotsRemaining:5,fill:58,badge:'5 route spots open'},
    '95661':{route:'Roseville Route',day:'Wednesday',window:'2-6 PM',status:'Confirmed route',capacity:12,reserved:9,slotsRemaining:3,fill:75,badge:'Confirmed route'},
    '95678':{route:'Roseville Route',day:'Wednesday',window:'2-6 PM',status:'Confirmed route',capacity:12,reserved:9,slotsRemaining:3,fill:75,badge:'Confirmed route'},
    '95765':{route:'Rocklin / Lincoln Route',day:'Thursday',window:'2-6 PM',status:'Almost full',capacity:12,reserved:10,slotsRemaining:2,fill:83,badge:'2 route spots open'},
    '95677':{route:'Rocklin / Lincoln Route',day:'Thursday',window:'2-6 PM',status:'Almost full',capacity:12,reserved:10,slotsRemaining:2,fill:83,badge:'2 route spots open'},
    '95648':{route:'Rocklin / Lincoln Route',day:'Thursday',window:'2-6 PM',status:'Almost full',capacity:12,reserved:10,slotsRemaining:2,fill:83,badge:'2 route spots open'},
    '95630':{route:'Folsom / Orangevale Route',day:'Friday',window:'2-6 PM',status:'Building route',capacity:12,reserved:5,slotsRemaining:7,fill:42,badge:'Building route'},
    '95662':{route:'Folsom / Orangevale Route',day:'Friday',window:'2-6 PM',status:'Building route',capacity:12,reserved:5,slotsRemaining:7,fill:42,badge:'Building route'}
  };
  const found=map[zip];
  if(found)return {...found,restock:'Fresh stock planned Monday and Thursday',confirm:'Text confirmation should go out one day before delivery'};
  return {route:'Expansion / Waitlist Route',day:'Next available grouped route',window:'To be confirmed',status:'Join waitlist',capacity:12,reserved:0,slotsRemaining:12,fill:0,badge:'Waitlist',restock:'Scheduled after enough nearby leads are grouped',confirm:'Text confirmation should go out after route is approved'};
}

function cleanZip(value=''){return (value.match(/\d{5}/)?.[0]||'').trim();}
function promoExpiresAt(){return new Date(Date.now()+PROMO_HOURS*60*60*1000).toISOString();}
function compactSavedLead(saved:Record<string,string>){const keep=['address','zip','familySize','interest','proteins','budget','message'];return keep.reduce((next,key)=>saved[key]?{...next,[key]:saved[key]}:next,{} as Record<string,string>);}

export default function LeadCapture(){
  const [open,setOpen]=useState(false);const [light,setLight]=useState(false);const [step,setStep]=useState(0);const [value,setValue]=useState('');const [data,setData]=useState<Record<string,string>>({});const [sent,setSent]=useState(false);const [sending,setSending]=useState(false);const [rec,setRec]=useState<any>(null);const [route,setRoute]=useState<any>(null);const [error,setError]=useState('');const [hasSavedLead,setHasSavedLead]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>{if(window.matchMedia('(min-width: 900px)').matches)setOpen(true)},1800);return()=>clearTimeout(t)},[]);
  useEffect(()=>{document.body.classList.toggle('light-mode',light)},[light]);
  useEffect(()=>{
    const latest=localStorage.getItem(LATEST_LEAD_KEY);
    if(latest){setHasSavedLead(true);try{const saved=JSON.parse(latest);const savedData=compactSavedLead(saved);if(savedData.address){setData(current=>Object.keys(current).length?current:savedData);setRoute(routePlan(savedData.address));setRec(recommend(savedData));setStep(current=>current===0?Math.min(steps.length-1,2):current)}}catch(e){}}
    function useKnownZip(zip:string){const clean=cleanZip(zip);if(!clean)return;setData(current=>current.address?current:{...current,address:clean,zip:clean});setRoute(routePlan(clean));setStep(current=>current===0?1:current)}
    useKnownZip(localStorage.getItem(ZIP_STORAGE_KEY)||'');
    const onZip=(event:Event)=>useKnownZip((event as CustomEvent<{zip:string}>).detail?.zip||'');
    window.addEventListener('ccp:delivery-zip',onZip);return()=>window.removeEventListener('ccp:delivery-zip',onZip);
  },[]);
  async function finish(updated:Record<string,string>){
    const r=recommend(updated);const rp=routePlan(updated.address);setRec(r);setRoute(rp);setSending(true);setError('');
    const lead={...updated,zip:cleanZip(updated.address),recommendation:r.title,estimatedBudget:r.budget,route:rp.route,deliveryDay:rp.day,deliveryWindow:rp.window,routeStatus:rp.status,routeBadge:rp.badge,routeFill:rp.fill,routeCapacity:rp.capacity,routeReserved:rp.reserved,routeSlotsRemaining:rp.slotsRemaining,restockPlan:rp.restock,reminderPlan:rp.confirm,smsReady:!!updated.phone,promoCode:'CHEESECAKE-48',couponOffer:'Free cheesecake with qualifying first freezer-box order within 48 hours of route check, while supplies last.',couponDeadlineHours:PROMO_HOURS,promoExpiresAt:promoExpiresAt(),giveawayAvailable:true,purchaseRequiredForGiveaway:false,purchaseImprovesGiveawayOdds:false,createdAt:new Date().toISOString()};
    localStorage.setItem(LATEST_LEAD_KEY,JSON.stringify(lead));setHasSavedLead(true);
    try{const response=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(lead)});if(!response.ok)throw new Error('Lead API failed');setSent(true)}catch(e){setError('We saved this on your device, but the lead did not reach the server. Please try again or use the contact page.')}finally{setSending(false)}
  }
  function next(v=value){const current=steps[step];const normalized=current.key==='address'?cleanZip(v)||v:v;const updated={...data,[current.key]:normalized};if(current.key==='address'&&cleanZip(normalized)){updated.zip=cleanZip(normalized);localStorage.setItem(ZIP_STORAGE_KEY,updated.zip);window.dispatchEvent(new CustomEvent('ccp:delivery-zip',{detail:{zip:updated.zip}}))}setData(updated);setValue('');if(current.key==='familySize')setRec(recommend(updated));if(current.key==='address')setRoute(routePlan(normalized));if(step<steps.length-1){setStep(step+1);return}finish(updated)}
  const current=steps[step];
  const aiContext={role:'customer',lead:data,recommendation:rec,route,promo:{code:'CHEESECAKE-48',deadlineHours:PROMO_HOURS},giveaway:{entryPath:'/giveaway',purchaseRequired:false,purchaseImprovesOdds:false},permissions:{customer:['box guidance','delivery route estimate','promo clarity','giveaway rules','wholesale inquiry']}};
  return <>
    <style>{`@media(max-width:760px){.lead-tab{left:auto!important;right:14px!important;bottom:14px!important;width:auto!important;min-width:142px!important;padding:13px 18px!important;border-radius:999px!important}.lead-modal{padding-bottom:20px!important}}`}</style>
    <button className="theme-toggle" onClick={()=>setLight(!light)}>{light?'Luxury Dark':'Clean Light'}</button>
    <button className="lead-tab" onClick={()=>setOpen(true)}>{hasSavedLead&&!sent?'Continue My Box':'Build My Box'}</button>
    {open&&<div className="lead-overlay" role="dialog" aria-modal="true"><div className="lead-modal chat-modal">
      <button className="lead-close" onClick={()=>setOpen(false)} aria-label="Close concierge">x</button>
      <p className="eyebrow">Route Concierge</p><h2>Check your route and build your box.</h2>
      <div className="chat-window">
        <div className="chat-bubble bot">{sent?'Your freezer-box request was received. We will use your route and box details for follow-up.':sending?'Sending your freezer-box request...':hasSavedLead?'Welcome back. Your saved box details are ready to continue.':current.bot}</div>
        {Object.entries(data).map(([k,v])=><div className="chat-bubble user" key={k}>{k==='address'?`Delivery ZIP: ${v}`:v}</div>)}
        {rec&&<div className="recommend-card"><p className="eyebrow">Recommended Plan</p><h3>{rec.title}</h3><p>{rec.detail}</p><strong>{rec.budget}</strong></div>}
        {route&&<div className="recommend-card"><p className="eyebrow">Delivery Estimate</p><h3>{route.status}</h3><p>{route.route}</p><strong>{route.day} - {route.window}</strong><div className="mini-meter"><span>{route.badge}</span><i><b style={{width:`${route.fill}%`}}/></i><span>{route.reserved}/{route.capacity} grouped</span></div><p>{route.restock}</p><p>{route.confirm}</p><p>Cheesecake thank-you gift: qualifying first freezer-box orders reserved within 48 hours may receive a free cheesecake while supplies last.</p><p><a href="/giveaway">Free giveaway entry</a> is separate. No purchase necessary.</p></div>}
        {(route||rec||hasSavedLead)&&!sent&&<LocalAIConcierge role="customer" context={aiContext}/>}
        {sent&&<div className="recommend-card"><p className="eyebrow">Confirmation</p><h3>Next step saved.</h3><p>Review the confirmation page for what happens after your route and freezer-box request.</p><div className="actions"><a href="/thank-you">View Confirmation</a><a href="/giveaway">Enter Giveaway Free</a></div></div>}
        {error&&<div className="recommend-card error-card"><h3>Submission issue</h3><p>{error}</p></div>}
      </div>
      {!sent&&<div className="chat-input">{current.type==='select'?<div className="choice-grid">{current.options?.map(o=><button key={o} onClick={()=>next(o)} disabled={sending}>{o}</button>)}</div>:<><input value={value} onChange={e=>setValue(e.target.value)} type={current.type} placeholder={current.placeholder} onKeyDown={e=>{if(e.key==='Enter'&&value.trim())next()}} disabled={sending}/><button onClick={()=>value.trim()&&next()} disabled={sending}>{sending?'Sending':'Send'}</button></>}</div>}
    </div></div>}
    <style>{`.mini-meter{display:grid;gap:6px;margin:10px 0}.mini-meter span{font-weight:900;color:#f8e7b0}.mini-meter i{display:block;height:8px;border-radius:999px;background:#050403;border:1px solid #b8892d66;overflow:hidden}.mini-meter b{display:block;height:100%;max-width:100%;background:linear-gradient(90deg,#facc15,#ef4444)}`}</style>
  </>
}
