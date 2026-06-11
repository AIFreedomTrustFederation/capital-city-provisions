'use client';

import {useEffect,useMemo,useState} from 'react';

type BoardRecord={
  id:string;
  audience:string;
  subject:string;
  body:string;
  status:string;
  priority:string;
  routeId?:string;
  orderId?:string;
  metadata?:Record<string,any>;
};

function lower(value:any){
  return String(value||'').toLowerCase();
}

function isDriverTask(record:BoardRecord){
  const text=lower(`${record.audience} ${record.subject} ${record.body} ${record.metadata?.reviewAction||''}`);
  return record.audience==='driver'||text.includes('driver task')||text.includes('driver-task');
}

export default function DriverRouteExecutionPanel(){
  const [records,setRecords]=useState<BoardRecord[]>([]);

  useEffect(()=>{
    let active=true;
    fetch('/api/internal-board',{credentials:'same-origin'})
      .then(response=>response.json())
      .then(result=>{if(active)setRecords(result?.records||[])})
      .catch(()=>{if(active)setRecords([])});
    return()=>{active=false};
  },[]);

  const routes=useMemo(()=>{
    const driverTasks=records.filter(isDriverTask);
    const routeMap=new Map<string,BoardRecord[]>();
    driverTasks.forEach(task=>{
      const route=task.routeId||'unassigned-route';
      routeMap.set(route,[...(routeMap.get(route)||[]),task]);
    });
    return [...routeMap.entries()].map(([routeId,tasks])=>({
      routeId,
      tasks,
      open:tasks.filter(task=>task.status!=='closed').length,
      completed:tasks.filter(task=>task.status==='closed').length,
      urgent:tasks.filter(task=>task.priority==='urgent'||task.priority==='high').length,
      blocked:tasks.filter(task=>lower(`${task.subject} ${task.body} ${task.metadata?.driverAction||''}`).includes('blocked')).length,
    }));
  },[records]);

  return (
    <section className="section driver-route-execution" id="driver-route-execution">
      <p className="eyebrow">Driver Route Execution</p>
      <h2>Route work, open tasks, blockers, and closeout status.</h2>

      <div className="driver-route-grid">
        {routes.length?routes.map(route=>(
          <article key={route.routeId}>
            <small>{route.routeId}</small>
            <h3>{route.open} open task(s)</h3>
            <div>
              <span>Completed <b>{route.completed}</b></span>
              <span>Urgent <b>{route.urgent}</b></span>
              <span>Blocked <b>{route.blocked}</b></span>
              <span>Total Tasks <b>{route.tasks.length}</b></span>
            </div>
          </article>
        )):(
          <article>
            <small>Ready</small>
            <h3>No route tasks yet.</h3>
            <p>Owner-created driver tasks will group here by route.</p>
          </article>
        )}
      </div>

      <style>{`
        .driver-route-execution{border:1px solid rgba(248,231,176,.22);border-radius:28px;background:linear-gradient(135deg,#070504,#020202);padding:18px}
        .driver-route-execution h2{color:#f8e7b0;margin:.25rem 0}
        .driver-route-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin-top:14px}
        .driver-route-grid article{border:1px solid rgba(248,231,176,.16);border-radius:20px;background:#050403;padding:14px}
        .driver-route-grid small{color:#d4af37;font-weight:900}
        .driver-route-grid h3{color:#fff7ed}
        .driver-route-grid p{color:#ded2bd}
        .driver-route-grid div{display:grid;gap:7px}
        .driver-route-grid span{display:flex;justify-content:space-between;color:#ded2bd;border-bottom:1px solid rgba(212,175,55,.18);padding-bottom:6px}
        .driver-route-grid b{color:#f8e7b0}
      `}</style>
    </section>
  );
}
