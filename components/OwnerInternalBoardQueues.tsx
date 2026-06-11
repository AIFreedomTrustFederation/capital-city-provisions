'use client';

import {useEffect,useMemo,useState} from 'react';
import {displayContextTrust} from '../lib/context-trust';

type BoardRecord={
  id:string;
  audience:'owner'|'driver'|'customer-approved'|string;
  createdBy?:string;
  subject:string;
  body:string;
  status:'open'|'review'|'closed'|string;
  priority:'low'|'normal'|'high'|'urgent'|string;
  routeId?:string;
  orderId?:string;
  source?:string;
  aiApproved?:boolean;
  metadata?:Record<string,any>;
  createdAt?:string;
  updatedAt?:string;
  closedAt?:string;
  contextTrust?:any;
};

type Queue={
  id:string;
  title:string;
  description:string;
  records:BoardRecord[];
};

function actionType(record:BoardRecord){
  return String(record.metadata?.reviewAction||record.source||record.subject||'').toLowerCase();
}

function queueRecords(records:BoardRecord[]):Queue[]{
  const open=records.filter(record=>record.status!=='closed');
  return [
    {
      id:'urgent',
      title:'Urgent Items',
      description:'High-priority owner decisions, blocked routes, customer replies, and escalated tasks.',
      records:open.filter(record=>record.priority==='urgent'||record.priority==='high'),
    },
    {
      id:'owner-decisions',
      title:'Owner Decisions',
      description:'Confirmed owner decisions that teach the system what is true.',
      records:records.filter(record=>actionType(record).includes('confirm')||record.subject?.toLowerCase().includes('owner decision')),
    },
    {
      id:'follow-ups',
      title:'Follow-Ups',
      description:'Open owner follow-ups that need a call, text, review, or final decision.',
      records:open.filter(record=>actionType(record).includes('follow-up')||record.subject?.toLowerCase().includes('follow-up')),
    },
    {
      id:'driver-tasks',
      title:'Driver Tasks',
      description:'Driver-facing tasks created from owner review, route issues, and delivery notes.',
      records:open.filter(record=>record.audience==='driver'||actionType(record).includes('driver-task')||record.subject?.toLowerCase().includes('driver task')),
    },
    {
      id:'customer-replies',
      title:'Customer Reply Drafts',
      description:'Customer-facing replies waiting for owner approval before they become approved messages.',
      records:open.filter(record=>actionType(record).includes('customer-reply')||record.subject?.toLowerCase().includes('customer reply')),
    },
    {
      id:'closed',
      title:'Closed / Archived',
      description:'Dismissed, completed, approved, or archived work that should not stay in the active queue.',
      records:records.filter(record=>record.status==='closed').slice(0,8),
    },
  ];
}

function label(record:BoardRecord){
  if(record.status==='closed')return 'Closed';
  if(record.priority==='urgent')return 'Urgent';
  if(record.priority==='high')return 'High Priority';
  return 'Open';
}

function formatDate(value?:string){
  if(!value)return 'No time';
  try{return new Date(value).toLocaleString();}
  catch{return value;}
}

function payloadFor(record:BoardRecord,patch:Partial<BoardRecord>){
  return {
    id:record.id,
    audience:patch.audience||record.audience||'owner',
    subject:patch.subject||record.subject||'Internal board item',
    body:patch.body||record.body||'',
    status:patch.status||record.status||'open',
    priority:patch.priority||record.priority||'normal',
    routeId:patch.routeId??record.routeId??'',
    orderId:patch.orderId??record.orderId??'',
    source:patch.source||record.source||'owner-work-queue',
    aiApproved:patch.aiApproved??record.aiApproved??false,
    metadata:{
      ...(record.metadata||{}),
      ...(patch.metadata||{}),
      lastOwnerQueueAction:patch.metadata?.lastOwnerQueueAction||'updated',
      lastOwnerQueueActionAt:new Date().toISOString(),
    },
  };
}

