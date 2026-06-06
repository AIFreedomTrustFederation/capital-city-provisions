'use client';
import {useState} from 'react';

const ZIP_KEY='ccp_delivery_zip';
const ENTRY_KEY='ccp_freezer_giveaway_entry';

type FormState={name:string;email:string;phone:string;zip:string;ageConfirm:boolean;rulesConfirm:boolean};

export default function GiveawayEntry(){
  const [form,setForm]=useState<FormState>({name:'',email:'',phone:'',zip:'',ageConfirm:false,rulesConfirm:false});
  const [sent,setSent]=useState(false);
  const [sending,setSending]=useState(false);
  const [error,setError]=useState('');

  function update(next:Partial<FormState>){setForm(current=>({...current,...next}))}

  async function submit(e:React.FormEvent){
    e.preventDefault();
    if(!form.ageConfirm||!form.rulesConfirm){setError('Please confirm eligibility and rules before entering.');return}
    setSending(true);setError('');
    const zip=(form.zip.match(/\d{5}/)?.[0]||form.zip).trim();
    const entry={
      name:form.name.trim(),
      email:form.email.trim(),
      phone:form.phone.trim(),
      address:zip,
      zip,
      interest:'Freezer giveaway no-purchase entry',
      source:'freezer-giveaway-no-purchase-entry',
      message:'No-purchase sweepstakes entry. Purchase not required and does not improve odds.',
      noPurchaseEntry:true,
      sweepstakesEntry:true,
      purchaseRequired:false,
      purchaseImprovesOdds:false,
      promoCode:'FREEZER-FULL-2026',
      giveawayPrize:'Freezer full of premium meat',
      officialRulesVersion:'2026-06-06',
      entrantConfirmedAge:form.ageConfirm,
      entrantAcceptedRules:form.rulesConfirm,
      createdAt:new Date().toISOString()
    };
    localStorage.setItem(ENTRY_KEY,JSON.stringify(entry));
    if(zip)localStorage.setItem(ZIP_KEY,zip);
    try{
      const response=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(entry)});
      if(!response.ok)throw new Error('Entry API failed');
      setSent(true);
    }catch(e){
      setError('Your entry was saved on this device, but it did not reach the server. Please try again or contact support.');
    }finally{setSending(false)}
  }

  if(sent)return <article className="marble"><p className="eyebrow">Entry Received</p><h3>You are entered.</h3><p>No purchase was required. Buying does not improve your odds. Watch your email for winner notification and route updates.</p><a href="/family-freezer-boxes">Continue Freezer Planning</a></article>;

  return <form onSubmit={submit} className="giveaway-form marble">
    <p className="eyebrow">Free Entry</p><h3>Enter the freezer giveaway.</h3>
    <p>No purchase necessary. A purchase will not increase your chances of winning.</p>
    <input value={form.name} onChange={e=>update({name:e.target.value})} placeholder="Full name" aria-label="Full name" required/>
    <input value={form.email} onChange={e=>update({email:e.target.value})} placeholder="Email address" type="email" aria-label="Email address" required/>
    <input value={form.phone} onChange={e=>update({phone:e.target.value})} placeholder="Phone number for winner notification" type="tel" aria-label="Phone number"/>
    <input value={form.zip} onChange={e=>update({zip:e.target.value})} placeholder="Delivery ZIP" inputMode="numeric" aria-label="Delivery ZIP" required/>
    <label><input type="checkbox" checked={form.ageConfirm} onChange={e=>update({ageConfirm:e.target.checked})}/> I confirm I am eligible to enter under the official rules.</label>
    <label><input type="checkbox" checked={form.rulesConfirm} onChange={e=>update({rulesConfirm:e.target.checked})}/> I understand no purchase is required and buying does not improve odds.</label>
    {error&&<p className="form-error">{error}</p>}
    <button type="submit" disabled={sending}>{sending?'Submitting...':'Enter Giveaway'}</button>
    <a href="/official-rules">Read Official Rules</a>
    <style>{`.giveaway-form{display:grid;gap:12px}.giveaway-form input[type=text],.giveaway-form input[type=email],.giveaway-form input[type=tel],.giveaway-form input:not([type]){width:100%;border:1px solid #b8892d;background:#050403;color:#fff7ed;border-radius:999px;padding:13px 15px;font:inherit}.giveaway-form label{display:flex;gap:10px;align-items:flex-start;color:#ded2bd;line-height:1.45}.giveaway-form button{border:1px solid #f8e7b0;background:linear-gradient(135deg,#facc15,#a16207);color:#160b04;border-radius:999px;padding:13px 16px;font-weight:900}.form-error{color:#fecaca!important}`}</style>
  </form>
}
