'use client';

import {useEffect,useMemo,useState} from 'react';

type Props={
  title?:string;
  subtitle?:string;
  role?:'owner'|'driver'|'customer';
};

type BoardRecord={
  id:string;
  audience:string;
  subject:string;
  body?:string;
  status:string;
  priority:string;
  aiApproved?:boolean;
  metadata?:Record<string,any>;
};

function lower(value:any){
  return String(value||'').toLowerCase();
}

function has(record:BoardRecord,words:string[]){
  const text=lower(`${record.subject} ${record.body} ${record.audience} ${record.status} ${record.priority} ${record.metadata?.reviewAction||''}`);
  return words.some(word=>text.includes(word));
}

export default function PortalStatusCards({title='Portal Status',subtitle='Live execution signals from the internal board.',role='owner'}:Props){
  const [records,setRecords]=useState<BoardRecord[]>([]);
  const [status,setStatus]=useState('Loading portal status...');

  useEffect(()=>{
    let active=true;
    fetch('/api/internal-board',{credentials:'same-origin'})
      .then(response=>response.json())
      .then(result=>{
        if(!active)return;
        setRecords(result?.records||[]);
        setStatus(result?.ok?`Loaded ${result.records?.length||0} board record(s).`:'No internal board access for this portal yet.');
      })
      .catch(()=>{
        if(active)setStatus('Portal board status unavailable.');
      });
    return()=>{active=false};
  },[]);

  const model=useMemo(()=>{
    const open=records.filter(record=>record.status!=='closed');
    return [
      {label:'Open Tasks',value:open.filter(record=>record.audience==='driver'||has(record,['driver task','driver-task'])).length,action:'Complete, block, or escalate driver work.'},
      {label:'Approved Messages',value:records.filter(record=>record.audience==='customer-approved'||record.aiApproved).length,action:'Owner-approved customer communication.'},
      {label:'Pending Replies',value:open.filter(record=>has(record,['customer reply','customer-reply','reply draft'])).length,action:'Reply drafts waiting for approval.'},
      {label:'Route Issues',value:open.filter(record=>has(record,['route','missed','blocked','restock','partial'])).length,action:'Routes needing review before promises.'},
      {label:'Payment Items',value:open.filter(record=>has(record,['payment','invoice','receipt','paid','unpaid'])).length,action:'Money items requiring action.'},
      {label:'Restock Items',value:open.filter(record=>has(record,['restock','shortage','inventory'])).length,action:'Inventory problems before selling more.'},
    ];
  },[records]);

  return (
    <section className={`section portal-status-cards portal-${role}`} id={`${role}-portal-status`}>
      <div className="portal-status-header">
        <div>
          <p className="eyebrow">{title}</p>
          <h2>{subtitle}</h2>
          <p>{status}</p>
        </div>
      </div>

      <div className="portal-status-grid">
        {model.map(card=>(
          <article key={card.label}>
            <small>{card.label}</small>
            <strong>{card.value}</strong>
            <p>{card.action}</p>
          </article>
        ))}
      </div>

      <style>{`
        .portal-status-cards{border:1px solid rgba(248,231,176,.22);border-radius:28px;background:linear-gradient(135deg,#070504,#020202);padding:18px}
        .portal-status-header h2{color:#f8e7b0;margin:.25rem 0}
        .portal-status-header p{color:#ded2bd}
        .portal-status-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:14px}
        .portal-status-grid article{border:1px solid rgba(248,231,176,.16);border-radius:20px;background:linear-gradient(180deg,#100904,#050403);padding:14px;min-height:128px;display:flex;flex-direction:column;justify-content:space-between}
        .portal-status-grid small{color:#d4af37;font-weight:900}
        .portal-status-grid strong{color:#f8e7b0;font-size:2rem;line-height:1}
        .portal-status-grid p{color:#ded2bd;margin:0}
        @media(max-width:900px){.portal-status-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:560px){.portal-status-grid{grid-template-columns:1fr}.portal-status-cards{padding:12px;border-radius:20px}}
      `}</style>
    </section>
  );
}
