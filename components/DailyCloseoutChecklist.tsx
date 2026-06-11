'use client';

import {useEffect,useMemo,useState} from 'react';

type BoardRecord={
  id:string;
  audience:string;
  subject:string;
  body:string;
  status:string;
  priority:string;
  aiApproved?:boolean;
  metadata?:Record<string,any>;
};

function lower(value:any){
  return String(value||'').toLowerCase();
}

function has(record:BoardRecord,words:string[]){
  const text=lower(`${record.subject} ${record.body} ${record.audience} ${record.priority} ${record.metadata?.reviewAction||''}`);
  return words.some(word=>text.includes(word));
}

export default function DailyCloseoutChecklist(){
  const [records,setRecords]=useState<BoardRecord[]>([]);

  useEffect(()=>{
    let active=true;
    fetch('/api/internal-board',{credentials:'same-origin'})
      .then(response=>response.json())
      .then(result=>{if(active)setRecords(result?.records||[])})
      .catch(()=>{if(active)setRecords([])});
    return()=>{active=false};
  },[]);

  const checklist=useMemo(()=>{
    const open=records.filter(record=>record.status!=='closed');
    const closed=records.filter(record=>record.status==='closed');
    return [
      {label:'Owner decisions closed',done:closed.filter(record=>has(record,['owner decision','confirm'])).length,total:records.filter(record=>has(record,['owner decision','confirm'])).length},
      {label:'Driver tasks completed',done:closed.filter(record=>record.audience==='driver'||has(record,['driver task','driver-task'])).length,total:records.filter(record=>record.audience==='driver'||has(record,['driver task','driver-task'])).length},
      {label:'Customer replies approved',done:records.filter(record=>record.audience==='customer-approved'||record.aiApproved).length,total:records.filter(record=>has(record,['customer reply','reply draft','customer-reply'])).length},
      {label:'Payments handled',done:closed.filter(record=>has(record,['payment','invoice','receipt'])).length,total:records.filter(record=>has(record,['payment','invoice','receipt'])).length},
      {label:'Route issues handled',done:closed.filter(record=>has(record,['route','missed','blocked'])).length,total:records.filter(record=>has(record,['route','missed','blocked'])).length},
      {label:'Restock blockers handled',done:closed.filter(record=>has(record,['restock','inventory','shortage'])).length,total:records.filter(record=>has(record,['restock','inventory','shortage'])).length},
      {label:'Hot leads contacted',done:closed.filter(record=>has(record,['hot lead','lead','sales'])).length,total:records.filter(record=>has(record,['hot lead','lead','sales'])).length},
      {label:'Urgent items cleared',done:records.filter(record=>record.status==='closed'&&(record.priority==='urgent'||record.priority==='high')).length,total:records.filter(record=>record.priority==='urgent'||record.priority==='high').length},
    ].map(item=>({...item,open:Math.max(0,item.total-item.done)}));
  },[records]);

  return (
    <section className="section daily-closeout" id="daily-closeout">
      <p className="eyebrow">Daily Closeout Checklist</p>
      <h2>Finish the day with nothing important left floating.</h2>

      <div className="daily-closeout-grid">
        {checklist.map(item=>(
          <article key={item.label}>
            <small>{item.open?'Still Open':'Clear'}</small>
            <h3>{item.label}</h3>
            <p>{item.done} closed / {item.total} total</p>
            <div><span style={{width:`${item.total?Math.round((item.done/item.total)*100):100}%`}}/></div>
          </article>
        ))}
      </div>

      <style>{`
        .daily-closeout{border:1px solid rgba(248,231,176,.22);border-radius:28px;background:linear-gradient(135deg,#080503,#020202);padding:18px}
        .daily-closeout h2{color:#f8e7b0;margin:.25rem 0}
        .daily-closeout-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:14px}
        .daily-closeout-grid article{border:1px solid rgba(248,231,176,.16);border-radius:20px;background:#050403;padding:14px}
        .daily-closeout-grid small{color:#d4af37;font-weight:900}
        .daily-closeout-grid h3{color:#fff7ed}
        .daily-closeout-grid p{color:#ded2bd}
        .daily-closeout-grid div{height:8px;border-radius:999px;background:#1f1308;overflow:hidden}
        .daily-closeout-grid span{display:block;height:100%;background:linear-gradient(135deg,#facc15,#a16207)}
        @media(max-width:900px){.daily-closeout-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:560px){.daily-closeout-grid{grid-template-columns:1fr}}
      `}</style>
    </section>
  );
}
