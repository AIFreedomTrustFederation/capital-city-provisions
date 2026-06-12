'use client';

import {useState} from 'react';

export default function CustomerServiceRating(){
  const [rating,setRating]=useState(5);
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [orderId,setOrderId]=useState('');
  const [loved,setLoved]=useState('');
  const [improve,setImprove]=useState('');
  const [reorderInterest,setReorderInterest]=useState(true);
  const [restockInterest,setRestockInterest]=useState(false);
  const [sharePermission,setSharePermission]=useState(false);
  const [status,setStatus]=useState('Rate your delivery after service is complete.');
  const [busy,setBusy]=useState(false);

  async function submit(){
    setBusy(true);
    setStatus('Saving your rating...');

    const result=await fetch('/api/customer-rating',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name,email,orderId,rating,loved,improve,reorderInterest,restockInterest,sharePermission}),
    }).then(response=>response.json()).catch(()=>null);

    setBusy(false);

    if(result?.ok){
      setStatus(rating>=4?'Thank you. We appreciate your feedback and reorder interest.':'Thank you. The team will review this and follow up if needed.');
    }else{
      setStatus(result?.message||'Could not save your rating yet.');
    }
  }

  return (
    <section className="section customer-rating" id="customer-rating">
      <p className="ccp-section-kicker">Delivery Rating</p>
      <h2>How was your service?</h2>
      <p>{status}</p>

      <div className="rating-stars">
        {[1,2,3,4,5].map(star=>(
          <button key={star} onClick={()=>setRating(star)} className={star<=rating?'active':''}>★</button>
        ))}
      </div>

      <div className="rating-form">
        <label>Name<input value={name} onChange={event=>setName(event.target.value)} placeholder="Your name"/></label>
        <label>Email<input value={email} onChange={event=>setEmail(event.target.value)} placeholder="you@email.com"/></label>
        <label>Order ID<input value={orderId} onChange={event=>setOrderId(event.target.value)} placeholder="Optional"/></label>
        <label className="wide">What did you love?<textarea value={loved} onChange={event=>setLoved(event.target.value)} placeholder="Tell us what went right."/></label>
        <label className="wide">What could improve?<textarea value={improve} onChange={event=>setImprove(event.target.value)} placeholder="Tell us what we can fix."/></label>
        <label className="check"><input type="checkbox" checked={reorderInterest} onChange={event=>setReorderInterest(event.target.checked)}/> I may want to reorder</label>
        <label className="check"><input type="checkbox" checked={restockInterest} onChange={event=>setRestockInterest(event.target.checked)}/> I want monthly restock info</label>
        <label className="check"><input type="checkbox" checked={sharePermission} onChange={event=>setSharePermission(event.target.checked)}/> You may ask me about sharing this review</label>
      </div>

      <button className="rating-submit" disabled={busy} onClick={submit}>{busy?'Saving...':'Submit Rating'}</button>

      <style>{`
        .customer-rating{border:1px solid rgba(248,231,176,.22);border-radius:28px;background:linear-gradient(135deg,#080503,#020202);padding:18px}
        .customer-rating h2{font-family:var(--ccp-display);font-size:clamp(2.4rem,6vw,4.8rem);line-height:.92;text-transform:uppercase;color:var(--ccp-cream);margin:.25rem 0}
        .customer-rating p{color:var(--ccp-muted)}
        .rating-stars{display:flex;gap:.4rem;margin:1rem 0}
        .rating-stars button{border:0;background:transparent;color:#4b3520;font-size:2.5rem;cursor:pointer}
        .rating-stars button.active{color:var(--ccp-gold)}
        .rating-form{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
        .rating-form label{display:grid;gap:5px;color:var(--ccp-gold);font-weight:900;font-size:.84rem}
        .rating-form input,.rating-form textarea{border:1px solid rgba(248,231,176,.22);border-radius:14px;background:#0b0704;color:#fff7ed;padding:10px;font:inherit}
        .rating-form textarea{min-height:85px}
        .rating-form .wide{grid-column:1/-1}
        .rating-form .check{display:flex;align-items:center;gap:.55rem;border:1px solid rgba(248,231,176,.14);border-radius:14px;background:#050403;padding:10px;color:var(--ccp-cream)}
        .rating-submit{border:1px solid rgba(255,255,255,.18);border-radius:999px;background:linear-gradient(135deg,var(--ccp-red),var(--ccp-red-hot));color:#fff;font-weight:900;margin-top:1rem;padding:.85rem 1.25rem;text-transform:uppercase;cursor:pointer}
        .rating-submit:disabled{opacity:.6;cursor:wait}
        @media(max-width:800px){.rating-form{grid-template-columns:1fr}}
      `}</style>
    </section>
  );
}
