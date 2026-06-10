'use client';
import {useEffect,useMemo,useState} from 'react';
import LocalAIConcierge from './LocalAIConcierge';

type Role='customer'|'driver'|'owner';
type WorkspaceProps={role:Role;title:string;subtitle:string;memory:Record<string,any>};

function money(value:number){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value||0)}

function roleIntro(role:Role){
  if(role==='customer')return 'Customer AI helps people understand routes, boxes, bonuses, and free giveaway entry before they submit details.';
  if(role==='driver')return 'Driver AI turns orders and routes into a simple delivery-day command center with turn-ins and follow-up notes.';
  return 'Owner AI chats with leads, orders, routes, driver turn-ins, reports, and route-learning notes from one control room.';
}

function buildCsv(rows:Record<string,any>[]){
  if(!rows.length)return '';
  const headers=Object.keys(rows[0]);
  const escape=(value:any)=>`"${String(value??'').replace(/"/g,'""')}"`;
  return [headers.join(','),...rows.map(row=>headers.map(header=>escape(row[header])).join(','))].join('\n');
}

function firstZip(memory:Record<string,any>){return memory.zip||memory.route?.zip||memory.routes?.[0]?.zips?.[0]||memory.orders?.[0]?.zip||memory.orderLifecycle?.[0]?.zip||''}
function driverName(memory:Record<string,any>){return memory.driver||memory.routes?.[0]?.driver||'Driver'}
function mergeRoleMemory(base:Record<string,any>,apiContext:Record<string,any>|null){
  if(!apiContext)return base;
  return {...base,...apiContext,orders:apiContext.orders||base.orders||base.orderLifecycle||[],routes:apiContext.routes||base.routes||[],turnIns:apiContext.turnIns||base.turnIns||[],dailyReport:apiContext.dailyReport||base.dailyReport,ownerReport:apiContext.report||base.ownerReport||base.report,trainingSummary:apiContext.trainingSummary||base.trainingSummary};
}

