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
  source?:string;
  aiApproved?:boolean;
  metadata?:Record<string,any>;
  createdAt?:string;
  updatedAt?:string;
  contextTrust?:any;
};

function driverTask(record:BoardRecord){
  const text=`${record.audience} ${record.subject} ${record.body} ${record.metadata?.reviewAction||''}`.toLowerCase();
  return record.audience==='driver'||text.includes('driver task')||text.includes('driver-task');
}

function statusLabel(record:BoardRecord){
  if(record.status==='closed')return 'Completed';
  if(record.priority==='urgent')return 'Urgent';
  if(record.priority==='high')return 'High Priority';
  return 'Open';
}

function payload(record:BoardRecord,status:string,priority:string,action:string){
  return {
    id:record.id,
    audience:'driver',
    subject:record.subject,
    body:record.body,
    status,
    priority,
    routeId:record.routeId||'',
    orderId:record.orderId||'',
    source:record.source||'driver-task-inbox',
    aiApproved:record.aiApproved||false,
    metadata:{
      ...(record.metadata||{}),
      driverAction:action,
      driverActionAt:new Date().toISOString(),
    },
  };
}

export default function DriverTaskInbox(){
  const [records,setRecords]=useState<BoardRecord[]>([]);
  const [status,setStatus]=useState('Loading driver tasks...');
  const [busy,setBusy]=useState('');

  async function load(){
    const result=await fetch('/api/internal-board',{credentials:'same-origin'}).then(r=>r.json()).catch(()=>null);
    if(result?.ok){
      setRecords(result.records||[]);
      setStatus(`Loaded ${result.records?.length||0} board record(s).`);
    }else{
      setRecords([]);
      setStatus(result?.message||'Driver task board unavailable.');
    }
  }

  useEffect(()=>{load()},[]);

  async function update(record:BoardRecord,status:string,priority:string,action:string){
    setBusy(record.id);
    const result=await fetch('/api/internal-board',{
      method:'POST',
      credentials:'same-origin',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload(record,status,priority,action)),
    }).then(r=>r.json()).catch(()=>null);

    setBusy('');
    if(result?.ok)await load();
    else setStatus(result?.message||'Could not update driver task.');
  }

  const tasks=useMemo(()=>records.filter(driverTask),[records]);
  const open=tasks.filter(task=>task.status!=='closed');
  const completed=tasks.filter(task=>task.status==='closed');

  return (
    <section className="section driver-task-inbox" id="driver-task-inbox">
      <div className="driver-task-header">
        <div>
          <p className="eyebrow">Driver Task Inbox</p>
          <h2>Field tasks created by the owner.</h2>
          <p>{status}</p>
        </div>
        <div className="driver-task-counts">
          <span>Open <b>{open.length}</b></span>
          <span>Completed <b>{completed.length}</b></span>
        </div>
      </div>

      <div className="driver-task-grid">
        {tasks.length?tasks.map(task=>(
          <article className="driver-task-card" key={task.id}>
            <div className="driver-task-top">
              <span>{statusLabel(task)}</span>
              <small>{displayContextTrust(task.contextTrust)}</small>
            </div>

            <h3>{task.subject}</h3>
            <p>{task.body||'No task details saved yet.'}</p>

            <div className="driver-task-meta">
              {task.routeId&&<span>Route <b>{task.routeId}</b></span>}
              {task.orderId&&<span>Order <b>{task.orderId}</b></span>}
              <span>Priority <b>{task.priority}</b></span>
              <span>Status <b>{task.status}</b></span>
            </div>

            <div className="driver-task-actions">
              <button disabled={busy===task.id||task.status==='closed'} onClick={()=>update(task,'open','high','started')}>Started</button>
              <button disabled={busy===task.id} onClick={()=>update(task,'closed','normal','completed')}>Completed</button>
              <button disabled={busy===task.id||task.status==='closed'} onClick={()=>update(task,'open','urgent','blocked')}>Blocked</button>
              <button disabled={busy===task.id||task.status==='closed'} onClick={()=>update(task,'open','high','customer-not-home')}>Customer Not Home</button>
              <button disabled={busy===task.id||task.status==='closed'} onClick={()=>update(task,'open','high','payment-collected')}>Payment Collected</button>
              <button disabled={busy===task.id||task.status==='closed'} onClick={()=>update(task,'open','urgent','restock-needed')}>Restock Needed</button>
            </div>
          </article>
        )):(
          <article className="driver-task-empty">
            <h3>No driver tasks yet.</h3>
            <p>Owner-created driver tasks will appear here after the owner converts review items into field work.</p>
          </article>
        )}
      </div>

      <style>{`
        .driver-task-inbox{border:1px solid rgba(248,231,176,.22);border-radius:28px;background:linear-gradient(135deg,#080503,#020202);padding:18px}
        .driver-task-header{display:grid;grid-template-columns:1fr auto;gap:14px;align-items:start}
        .driver-task-header h2{color:#f8e7b0;margin:.25rem 0}
        .driver-task-header p{color:#ded2bd}
        .driver-task-counts{display:grid;gap:8px}
        .driver-task-counts span{border:1px solid rgba(212,175,55,.24);border-radius:16px;background:#050403;color:#ded2bd;padding:10px;display:flex;justify-content:space-between;gap:14px}
        .driver-task-counts b{color:#f8e7b0}
        .driver-task-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:14px}
        .driver-task-card,.driver-task-empty{border:1px solid rgba(248,231,176,.16);border-radius:20px;background:linear-gradient(180deg,#100904,#050403);padding:14px}
        .driver-task-top{display:flex;justify-content:space-between;gap:10px}
        .driver-task-top span{border-radius:999px;background:#241506;color:#f8e7b0;padding:5px 9px;font-size:.78rem;font-weight:900}
        .driver-task-top small{color:#d4af37;font-weight:800;text-align:right}
        .driver-task-card h3,.driver-task-empty h3{color:#fff7ed}
        .driver-task-card p,.driver-task-empty p{color:#ded2bd}
        .driver-task-meta{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin-top:10px}
        .driver-task-meta span{font-size:.84rem;color:#b8aa96}
        .driver-task-meta b{color:#fff7ed}
        .driver-task-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
        .driver-task-actions button{border:1px solid rgba(248,231,176,.42);border-radius:999px;background:#0b0704;color:#fff7ed;padding:8px 10px;font-weight:900;cursor:pointer}
        .driver-task-actions button:first-child,.driver-task-actions button:nth-child(2){background:linear-gradient(135deg,#facc15,#a16207);color:#170b04}
        .driver-task-actions button:disabled{opacity:.55;cursor:wait}
        @media(max-width:900px){.driver-task-header,.driver-task-grid{grid-template-columns:1fr}}
        @media(max-width:560px){.driver-task-meta{grid-template-columns:1fr}.driver-task-inbox{padding:12px;border-radius:20px}}
      `}</style>
    </section>
  );
}
