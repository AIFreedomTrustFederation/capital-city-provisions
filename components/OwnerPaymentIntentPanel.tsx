'use client';

import {useEffect,useMemo,useState} from 'react';

type PaymentIntentRecord={
  id:string;
  customerName:string;
  email:string;
  phone:string;
  zip:string;
  quoteId:string;
  orderId:string;
  box:string;
  amount:number;
  provider:string;
  status:string;
  note:string;
  ownerAction:string;
  createdAt:string;
  updatedAt:string;
};

function money(value:number){
  return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value||0);
}

export default function OwnerPaymentIntentPanel(){
  const [records,setRecords]=useState<PaymentIntentRecord[]>([]);
  const [status,setStatus]=useState('Loading payment intents...');

  async function load(){
    const result=await fetch('/api/payment-intent',{credentials:'same-origin'})
      .then(response=>response.json())
      .catch(()=>null);
    if(result?.ok){
      setRecords(result.records||[]);
      setStatus('Payment intents loaded.');
    }else{
      setStatus(result?.message||'Payment intents unavailable.');
    }
  }

  useEffect(()=>{load()},[]);

  async function update(id:string,nextStatus:string){
    const result=await fetch('/api/payment-intent',{
      method:'PATCH',
      headers:{'Content-Type':'application/json'},
      credentials:'same-origin',
      body:JSON.stringify({id,status:nextStatus}),
    }).then(response=>response.json()).catch(()=>null);
    if(result?.ok)load();
  }

  const summary=useMemo(()=>({
    pending:records.filter(record=>['pending','invoice-requested','deposit-requested'].includes(record.status)).length,
    paid:records.filter(record=>record.status==='paid').length,
    manual:records.filter(record=>record.provider==='manual').length,
    total:records.reduce((sum,record)=>sum+Number(record.amount||0),0),
  }),[records]);

  return (
    <section className="section mvp-panel owner-payment-panel" id="owner-payments">
      <p className="mvp-eyebrow">Payment Intent Control</p>
      <h2 className="mvp-title">Deposits and invoices.</h2>
      <p className="mvp-subtitle">{status}</p>

      <div className="mvp-status-strip">
        <article><small>Pending</small><b>{summary.pending}</b></article>
        <article><small>Paid</small><b>{summary.paid}</b></article>
        <article><small>Manual Invoice</small><b>{summary.manual}</b></article>
        <article><small>Total Intent</small><b>{money(summary.total)}</b></article>
      </div>

      <div className="payment-provider-status">
        <article><span>Manual Invoice</span><b>Active</b></article>
        <article><span>Stripe</span><b>Connect Later</b></article>
        <article><span>Square</span><b>Connect Later</b></article>
        <article><span>BTCPay</span><b>Connect Later</b></article>
      </div>

      <div className="payment-intent-list">
        {records.map(record=>(
          <article key={record.id}>
            <div>
              <span>{record.status}</span>
              <h3>{record.customerName} — {money(record.amount)}</h3>
              <p>{record.box} · ZIP {record.zip||'needs ZIP'} · {record.provider}</p>
              <small>{record.ownerAction}</small>
              {record.note&&<p>{record.note}</p>}
            </div>
            <div className="payment-actions">
              <button onClick={()=>update(record.id,'invoice-requested')}>Invoice Sent</button>
              <button onClick={()=>update(record.id,'paid')}>Mark Paid</button>
              <button onClick={()=>update(record.id,'cancelled')}>Cancel</button>
            </div>
          </article>
        ))}
        {!records.length&&<p>No payment intents yet. Customer deposit requests will appear here.</p>}
      </div>

      <style>{`
        .payment-provider-status{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:14px 0}
        .payment-provider-status article{border:1px solid rgba(248,231,176,.15);border-radius:16px;background:#050403;padding:10px}
        .payment-provider-status span{display:block;color:#d4af37;font-weight:900;text-transform:uppercase;font-size:.74rem}
        .payment-provider-status b{color:#f8e7b0}
        .payment-intent-list{display:grid;gap:10px;margin-top:12px}
        .payment-intent-list article{display:grid;grid-template-columns:1fr auto;gap:12px;border:1px solid rgba(248,231,176,.14);border-radius:18px;background:#050403;padding:12px}
        .payment-intent-list article span{display:inline-flex;border-radius:999px;background:#713f12;color:#fef3c7;padding:3px 9px;font-weight:900;text-transform:uppercase;font-size:.7rem}
        .payment-intent-list h3{color:#f8e7b0;margin:.45rem 0}
        .payment-intent-list p,.payment-intent-list small{color:#ded2bd}
        .payment-actions{display:flex;flex-wrap:wrap;gap:6px;align-content:start;justify-content:flex-end}
        .payment-actions button{border:1px solid rgba(248,231,176,.24);border-radius:999px;background:#0b0704;color:#fff7ed;padding:.55rem .75rem;font-weight:900;cursor:pointer}
        .payment-actions button:nth-child(2){background:linear-gradient(135deg,#14532d,#16a34a)}
        @media(max-width:980px){.payment-provider-status,.payment-intent-list article{grid-template-columns:1fr}.payment-actions{justify-content:flex-start}}
      `}</style>
    </section>
  );
}