export default function OwnerInternalBoardQueues(){
  const [records,setRecords]=useState<BoardRecord[]>([]);
  const [status,setStatus]=useState('Loading work queues...');
  const [busy,setBusy]=useState('');

  async function load(){
    setStatus('Loading work queues...');
    const result=await fetch('/api/internal-board',{credentials:'same-origin'}).then(r=>r.json()).catch(()=>null);
    if(result?.ok){
      setRecords(result.records||[]);
      setStatus(`Loaded ${result.records?.length||0} internal board item(s).`);
    }else{
      setRecords([]);
      setStatus(result?.message||'Internal board unavailable.');
    }
  }

  useEffect(()=>{load()},[]);

  async function updateRecord(record:BoardRecord,patch:Partial<BoardRecord>){
    setBusy(record.id);
    const result=await fetch('/api/internal-board',{
      method:'POST',
      credentials:'same-origin',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payloadFor(record,patch)),
    }).then(r=>r.json()).catch(()=>null);

    setBusy('');
    if(result?.ok){
      await load();
    }else{
      setStatus(result?.message||'Could not update internal board item.');
    }
  }

  const queues=useMemo(()=>queueRecords(records),[records]);
  const activeTotal=records.filter(record=>record.status!=='closed').length;
  const urgentTotal=records.filter(record=>record.status!=='closed'&&(record.priority==='urgent'||record.priority==='high')).length;
  const replyTotal=queues.find(queue=>queue.id==='customer-replies')?.records.length||0;
  const driverTotal=queues.find(queue=>queue.id==='driver-tasks')?.records.length||0;

  return (
    <section className="section owner-work-queues" id="owner-work-queues">
      <div className="owner-queues-header">
        <div>
          <p className="eyebrow">Owner Execution Command Center</p>
          <h2>Work queues that close the loop.</h2>
          <p>{status}</p>
        </div>
        <div className="owner-queue-totals">
          <span>Active <b>{activeTotal}</b></span>
          <span>Urgent <b>{urgentTotal}</b></span>
          <span>Driver <b>{driverTotal}</b></span>
          <span>Replies <b>{replyTotal}</b></span>
        </div>
      </div>

      <div className="owner-queues-grid">
        {queues.map(queue=>(
          <article className="owner-queue" key={queue.id}>
            <header>
              <div>
                <small>{queue.records.length} item(s)</small>
                <h3>{queue.title}</h3>
              </div>
              <p>{queue.description}</p>
            </header>

            <div className="owner-queue-items">
              {queue.records.length?queue.records.map(record=>(
                <div className="owner-queue-item" key={`${queue.id}-${record.id}`}>
                  <div className="owner-queue-item-top">
                    <span>{label(record)}</span>
                    <small>{displayContextTrust(record.contextTrust)}</small>
                  </div>

                  <h4>{record.subject}</h4>
                  <p>{record.body||'No details saved yet.'}</p>

                  <div className="owner-queue-meta">
                    <span>Audience: <b>{record.audience||'owner'}</b></span>
                    <span>Priority: <b>{record.priority||'normal'}</b></span>
                    <span>Status: <b>{record.status||'open'}</b></span>
                    {record.orderId&&<span>Order: <b>{record.orderId}</b></span>}
                    {record.routeId&&<span>Route: <b>{record.routeId}</b></span>}
                    <span>Updated: <b>{formatDate(record.updatedAt||record.createdAt)}</b></span>
                  </div>

                  <div className="owner-queue-actions">
                    {record.status==='closed'?(
                      <button disabled={busy===record.id} onClick={()=>updateRecord(record,{status:'open',priority:'normal',metadata:{lastOwnerQueueAction:'reopen'}})}>Reopen</button>
                    ):(
                      <>
                        <button disabled={busy===record.id} onClick={()=>updateRecord(record,{status:'closed',metadata:{lastOwnerQueueAction:'complete'}})}>Mark Complete</button>
                        <button disabled={busy===record.id} onClick={()=>updateRecord(record,{priority:'urgent',status:'open',metadata:{lastOwnerQueueAction:'escalate'}})}>Escalate</button>
                        {(actionType(record).includes('customer-reply')||record.subject?.toLowerCase().includes('customer reply'))&&(
                          <button disabled={busy===record.id} onClick={()=>updateRecord(record,{audience:'customer-approved',status:'closed',aiApproved:true,metadata:{lastOwnerQueueAction:'approve-customer-reply'}})}>Approve Reply</button>
                        )}
                        <button disabled={busy===record.id} onClick={()=>updateRecord(record,{status:'closed',priority:'low',metadata:{lastOwnerQueueAction:'archive'}})}>Archive</button>
                      </>
                    )}
                  </div>
                </div>
              )):(
                <div className="owner-queue-empty">
                  <h4>Nothing waiting here.</h4>
                  <p>This queue fills when owner decisions, review actions, customer replies, or driver tasks are created.</p>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      <style>{`
        .owner-work-queues{border:1px solid rgba(248,231,176,.22);border-radius:28px;background:linear-gradient(135deg,#070504,#020202);padding:20px}
        .owner-queues-header{display:grid;grid-template-columns:1fr auto;gap:16px;align-items:start;margin-bottom:16px}
        .owner-queues-header h2{color:#f8e7b0;margin:.25rem 0}
        .owner-queues-header p{color:#ded2bd}
        .owner-queue-totals{display:grid;grid-template-columns:repeat(2,minmax(110px,1fr));gap:8px}
        .owner-queue-totals span{border:1px solid rgba(212,175,55,.28);border-radius:16px;background:#050403;color:#ded2bd;padding:10px;display:flex;justify-content:space-between;gap:10px}
        .owner-queue-totals b{color:#f8e7b0}
        .owner-queues-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
        .owner-queue{border:1px solid rgba(248,231,176,.2);border-radius:22px;background:#050403;padding:14px}
        .owner-queue header{border-bottom:1px solid rgba(212,175,55,.18);padding-bottom:10px;margin-bottom:10px}
        .owner-queue header small{color:#d4af37;font-weight:900}
        .owner-queue h3{color:#f8e7b0;margin:.2rem 0}
        .owner-queue header p{color:#ded2bd;margin:.35rem 0 0}
        .owner-queue-items{display:grid;gap:10px;max-height:560px;overflow:auto;padding-right:4px}
        .owner-queue-item,.owner-queue-empty{border:1px solid rgba(248,231,176,.14);border-radius:18px;background:linear-gradient(180deg,#100904,#060403);padding:12px}
        .owner-queue-item-top{display:flex;justify-content:space-between;gap:10px;align-items:center}
        .owner-queue-item-top span{border-radius:999px;background:#241506;color:#f8e7b0;padding:5px 9px;font-size:.78rem;font-weight:900}
        .owner-queue-item-top small{color:#d4af37;font-weight:800;text-align:right}
        .owner-queue-item h4,.owner-queue-empty h4{color:#fff7ed;margin:.65rem 0 .35rem}
        .owner-queue-item p,.owner-queue-empty p{color:#ded2bd;margin:0}
        .owner-queue-meta{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin-top:10px}
        .owner-queue-meta span{font-size:.82rem;color:#b8aa96}
        .owner-queue-meta b{color:#fff7ed}
        .owner-queue-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
        .owner-queue-actions button{border:1px solid rgba(248,231,176,.42);border-radius:999px;background:#0b0704;color:#fff7ed;padding:8px 10px;font-weight:900;cursor:pointer}
        .owner-queue-actions button:first-child{background:linear-gradient(135deg,#facc15,#a16207);color:#170b04}
        .owner-queue-actions button:disabled{opacity:.55;cursor:wait}
        @media(max-width:900px){.owner-queues-header{grid-template-columns:1fr}.owner-queues-grid{grid-template-columns:1fr}.owner-queue-totals{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:560px){.owner-queue-meta{grid-template-columns:1fr}.owner-work-queues{padding:12px;border-radius:20px}}
      `}</style>
    </section>
  );
}
