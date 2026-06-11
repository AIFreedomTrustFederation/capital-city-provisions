'use client';

import {useEffect,useMemo,useState} from 'react';

type BoardRecord={
  id:string;
  audience:string;
  subject:string;
  body:string;
  status:string;
  aiApproved?:boolean;
  createdAt?:string;
  updatedAt?:string;
};

function approved(record:BoardRecord){
  return record.audience==='customer-approved'||record.aiApproved;
}

function format(value?:string){
  if(!value)return 'No timestamp';
  try{return new Date(value).toLocaleString()}
  catch{return value}
}

export default function CustomerMessageHistory(){
  const [records,setRecords]=useState<BoardRecord[]>([]);

  useEffect(()=>{
    let active=true;
    fetch('/api/internal-board',{credentials:'same-origin'})
      .then(response=>response.json())
      .then(result=>{if(active)setRecords(result?.records||[])})
      .catch(()=>{if(active)setRecords([])});
    return()=>{active=false};
  },[]);

  const messages=useMemo(()=>records.filter(approved),[records]);

  return (
    <section className="section customer-message-history" id="customer-message-history">
      <p className="eyebrow">Customer Message History</p>
      <h2>Approved replies, delivery notes, receipt notes, and reschedule updates.</h2>

      <div className="customer-history-list">
        {messages.length?messages.map(message=>(
          <article key={message.id}>
            <small>{format(message.updatedAt||message.createdAt)}</small>
            <h3>{message.subject}</h3>
            <p>{message.body}</p>
          </article>
        )):(
          <article>
            <small>Waiting for owner approval</small>
            <h3>No approved messages yet.</h3>
            <p>Once the owner approves customer communication, the history will appear here.</p>
          </article>
        )}
      </div>

      <style>{`
        .customer-message-history{border:1px solid rgba(248,231,176,.22);border-radius:28px;background:linear-gradient(135deg,#070504,#020202);padding:18px}
        .customer-message-history h2{color:#f8e7b0;margin:.25rem 0}
        .customer-history-list{display:grid;gap:12px;margin-top:14px}
        .customer-history-list article{border:1px solid rgba(248,231,176,.16);border-radius:20px;background:#050403;padding:14px}
        .customer-history-list small{color:#d4af37;font-weight:900}
        .customer-history-list h3{color:#fff7ed}
        .customer-history-list p{color:#ded2bd}
      `}</style>
    </section>
  );
}
