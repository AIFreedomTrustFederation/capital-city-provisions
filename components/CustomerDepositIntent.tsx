'use client';

import {useState} from 'react';

const amounts=[25,50,100,250];

type FormState={
  customerName:string;
  email:string;
  phone:string;
  zip:string;
  quoteId:string;
  orderId:string;
  box:string;
  amount:string;
  provider:string;
  note:string;
};

function initial():FormState{
  return {
    customerName:'',
    email:'',
    phone:'',
    zip:'',
    quoteId:'',
    orderId:'',
    box:'Premium Freezer Box',
    amount:'50',
    provider:'manual',
    note:'',
  };
}

export default function CustomerDepositIntent(){
  const [form,setForm]=useState<FormState>(initial());
  const [busy,setBusy]=useState(false);
  const [status,setStatus]=useState('Choose a deposit amount or request an invoice after your quote is reviewed.');
  const [savedId,setSavedId]=useState('');

  function update<K extends keyof FormState>(key:K,value:FormState[K]){
    setForm(current=>({...current,[key]:value}));
  }

  async function submit(providerOverride?:string,amountOverride?:number){
    setBusy(true);
    setStatus('Saving deposit request...');
    const payload={
      ...form,
      provider:providerOverride||form.provider,
      amount:amountOverride||Number(form.amount||50),
      status:providerOverride==='manual'?'invoice-requested':'pending',
    };

    const result=await fetch('/api/payment-intent',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload),
    }).then(response=>response.json()).catch(()=>null);

    setBusy(false);
    if(result?.ok){
      setSavedId(result.record?.id||'');
      setStatus(result.message||'Deposit request saved.');
    }else{
      setStatus(result?.message||'Could not save deposit request yet. Please try again.');
    }
  }

  return (
    <section className="section mvp-panel customer-deposit-intent mvp-anchor-section" id="pay-deposit">
      <p className="mvp-eyebrow">Deposit / Invoice Request</p>
      <h2 className="mvp-title">Secure the next step.</h2>
      <p className="mvp-subtitle">A deposit request helps the team confirm your quote, delivery timing, and inventory before fulfillment. Final total is confirmed before the order is packed.</p>

      <div className="deposit-alert">
        <strong>Good to know:</strong> Giveaway entry stays free. A purchase or deposit does not improve giveaway odds.
      </div>

      <div className="deposit-amounts">
        {amounts.map(amount=>(
          <button key={amount} type="button" className={form.amount===String(amount)?'active':''} onClick={()=>update('amount',String(amount))}>
            ${amount}
            <small>{amount===25?'Quote hold':amount===50?'Follow-up':amount===100?'Box deposit':'Large order'}</small>
          </button>
        ))}
      </div>

      <div className="deposit-form-grid">
        <label>Name<input value={form.customerName} onChange={event=>update('customerName',event.target.value)} placeholder="Your name"/></label>
        <label>Email<input value={form.email} onChange={event=>update('email',event.target.value)} placeholder="you@email.com"/></label>
        <label>Phone<input value={form.phone} onChange={event=>update('phone',event.target.value)} placeholder="Phone"/></label>
        <label>ZIP<input value={form.zip} onChange={event=>update('zip',event.target.value)} placeholder="Delivery ZIP"/></label>
        <label>Quote ID<input value={form.quoteId} onChange={event=>update('quoteId',event.target.value)} placeholder="Optional quote number"/></label>
        <label>Order ID<input value={form.orderId} onChange={event=>update('orderId',event.target.value)} placeholder="Optional order number"/></label>
        <label>Box<input value={form.box} onChange={event=>update('box',event.target.value)} placeholder="Freezer box"/></label>
        <label>Custom Amount<input value={form.amount} onChange={event=>update('amount',event.target.value)} placeholder="50"/></label>
        <label>Preferred Method
          <select value={form.provider} onChange={event=>update('provider',event.target.value)}>
            <option value="manual">Manual invoice / payment link</option>
            <option value="stripe">Stripe later</option>
            <option value="square">Square later</option>
            <option value="btcpay">BTCPay later</option>
            <option value="cash">Cash discussion</option>
          </select>
        </label>
        <label className="wide">Notes<textarea value={form.note} onChange={event=>update('note',event.target.value)} placeholder="Anything the team should know before confirming payment?"/></label>
      </div>

      <div className="mvp-actions">
        <button className="mvp-button" disabled={busy} onClick={()=>submit()}>{busy?'Saving...':'Save Deposit Request'}</button>
        <button className="mvp-button-gold" disabled={busy} onClick={()=>submit('manual')}>Request Manual Invoice</button>
        <a className="mvp-button-secondary" href="/customer#customer-account-journey">Start Quote First</a>
      </div>

      <p className="deposit-status">{status}</p>
      {savedId&&<p className="deposit-saved">Saved payment request: <strong>{savedId}</strong></p>}

      <style>{`
        .deposit-alert{border:1px solid rgba(248,231,176,.2);border-radius:18px;background:#050403;color:#ded2bd;padding:12px;margin:14px 0}
        .deposit-alert strong{color:#f8e7b0}
        .deposit-amounts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:14px 0}
        .deposit-amounts button{border:1px solid rgba(248,231,176,.22);border-radius:20px;background:#050403;color:#fff7ed;padding:14px;font-weight:1000;cursor:pointer;font-size:1.2rem}
        .deposit-amounts button small{display:block;color:#d4af37;font-size:.72rem;text-transform:uppercase;margin-top:5px}
        .deposit-amounts button.active{background:linear-gradient(135deg,#b40d0d,#df1717);border-color:rgba(255,255,255,.35)}
        .deposit-form-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
        .deposit-form-grid label{display:grid;gap:5px;color:#d4af37;font-weight:900;font-size:.84rem}
        .deposit-form-grid input,.deposit-form-grid textarea,.deposit-form-grid select{border:1px solid rgba(248,231,176,.22);border-radius:14px;background:#0b0704;color:#fff7ed;padding:10px;font:inherit}
        .deposit-form-grid textarea{min-height:92px}
        .deposit-form-grid .wide{grid-column:1/-1}
        .deposit-status,.deposit-saved{margin-top:12px!important;color:#ded2bd}
        .deposit-saved strong{color:#f8e7b0}
        .customer-deposit-intent button:disabled{opacity:.62;cursor:wait}
        @media(max-width:900px){.deposit-form-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.deposit-amounts{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:620px){.deposit-form-grid,.deposit-amounts{grid-template-columns:1fr}}
      `}</style>
    </section>
  );
}