export default function RoleAIWorkspace({role,title,subtitle,memory}:WorkspaceProps){
  const [turnIn,setTurnIn]=useState({driver:'Marco',routeId:'roseville',completed:'',missed:'',rescheduled:'',payments:'',customerNotes:'',ownerFollowup:''});
  const [savedTurnIns,setSavedTurnIns]=useState<Record<string,string>[]>([]);
  const [notice,setNotice]=useState('');
  const [apiContext,setApiContext]=useState<Record<string,any>|null>(null);
  const [contextStatus,setContextStatus]=useState('Loading role-safe WebAI context...');

  useEffect(()=>{
    const controller=new AbortController();
    async function loadContext(){
      const params=new URLSearchParams({role});
      if(role==='customer'){const zip=firstZip(memory);if(zip)params.set('zip',String(zip))}
      if(role==='driver')params.set('driver',String(driverName(memory)));
      try{
        const response=await fetch(`/api/ai/context?${params.toString()}`,{credentials:'same-origin',signal:controller.signal});
        const result=await response.json();
        if(!response.ok||!result.ok){setApiContext(null);setContextStatus(result?.message||'Role-safe WebAI context unavailable. Using page context fallback.');return}
        setApiContext(result.context||{});
        setContextStatus(`WebAI context loaded from ${result.storage||'role-safe context API'}.`);
      }catch(error:any){
        if(error?.name==='AbortError')return;
        setApiContext(null);setContextStatus('Role-safe WebAI context could not load. Using page context fallback.');
      }
    }
    loadContext();
    return()=>controller.abort();
  },[role,memory]);

  const liveMemory=useMemo(()=>mergeRoleMemory(memory,apiContext),[memory,apiContext]);
  const routes=liveMemory.routes||(liveMemory.route?[liveMemory.route]:[]);
  const orders=liveMemory.orders||liveMemory.orderLifecycle||routes.flatMap((route:any)=>route.orders||[]);
  const report=liveMemory.dailyReport||liveMemory.ownerReport||liveMemory.report||{};
  const turnIns=[...(liveMemory.turnIns||[]),...savedTurnIns];
  const aiContext=useMemo(()=>({role,contextSource:apiContext?'api/ai/context':'page-fallback',contextStatus,memory:{...liveMemory,routes,orders,turnIns},permissions:{customer:['own route','box guidance','promo clarity','giveaway rules'],driver:['assigned routes','stop notes','turn-ins'],owner:['all orders','all routes','reports','exports','route learning']}}),[role,apiContext,contextStatus,liveMemory,routes,orders,turnIns]);

  async function submitTurnIn(e:React.FormEvent){
    e.preventDefault();
    const entry={...turnIn,id:`turnin-${Date.now()}`,createdAt:new Date().toISOString()};
    setSavedTurnIns(current=>[entry,...current]);
    setNotice('Turn-in saved locally and submitted to ops intake.');
    try{await fetch('/api/ops/turn-ins',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(entry)})}catch(error){setNotice('Turn-in saved locally. Ops intake did not respond from this device.')}
  }

  function downloadCsv(){
    const rows=orders.map((order:any)=>({id:order.id,customer:order.customer||order.customerName,zip:order.zip,routeId:order.routeId,box:order.box,value:order.value,status:order.status,phone:order.phone,promo:order.promo||'',notes:order.notes}));
    const csv=buildCsv(rows);
    const blob=new Blob([csv],{type:'text/csv'});
    const url=URL.createObjectURL(blob);
    const link=document.createElement('a');
    link.href=url;link.download='capital-city-orders.csv';link.click();URL.revokeObjectURL(url);
  }

  return <main className="site page-flow ops-shell">
    <section className="page-hero poster-frame ops-hero"><div><p className="eyebrow">{role} workspace</p><h1>{title}</h1><p className="lead">{subtitle}</p><p>{roleIntro(role)}</p><div className="actions"><a href="#ai-workspace">Open AI Workspace</a>{role==='owner'&&<a href="#reports">Reports</a>}{role==='driver'&&<a href="#turn-ins">Turn In Day</a>}</div></div><img src="/images/capital-city-hero.png" alt={`${title} dashboard`}/></section>
    <section className="section ops-grid" id="ai-workspace">
      <div className="ops-main"><div className="ai-context-status"><span>{apiContext?'Role-safe live context':'Fallback context'}</span><p>{contextStatus}</p></div><LocalAIConcierge context={aiContext}/></div>
      <aside className="ops-side"><p className="eyebrow">Today</p><h2>{report.date||'Live Ops'}</h2><div className="metric-list"><span>Orders <b>{orders.length}</b></span><span>Routes <b>{routes.length}</b></span>{report.revenueScheduled&&<span>Scheduled <b>{money(report.revenueScheduled)}</b></span>}{report.revenue&&<span>Revenue <b>{money(report.revenue)}</b></span>}{report.hotLeads&&<span>Hot leads <b>{report.hotLeads}</b></span>}</div></aside>
    </section>
    <section className="section" id="routes"><p className="eyebrow">Routes</p><h2>Route command board.</h2><div className="route-list ops-cards">{routes.map((route:any)=><article key={route.id||route.name}><h3>{route.name}</h3><p>{route.day} - {route.window}</p><strong>{route.status} - {route.reserved}/{route.capacity} grouped</strong><div className="ops-meter"><i style={{width:`${route.fill||Math.round((route.reserved/Math.max(route.capacity,1))*100)}%`}}/></div><p>{route.priority||'Use ZIP and box details to confirm the next best step.'}</p>{(route.orders||[]).slice(0,3).map((order:any)=><small key={order.id}>{order.id}: {order.customer||order.customerName} - {order.box}</small>)}</article>)}</div></section>
    {role!=='customer'&&<section className="section" id="orders"><p className="eyebrow">Orders</p><h2>Chat-ready order memory.</h2><div className="ops-table"><table><thead><tr><th>Order</th><th>Customer</th><th>Route</th><th>Box</th><th>Status</th><th>Value</th></tr></thead><tbody>{orders.map((order:any)=><tr key={order.id}><td>{order.id}</td><td>{order.customer||order.customerName}</td><td>{order.routeId}</td><td>{order.box}</td><td>{order.status}</td><td>{money(order.value)}</td></tr>)}</tbody></table></div>{role==='owner'&&<button className="ops-button" onClick={downloadCsv}>Export Orders CSV</button>}</section>}
    {role==='driver'&&<section className="section" id="turn-ins"><p className="eyebrow">Driver Turn-In</p><h2>Close the route day cleanly.</h2><form onSubmit={submitTurnIn} className="turnin-form marble"><input value={turnIn.driver} onChange={e=>setTurnIn({...turnIn,driver:e.target.value})} placeholder="Driver"/><input value={turnIn.routeId} onChange={e=>setTurnIn({...turnIn,routeId:e.target.value})} placeholder="Route ID"/><input value={turnIn.completed} onChange={e=>setTurnIn({...turnIn,completed:e.target.value})} placeholder="Completed stops"/><input value={turnIn.missed} onChange={e=>setTurnIn({...turnIn,missed:e.target.value})} placeholder="Missed stops"/><input value={turnIn.rescheduled} onChange={e=>setTurnIn({...turnIn,rescheduled:e.target.value})} placeholder="Rescheduled"/><input value={turnIn.payments} onChange={e=>setTurnIn({...turnIn,payments:e.target.value})} placeholder="Payments"/><textarea value={turnIn.customerNotes} onChange={e=>setTurnIn({...turnIn,customerNotes:e.target.value})} placeholder="Customer notes"/><textarea value={turnIn.ownerFollowup} onChange={e=>setTurnIn({...turnIn,ownerFollowup:e.target.value})} placeholder="Owner follow-up"/><button type="submit">Submit Turn-In</button></form>{notice&&<p>{notice}</p>}</section>}
    {role==='owner'&&<section className="section" id="reports"><p className="eyebrow">Reports And Learning</p><h2>Owner intelligence loop.</h2><div className="route-list ops-cards"><article><h3>Daily Focus</h3>{(report.ownerFocus||report.ownerActions||[]).map((item:string)=><p key={item}>{item}</p>)}</article><article><h3>Route Risk</h3><p>{report.routeRisk||'Review live route efficiency and restock signals.'}</p></article><article><h3>Route Learnings</h3>{(liveMemory.routeLearningNotes||report.learningNotes||[]).slice(0,6).map((item:any)=><p key={typeof item==='string'?item:`${item.route}-${item.note}`}><strong>{item.route||'Learning'}:</strong> {item.note||item}</p>)}</article></div></section>}
    {turnIns.length>0&&<section className="section"><p className="eyebrow">Turn-Ins</p><h2>Delivery-day memory.</h2><div className="route-list ops-cards">{turnIns.map((turnIn:any)=><article key={turnIn.id}><h3>{turnIn.driver} - {turnIn.routeId}</h3><p>Completed {turnIn.completed}, missed {turnIn.missed}, rescheduled {turnIn.rescheduled}</p><p>{turnIn.customerNotes}</p><strong>{turnIn.ownerFollowup}</strong></article>)}</div></section>}
    <style>{`.ops-hero h1{font-size:clamp(2.5rem,6vw,5rem)}.ops-grid{display:grid;grid-template-columns:1fr 320px;gap:20px}.ops-side{border:1px solid rgba(255,200,87,.5);border-radius:22px;padding:20px;background:#080605;height:max-content}.ai-context-status{border:1px solid #b8892d66;border-radius:16px;padding:10px;margin-bottom:12px;background:#050403}.ai-context-status span{color:#d4af37;font-weight:900}.ai-context-status p{margin:4px 0 0!important;font-size:.9rem!important}.metric-list{display:grid;gap:10px}.metric-list span{display:flex;justify-content:space-between;border-bottom:1px solid #b8892d55;padding-bottom:8px;color:#ded2bd}.metric-list b{color:#f8e7b0}.ops-cards article small{display:block;color:#ded2bd;margin-top:8px}.ops-meter{height:9px;border:1px solid #b8892d66;border-radius:999px;background:#050403;overflow:hidden;margin:12px 0}.ops-meter i{display:block;height:100%;max-width:100%;border-radius:999px;background:linear-gradient(90deg,#facc15,#ef4444)}.ops-table{overflow:auto;border:1px solid #b8892d66;border-radius:18px}.ops-table table{width:100%;border-collapse:collapse;min-width:760px;background:#050403}.ops-table th,.ops-table td{border-bottom:1px solid #b8892d44;padding:12px;text-align:left}.ops-table th{color:#f8e7b0}.ops-button,.turnin-form button{margin-top:14px;border:1px solid #f8e7b0;background:linear-gradient(135deg,#facc15,#a16207);color:#160b04;border-radius:999px;padding:13px 16px;font-weight:900}.turnin-form{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.turnin-form input,.turnin-form textarea{min-width:0;border:1px solid #b8892d;background:#050403;color:#fff7ed;border-radius:18px;padding:12px;font:inherit}.turnin-form textarea{grid-column:span 3;min-height:92px}.turnin-form button{grid-column:1/-1}@media(max-width:900px){.ops-grid{grid-template-columns:1fr}.turnin-form{grid-template-columns:1fr}.turnin-form textarea{grid-column:auto}}`}</style>
  </main>
}
