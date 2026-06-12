'use client';

import {useEffect,useState} from 'react';

type FlowCheck={
  area:string;
  start:string;
  next:string;
  backend:string;
  ownerLoop:string;
  status:'complete'|'watch'|'blocked';
  notes:string;
};

export default function SiteFlowAuditMap(){
  const [checks,setChecks]=useState<FlowCheck[]>([]);
  const [summary,setSummary]=useState({complete:0,watch:0,blocked:0,total:0});
  const [recursiveLoop,setRecursiveLoop]=useState<string[]>([]);
  const [status,setStatus]=useState('Loading site flow audit...');

  useEffect(()=>{
    let active=true;
    fetch('/api/site-flow-audit',{credentials:'same-origin'})
      .then(response=>response.json())
      .then(result=>{
        if(!active)return;
        if(result?.ok){
          setChecks(result.checks||[]);
          setSummary(result.summary||{complete:0,watch:0,blocked:0,total:0});
          setRecursiveLoop(result.recursiveLoop||[]);
          setStatus('Site flow audit loaded.');
        }else{
          setStatus(result?.message||'Site flow audit unavailable.');
        }
      })
      .catch(()=>active&&setStatus('Site flow audit unavailable.'));
    return()=>{active=false};
  },[]);

  return (
    <section className="section site-flow-audit" id="site-flow-audit">
      <p className="eyebrow">Site Flow Audit</p>
      <h2>No dead-end customer, driver, or owner loops.</h2>
      <p>{status}</p>

      <div className="audit-summary">
        <article><small>Complete</small><strong>{summary.complete}</strong></article>
        <article><small>Watch</small><strong>{summary.watch}</strong></article>
        <article><small>Blocked</small><strong>{summary.blocked}</strong></article>
        <article><small>Total</small><strong>{summary.total}</strong></article>
      </div>

      <div className="audit-grid">
        {checks.map(check=>(
          <article key={check.area} className={`audit-${check.status}`}>
            <span>{check.status}</span>
            <h3>{check.area}</h3>
            <p><b>Start:</b> {check.start}</p>
            <p><b>Next:</b> {check.next}</p>
            <p><b>Backend:</b> {check.backend}</p>
            <p><b>Owner Loop:</b> {check.ownerLoop}</p>
            <small>{check.notes}</small>
          </article>
        ))}
      </div>

      <div className="recursive-loop-visual">
        <p className="eyebrow">Recursive Flow</p>
        {recursiveLoop.map((step,index)=>(
          <article key={step}>
            <b>{index+1}</b>
            <span>{step}</span>
          </article>
        ))}
      </div>

      <style>{`
        .site-flow-audit{border:1px solid rgba(248,231,176,.22);border-radius:28px;background:radial-gradient(circle at top right,rgba(212,175,55,.14),transparent 30%),linear-gradient(135deg,#080503,#020202);padding:18px}
        .site-flow-audit h2{color:#f8e7b0;margin:.25rem 0}
        .site-flow-audit p{color:#ded2bd}
        .audit-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:14px 0}
        .audit-summary article,.audit-grid article,.recursive-loop-visual{border:1px solid rgba(248,231,176,.16);border-radius:20px;background:#050403;padding:14px}
        .audit-summary small{color:#d4af37;font-weight:900;text-transform:uppercase}
        .audit-summary strong{display:block;color:#f8e7b0;font-size:2rem}
        .audit-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
        .audit-grid article span{display:inline-flex;border-radius:999px;padding:4px 10px;text-transform:uppercase;font-size:.72rem;font-weight:900}
        .audit-complete span{background:#14532d;color:#dcfce7}
        .audit-watch span{background:#713f12;color:#fef3c7}
        .audit-blocked span{background:#7f1d1d;color:#fee2e2}
        .audit-grid h3{color:#fff7ed;margin:.5rem 0}
        .audit-grid b{color:#f8e7b0}
        .audit-grid small{display:block;color:#d4af37;margin-top:8px}
        .recursive-loop-visual{display:grid;gap:8px;margin-top:12px}
        .recursive-loop-visual article{display:flex;gap:10px;align-items:flex-start;color:#ded2bd}
        .recursive-loop-visual b{display:grid;place-items:center;min-width:28px;height:28px;border-radius:999px;background:linear-gradient(135deg,#facc15,#a16207);color:#160b04}
        @media(max-width:900px){.audit-summary,.audit-grid{grid-template-columns:1fr}}
      `}</style>
    </section>
  );
}
