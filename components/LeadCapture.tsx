'use client';
import {useEffect,useState} from 'react';

const steps=[
  {key:'interest',bot:"Hi, I'm the Capital City Provisions concierge. What brings you here today?",type:'select',options:['Family Freezer Box','Steak Lovers Club','Surf & Turf Club','Wholesale Account','Custom Freezer Restock']},
  {key:'familySize',bot:'How many people are you feeding?',type:'select',options:['1-2 people','3-4 people','5-6 people','7+ people','Wholesale / Event']},
  {key:'proteins',bot:'Which proteins do you want most?',type:'select',options:['Mostly Beef','Beef + Chicken','Surf & Turf','Mixed Family Pack','Pork + Ribs','Custom Mix']},
  {key:'budget',bot:'What monthly freezer budget feels comfortable?',type:'select',options:['$200-$300','$300-$500','$500-$750','$750-$1,000','$1,000+']},
  {key:'name',bot:'Perfect. What name should we put on the early access list?',type:'text',placeholder:'Full name'},
  {key:'email',bot:'What email should we send launch details to?',type:'email',placeholder:'Email address'},
  {key:'phone',bot:'What phone number can we use for delivery follow-up?',type:'tel',placeholder:'Phone number'},
  {key:'address',bot:'What delivery ZIP code or address should we check?',type:'text',placeholder:'ZIP code or delivery area'},
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
  const map:Record<string,{route:string;day:string;window:string}>={
    '95628':{route:'Fair Oaks / Carmichael Route',day:'Tuesday',window:'3-7 PM'},
    '95608':{route:'Fair Oaks / Carmichael Route',day:'Tuesday',window:'3-7 PM'},
    '95661':{route:'Roseville Route',day:'Wednesday',window:'2-6 PM'},
    '95678':{route:'Roseville Route',day:'Wednesday',window:'2-6 PM'},
    '95765':{route:'Rocklin / Lincoln Route',day:'Thursday',window:'2-6 PM'},
    '95677':{route:'Rocklin / Lincoln Route',day:'Thursday',window:'2-6 PM'},
    '95648':{route:'Rocklin / Lincoln Route',day:'Thursday',window:'2-6 PM'},
    '95630':{route:'Folsom / Orangevale Route',day:'Friday',window:'2-6 PM'},
    '95662':{route:'Folsom / Orangevale Route',day:'Friday',window:'2-6 PM'}
  };
  const found=map[zip];
  if(found)return {...found,status:'Delivery available',restock:'Fresh stock planned Monday and Thursday',confirm:'Text confirmation should go out one day before delivery'};
  return {route:'Expansion / Waitlist Route',day:'Next available grouped route',window:'To be confirmed',status:'Join waitlist',restock:'Scheduled after enough nearby leads are grouped',confirm:'Text confirmation should go out after route is approved'};
}

export default function LeadCapture(){
  const [open,setOpen]=useState(false);const [light,setLight]=useState(false);const [step,setStep]=useState(0);const [value,setValue]=useState('');const [data,setData]=useState<Record<string,string>>({});const [sent,setSent]=useState(false);const [sending,setSending]=useState(false);const [rec,setRec]=useState<any>(null);const [route,setRoute]=useState<any>(null);const [error,setError]=useState('');
  useEffect(()=>{const t=setTimeout(()=>{if(window.matchMedia('(min-width: 900px)').matches)setOpen(true)},1800);return()=>clearTimeout(t)},[]);
  useEffect(()=>{document.body.classList.toggle('light-mode',light)},[light]);
  async function finish(updated:Record<string,string>){
    const r=recommend(updated);const rp=routePlan(updated.address);setRec(r);setRoute(rp);setSending(true);setError('');
    const lead={...updated,recommendation:r.title,estimatedBudget:r.budget,route:rp.route,deliveryDay:rp.day,deliveryWindow:rp.window,routeStatus:rp.status,restockPlan:rp.restock,reminderPlan:rp.confirm,createdAt:new Date().toISOString()};
    localStorage.setItem('ccp_latest_lead',JSON.stringify(lead));
    try{
      const response=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(lead)});
      if(!response.ok)throw new Error('Lead API failed');
      setSent(true);
    }catch(e){
      setError('We saved this on your device, but the lead did not reach the server. Please try again or use the contact page.');
    }finally{setSending(false)}
  }
  function next(v=value){const current=steps[step];const updated={...data,[current.key]:v};setData(updated);setValue('');if(step===3)setRec(recommend(updated));if(current.key==='address')setRoute(routePlan(v));if(step<steps.length-1){setStep(step+1);return}finish(updated)}
  const current=steps[step];
  return <>
    <style>{`@media(max-width:760px){.landing-art{max-height:158px!important}.landing-art img{aspect-ratio:2.25/1!important;max-height:138px!important;object-position:center 36%!important}.lead-tab{left:auto!important;right:14px!important;bottom:14px!important;width:auto!important;min-width:142px!important;padding:13px 18px!important;border-radius:999px!important}.lead-modal{padding-bottom:20px!important}}`}</style>
    <button className="theme-toggle" onClick={()=>setLight(!light)}>{light?'Luxury Dark':'Clean Light'}</button>
    <button className="lead-tab" onClick={()=>setOpen(true)}>Find My Box</button>
    {open&&<div className="lead-overlay" role="dialog" aria-modal="true"><div className="lead-modal chat-modal">
      <button className="lead-close" onClick={()=>setOpen(false)} aria-label="Close concierge">x</button>
      <p className="eyebrow">Route Concierge</p><h2>Find your freezer box and delivery route.</h2>
      <div className="chat-window">
        <div className="chat-bubble bot">{sent?'Your freezer-box request was received. We will use your route and box details for follow-up.':sending?'Sending your freezer-box request...':current.bot}</div>
        {Object.entries(data).map(([k,v])=><div className="chat-bubble user" key={k}>{v}</div>)}
        {rec&&<div className="recommend-card"><p className="eyebrow">Recommended Plan</p><h3>{rec.title}</h3><p>{rec.detail}</p><strong>{rec.budget}</strong></div>}
        {route&&<div className="recommend-card"><p className="eyebrow">Delivery Estimate</p><h3>{route.status}</h3><p>{route.route}</p><strong>{route.day} - {route.window}</strong><p>{route.restock}</p><p>{route.confirm}</p></div>}
        {error&&<div className="recommend-card error-card"><h3>Submission issue</h3><p>{error}</p></div>}
      </div>
      {!sent&&<div className="chat-input">
        {current.type==='select'?<div className="choice-grid">{current.options?.map(o=><button key={o} onClick={()=>next(o)} disabled={sending}>{o}</button>)}</div>:<><input value={value} onChange={e=>setValue(e.target.value)} type={current.type} placeholder={current.placeholder} onKeyDown={e=>{if(e.key==='Enter'&&value.trim())next()}} disabled={sending}/><button onClick={()=>value.trim()&&next()} disabled={sending}>{sending?'Sending':'Send'}</button></>}
      </div>}
    </div></div>}
  </>
}
