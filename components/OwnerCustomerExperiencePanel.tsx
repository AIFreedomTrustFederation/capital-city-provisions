'use client';

import {useEffect,useMemo,useState} from 'react';

type AccountRecord={
  id:string;
  name:string;
  email:string;
  phone:string;
  zip:string;
  preferredBox:string;
  restockInterest:boolean;
  giveawayInterest:boolean;
  createdAt:string;
};

type RatingRecord={
  id:string;
  name:string;
  email:string;
  orderId:string;
  rating:number;
  loved:string;
  improve:string;
  reorderInterest:boolean;
  restockInterest:boolean;
  sharePermission:boolean;
  status:string;
  createdAt:string;
};

export default function OwnerCustomerExperiencePanel(){
  const [accounts,setAccounts]=useState<AccountRecord[]>([]);
  const [ratings,setRatings]=useState<RatingRecord[]>([]);
  const [status,setStatus]=useState('Loading customer experience records...');

  useEffect(()=>{
    let active=true;

    Promise.all([
      fetch('/api/customer-account').then(response=>response.json()).catch(()=>null),
      fetch('/api/customer-rating').then(response=>response.json()).catch(()=>null),
      fetch('/api/customer-operations').then(response=>response.json()).catch(()=>null),
    ]).then(([accountResult,ratingResult,opsResult])=>{
      if(!active)return;
      setAccounts(accountResult?.records||[]);
      setRatings(ratingResult?.records||[]);
      setStatus(opsResult?.ok?'Customer account, rating, and operations records loaded.':'Customer account and rating records loaded.');
    }).catch(()=>{
      if(active)setStatus('Customer experience records unavailable.');
    });

    return()=>{active=false};
  },[]);

  const model=useMemo(()=>{
    const excellent=ratings.filter(record=>record.rating>=5);
    const recovery=ratings.filter(record=>record.rating<=3);
    const restock=accounts.filter(record=>record.restockInterest).length+ratings.filter(record=>record.restockInterest).length;
    const giveaway=accounts.filter(record=>record.giveawayInterest).length;
    const reorder=ratings.filter(record=>record.reorderInterest).length;
    return {excellent,recovery,restock,giveaway,reorder};
  },[accounts,ratings]);

  const cards=[
    {label:'Customer Accounts',value:accounts.length,action:'People who started a quote or account request.'},
    {label:'Excellent Ratings',value:model.excellent.length,action:'Possible testimonial and referral opportunities.'},
    {label:'Needs Recovery',value:model.recovery.length,action:'Low ratings that need owner follow-up.'},
    {label:'Restock Interest',value:model.restock,action:'Monthly restock candidates.'},
    {label:'Giveaway Interest',value:model.giveaway,action:'Free-entry and promotional leads.'},
    {label:'Reorder Interest',value:model.reorder,action:'Customers likely to buy again.'},
  ];

  return (
    <section className="section owner-customer-experience" id="owner-customer-experience">
      <p className="eyebrow">Customer Experience Control</p>
      <h2>Accounts, ratings, recovery, restock, and reorder opportunities.</h2>
      <p>{status}</p>

      <div className="experience-card-grid">
        {cards.map(card=>(
          <article key={card.label}>
            <small>{card.label}</small>
            <strong>{card.value}</strong>
            <p>{card.action}</p>
          </article>
        ))}
      </div>

      <div className="experience-lists">
        <article>
          <h3>Latest Accounts</h3>
          {accounts.slice(0,5).map(account=>(
            <p key={account.id}><b>{account.name}</b> — {account.zip||'No ZIP'} — {account.preferredBox}</p>
          ))}
          {!accounts.length&&<p>No account requests yet.</p>}
        </article>

        <article>
          <h3>Latest Ratings</h3>
          {ratings.slice(0,5).map(record=>(
            <p key={record.id}><b>{record.rating}★</b> — {record.name} — {record.status}</p>
          ))}
          {!ratings.length&&<p>No service ratings yet.</p>}
        </article>
      </div>

      <style>{`
        .owner-customer-experience{border:1px solid rgba(248,231,176,.22);border-radius:28px;background:linear-gradient(135deg,#080503,#020202);padding:18px}
        .owner-customer-experience h2{color:#f8e7b0;margin:.25rem 0}
        .owner-customer-experience p{color:#ded2bd}
        .experience-card-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:14px}
        .experience-card-grid article,.experience-lists article{border:1px solid rgba(248,231,176,.16);border-radius:20px;background:#050403;padding:14px}
        .experience-card-grid small{color:#d4af37;font-weight:900}
        .experience-card-grid strong{font-size:2rem;color:#f8e7b0}
        .experience-lists{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}
        .experience-lists h3{color:#fff7ed}
        .experience-lists b{color:#f8e7b0}
        @media(max-width:900px){.experience-card-grid,.experience-lists{grid-template-columns:1fr}}
      `}</style>
    </section>
  );
}
