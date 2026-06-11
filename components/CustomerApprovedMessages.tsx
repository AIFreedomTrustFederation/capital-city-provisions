'use client';

import {useEffect,useMemo,useState} from 'react';
import {displayContextTrust} from '../lib/context-trust';

type BoardRecord={
  id:string;
  audience:string;
  subject:string;
  body:string;
  status:string;
  priority:string;
  routeId?:string;
  orderId?:string;
  aiApproved?:boolean;
  metadata?:Record<string,any>;
  createdAt?:string;
  updatedAt?:string;
  contextTrust?:any;
};

function isApproved(record:BoardRecord){
  return record.audience==='customer-approved'||record.aiApproved===true;
}

export default function CustomerApprovedMessages(){
  const [records,setRecords]=useState<BoardRecord[]>([]);
  const [status,setStatus]=useState('Loading approved messages...');

  useEffect(()=>{
    let active=true;
    fetch('/api/internal-board',{credentials:'same-origin'})
      .then(response=>response.json())
      .then(result=>{
        if(!active)return;
        setRecords(result?.records||[]);
        setStatus(result?.ok?'Owner-approved messages loaded.':'Approved messages appear here after owner review.');
      })
      .catch(()=>{
        if(active)setStatus('Approved messages appear here after owner review.');
      });
    return()=>{active=false};
  },[]);

  const approved=useMemo(()=>records.filter(isApproved),[records]);

  return (
    <section className="section customer-approved-messages" id="customer-approved-messages">
      <p className="eyebrow">Customer Approved Messages</p>
      <h2>Only owner-approved communication appears here.</h2>
      <p>{status}</p>

      <div className="customer-approved-grid">
        {approved.length?approved.map(record=>(
          <article key={record.id}>
            <small>{displayContextTrust(record.contextTrust)}</small>
            <h3>{record.subject}</h3>
            <p>{record.body||'Approved customer update.'}</p>
            <div>
              {record.orderId&&<span>Order <b>{record.orderId}</b></span>}
              {record.routeId&&<span>Route <b>{record.routeId}</b></span>}
              <span>Status <b>{record.status}</b></span>
            </div>
          </article>
        )):(
          <article>
            <small>Customer Safe</small>
            <h3>No approved messages yet.</h3>
            <p>Customer-facing updates will appear after the owner approves a reply draft.</p>
          </article>
        )}
      </div>

      <style>{`
        .customer-approved-messages{border:1px solid rgba(248,231,176,.22);border-radius:28px;background:linear-gradient(135deg,#080503,#020202);padding:18px}
        .customer-approved-messages h2{color:#f8e7b0;margin:.25rem 0}
        .customer-approved-messages p{color:#ded2bd}
        .customer-approved-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;margin-top:14px}
        .customer-approved-grid article{border:1px solid rgba(248,231,176,.16);border-radius:20px;background:linear-gradient(180deg,#100904,#050403);padding:14px}
        .customer-approved-grid small{color:#d4af37;font-weight:900}
        .customer-approved-grid h3{color:#fff7ed}
        .customer-approved-grid div{display:grid;gap:6px;margin-top:10px}
        .customer-approved-grid span{color:#b8aa96;font-size:.86rem}
        .customer-approved-grid b{color:#fff7ed}
      `}</style>
    </section>
  );
}
