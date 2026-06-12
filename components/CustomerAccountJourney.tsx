'use client';

import {useState} from 'react';

type FormState={
  name:string;
  email:string;
  phone:string;
  zip:string;
  household:string;
  freezerSpace:string;
  preferredBox:string;
  proteins:string;
  value:string;
  restockInterest:boolean;
  giveawayInterest:boolean;
  notes:string;
};

function initial():FormState{
  return {
    name:'',
    email:'',
    phone:'',
    zip:'',
    household:'',
    freezerSpace:'',
    preferredBox:'Premium Freezer Box',
    proteins:'Prime beef, chicken, pork, seafood',
    value:'497',
    restockInterest:false,
    giveawayInterest:false,
    notes:'',
  };
}

export default function CustomerAccountJourney(){
  const [form,setForm]=useState<FormState>(initial());
  const [status,setStatus]=useState('Start with your ZIP, box interest, and contact info.');
  const [busy,setBusy]=useState(false);
  const [submitted,setSubmitted]=useState(false);

  function update<K extends keyof FormState>(key:K,value:FormState[K]){
    setForm(current=>({...current,[key]:value}));
  }

  async function submit(){
    setBusy(true);
    setStatus('Saving your request...');

    const account=await fetch('/api/customer-account',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(form),
    }).then(response=>response.json()).catch(()=>null);

    const intake=await fetch('/api/customer-intake',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        ...form,
        box:form.preferredBox,
        interest:form.restockInterest?'Monthly restock quote request':'Freezer box quote request',
      }),
    }).then(response=>response.json()).catch(()=>null);

    setBusy(false);

    if(account?.ok&&intake?.ok){
      setSubmitted(true);
      setStatus(`Request received. Your quote request number is ${intake.record?.id||'saved'}.`);
    }else{
      setStatus(account?.message||intake?.message||'Could not save your request yet. Please try again.');
    }
  }

  return (
    <section className="section customer-account-journey" id="customer-account-journey">
      <div>
        <p className="ccp-section-kicker">Simple Account + Quote Request</p>
        <h2>Start your freezer package request.</h2>
        <p>{status}</p>
      </div>

      <div className="account-form-grid">
        <label>Name<input value={form.name} onChange={event=>update('name',event.target.value)} placeholder="Your name"/></label>
        <label>Email<input value={form.email} onChange={event=>update('email',event.target.value)} placeholder="you@email.com"/></label>
        <label>Phone<input value={form.phone} onChange={event=>update('phone',event.target.value)} placeholder="Phone"/></label>
        <label>ZIP<input value={form.zip} onChange={event=>update('zip',event.target.value)} placeholder="Delivery ZIP"/></label>
        <label>Household<input value={form.household} onChange={event=>update('household',event.target.value)} placeholder="2 adults, 3 kids, etc."/></label>
        <label>Freezer Space<input value={form.freezerSpace} onChange={event=>update('freezerSpace',event.target.value)} placeholder="5 cu ft, 10 cu ft, upright, chest"/></label>
        <label>Preferred Box<input value={form.preferredBox} onChange={event=>update('preferredBox',event.target.value)} placeholder="Premium Freezer Box"/></label>
        <label>Protein Mix<input value={form.proteins} onChange={event=>update('proteins',event.target.value)} placeholder="Steaks, chicken, burger..."/></label>
        <label>Estimated Budget<input value={form.value} onChange={event=>update('value',event.target.value)} placeholder="497"/></label>
        <label className="checkbox-line"><input type="checkbox" checked={form.restockInterest} onChange={event=>update('restockInterest',event.target.checked)}/> Interested in monthly restocks</label>
        <label className="checkbox-line"><input type="checkbox" checked={form.giveawayInterest} onChange={event=>update('giveawayInterest',event.target.checked)}/> Interested in free giveaway entry</label>
        <label className="wide">Notes<textarea value={form.notes} onChange={event=>update('notes',event.target.value)} placeholder="Favorite cuts, delivery questions, family needs, freezer details."/></label>
      </div>

      <div className="account-actions">
        <button disabled={busy} onClick={submit}>{busy?'Saving...':'Request My Quote'}</button>
        <a href="#delivery-zone-check">Check ZIP First</a>
        <a href="/giveaway">Enter Giveaway</a>
      </div>

      {submitted&&(
        <div className="request-success-card">
          <p className="ccp-section-kicker">Next Steps</p>
          <h3>Your request is in.</h3>
          <p>The team can now review your ZIP, freezer box fit, delivery timing, and quote details before anything is final.</p>
          <div>
            <a href="/customer">View Customer Portal</a>
            <a href="/freezer-boxes">Build Another Box</a>
            <a href="/giveaway">Enter Giveaway</a>
            <a href="/reviews">Reviews</a>
          </div>
        </div>
      )}

      <style>{`
        .customer-account-journey{border:1px solid rgba(248,231,176,.22);border-radius:30px;background:radial-gradient(circle at top left,rgba(212,175,55,.14),transparent 30%),linear-gradient(135deg,#080503,#020202);padding:clamp(1.5rem,4vw,2.5rem)}
        .customer-account-journey h2{font-family:var(--ccp-display);font-size:clamp(2.5rem,6vw,5rem);line-height:.92;text-transform:uppercase;color:var(--ccp-cream);margin:.25rem 0 .8rem}
        .customer-account-journey p{color:var(--ccp-muted)}
        .account-form-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:1rem}
        .account-form-grid label{display:grid;gap:5px;color:var(--ccp-gold);font-weight:900;font-size:.84rem}
        .account-form-grid input,.account-form-grid textarea{border:1px solid rgba(248,231,176,.22);border-radius:14px;background:#0b0704;color:#fff7ed;padding:10px;font:inherit}
        .account-form-grid textarea{min-height:90px}
        .account-form-grid .wide{grid-column:1/-1}
        .checkbox-line{display:flex!important;align-items:center;gap:.6rem;border:1px solid rgba(248,231,176,.14);border-radius:14px;background:#050403;padding:10px;color:var(--ccp-cream)!important}
        .checkbox-line input{width:auto}
        .account-actions{display:flex;flex-wrap:wrap;gap:.8rem;margin-top:1rem}
        .account-actions button,.account-actions a{border:1px solid rgba(248,231,176,.42);border-radius:999px;background:#0b0704;color:#fff7ed;text-decoration:none;padding:.85rem 1.15rem;font-weight:900;cursor:pointer;text-transform:uppercase}
        .account-actions button{background:linear-gradient(135deg,var(--ccp-red),var(--ccp-red-hot));color:#fff}
        .account-actions button:disabled{opacity:.6;cursor:wait}.request-success-card{border:1px solid rgba(248,231,176,.22);border-radius:22px;background:#050403;padding:14px;margin-top:14px}.request-success-card h3{color:var(--ccp-soft-gold);font-size:1.6rem;margin:.2rem 0}.request-success-card div{display:flex;flex-wrap:wrap;gap:8px}.request-success-card a{border:1px solid rgba(248,231,176,.34);border-radius:999px;background:#0b0704;color:#fff7ed;text-decoration:none;padding:.7rem .9rem;font-weight:900;text-transform:uppercase}
        @media(max-width:900px){.account-form-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:620px){.account-form-grid{grid-template-columns:1fr}.customer-account-journey{border-radius:22px;padding:1rem}}
      `}</style>
    </section>
  );
}