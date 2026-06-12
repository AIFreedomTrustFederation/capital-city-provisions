'use client';

import {useEffect,useMemo,useState} from 'react';

type OpsItem={
  id:string;
  kind:string;
  subject:string;
  body:string;
  customerName:string;
  customerEmail:string;
  phone:string;
  zip:string;
  status:string;
  priority:string;
  ownerAction:string;
  createdAt:string;
};

type Summary={
  customers:number;
  quotes:number;
  ratings:number;
  openOps:number;
  quoteRequests:number;
  recoveryCases:number;
  testimonialCandidates:number;
  restockInterest:number;
  reorderOpportunities:number;
  giveawayInterest:number;
};

const emptySummary:Summary={
  customers:0,
  quotes:0,
  ratings:0,
  openOps:0,
  quoteRequests:0,
  recoveryCases:0,
  testimonialCandidates:0,
  restockInterest:0,
  reorderOpportunities:0,
  giveawayInterest:0,
};

export default function OwnerCustomerOperationsPanel(){
  const [summary,setSummary]=useState<Summary>(emptySummary);
  const [ops,setOps]=useState<OpsItem[]>([]);
  const [status,setStatus]=useState('Loading persistent customer operations...');

  async function load(){
    const result=await fetch('/api/customer-operations',{credentials:'same-origin'})
      .then(response=>response.json())
      .catch(()=>null);

    if(result?.ok){
      setSummary(result.summary||emptySummary);
      setOps(result.ops||[]);
      setStatus('Customer operations loaded.');
    }else{
      setStatus('Customer operations unavailable.');
    }
  }

  useEffect(()=>{load()},[]);

  const buckets=useMemo(()=>[
    {label:'Customers',value:summary.customers,copy:'Profiles created from customer quote/account activity.'},
    {label:'Quote Requests',value:summary.quoteRequests,copy:'Ready for owner quote building.'},
    {label:'Recovery Cases',value:summary.recoveryCases,copy:'Low ratings or service problems needing follow-up.'},
    {label:'Testimonials',value:summary.testimonialCandidates,copy:'Excellent ratings that may become social proof.'},
    {label:'Restock Interest',value:summary.restockInterest,copy:'Monthly restock opportunities.'},
    {label:'Reorder Opportunities',value:summary.reorderOpportunities,copy:'Customers who may buy again.'},
    {label:'Giveaway Interest',value:summary.giveawayInterest,copy:'Free entry interest and promotion leads.'},
    {label:'Open Operations',value:summary.openOps,copy:'Total customer operations not closed.'},
  ],[summary]);

  const groups=[
    {title:'Needs Owner Action',items:ops.filter(item=>item.status!=='closed').slice(0,8)},
    {title:'Recovery + Service Quality',items:ops.filter(item=>item.kind==='recovery-case'||item.kind==='rating').slice(0,8)},
    {title:'Sales Opportunities',items:ops.filter(item=>['quote-request','reorder-opportunity','restock-interest','giveaway-interest'].includes(item.kind)).slice(0,8)},
  ];

  return (
    <section className="section owner-customer-ops" id="owner-customer-ops">
      <p className="eyebrow">Persistent Customer Operations</p>
      <h2>Quote requests, ratings, recovery, reviews, restock, and reorder work in one place.</h2>
      <p>{status}</p>

      <div className="customer-ops-buckets">
        {buckets.map(bucket=>(
          <article key={bucket.label}>
            <small>{bucket.label}</small>
            <strong>{bucket.value}</strong>
            <p>{bucket.copy}</p>
          </article>
        ))}
      </div>

      <div className="customer-ops-groups">
        {groups.map(group=>(
          <article key={group.title}>
            <h3>{group.title}</h3>
            {group.items.map(item=>(
              <div className="customer-op-item" key={item.id}>
                <b>{item.subject}</b>
                <span>{item.priority} · {item.kind} · {item.customerName}</span>
                <p>{item.ownerAction}</p>
              </div>
            ))}
            {!group.items.length&&<p>No records in this queue yet.</p>}
          </article>
        ))}
      </div>

      <style>{`
        .owner-customer-ops{border:1px solid rgba(248,231,176,.22);border-radius:28px;background:radial-gradient(circle at top right,rgba(212,175,55,.14),transparent 30%),linear-gradient(135deg,#080503,#020202);padding:18px}
        .owner-customer-ops h2{color:#f8e7b0;margin:.25rem 0}
        .owner-customer-ops p{color:#ded2bd}
        .customer-ops-buckets{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:14px}
        .customer-ops-buckets article,.customer-ops-groups article{border:1px solid rgba(248,231,176,.16);border-radius:20px;background:#050403;padding:14px}
        .customer-ops-buckets small{color:#d4af37;font-weight:900}
        .customer-ops-buckets strong{display:block;font-size:2rem;color:#f8e7b0}
        .customer-ops-groups{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:12px}
        .customer-ops-groups h3{color:#fff7ed}
        .customer-op-item{border-top:1px solid rgba(248,231,176,.12);padding:.75rem 0}
        .customer-op-item b{display:block;color:#f8e7b0}
        .customer-op-item span{display:block;color:#d4af37;font-size:.8rem;font-weight:900;text-transform:uppercase}
        .customer-op-item p{margin:.35rem 0 0}
        @media(max-width:1100px){.customer-ops-buckets{grid-template-columns:repeat(2,minmax(0,1fr))}.customer-ops-groups{grid-template-columns:1fr}}
        @media(max-width:640px){.customer-ops-buckets{grid-template-columns:1fr}}
      `}</style>
    </section>
  );
}
