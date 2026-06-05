'use client';
import {useEffect,useState} from 'react';

const steps=[
  {key:'interest',bot:'Hi, I’m the Capital City Provisions concierge. What can I help you with?',type:'select',options:['Family Freezer Box','Steak Lovers Club','Surf & Turf Club','Wholesale Account','Custom Freezer Restock']},
  {key:'name',bot:'Perfect. What name should we put on the early access list?',type:'text',placeholder:'Full name'},
  {key:'email',bot:'What email should we send launch details to?',type:'email',placeholder:'Email address'},
  {key:'phone',bot:'What phone number can we use for delivery or account follow-up?',type:'tel',placeholder:'Phone number'},
  {key:'address',bot:'What delivery ZIP code or address should we check?',type:'text',placeholder:'ZIP code or delivery area'},
  {key:'message',bot:'Anything specific you want us to know?',type:'text',placeholder:'Family size, preferred meats, wholesale needs...'}
];

export default function LeadCapture(){
  const [open,setOpen]=useState(false);const [light,setLight]=useState(false);const [step,setStep]=useState(0);const [value,setValue]=useState('');const [data,setData]=useState<Record<string,string>>({});const [sent,setSent]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setOpen(true),1800);return()=>clearTimeout(t)},[]);
  useEffect(()=>{document.body.classList.toggle('light-mode',light)},[light]);
  async function next(v=value){const current=steps[step];const updated={...data,[current.key]:v};setData(updated);setValue('');if(step<steps.length-1){setStep(step+1);return}await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(updated)}).catch(()=>null);setSent(true)}
  const current=steps[step];
  return <>
    <button className="theme-toggle" onClick={()=>setLight(!light)}>{light?'Luxury Dark':'Clean Light'}</button>
    <button className="lead-tab" onClick={()=>setOpen(true)}>Ask Concierge</button>
    {open&&<div className="lead-overlay" role="dialog" aria-modal="true"><div className="lead-modal chat-modal">
      <button className="lead-close" onClick={()=>setOpen(false)}>×</button>
      <p className="eyebrow">AI-style Concierge</p><h2>Reserve your first freezer box.</h2>
      <div className="chat-window">
        <div className="chat-bubble bot">{sent?'You are on the early access list. We will follow up with launch availability and next steps.':current.bot}</div>
        {Object.entries(data).map(([k,v])=><div className="chat-bubble user" key={k}>{v}</div>)}
      </div>
      {!sent&&<div className="chat-input">
        {current.type==='select'?<div className="choice-grid">{current.options?.map(o=><button key={o} onClick={()=>next(o)}>{o}</button>)}</div>:<><input value={value} onChange={e=>setValue(e.target.value)} type={current.type} placeholder={current.placeholder} onKeyDown={e=>{if(e.key==='Enter'&&value.trim())next()}}/><button onClick={()=>value.trim()&&next()}>Send</button></>}
      </div>}
    </div></div>}
  </>
}
