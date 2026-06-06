'use client';
import {useMemo,useState} from 'react';

type Props={memory:Record<string,any>};
type StopState={status:string;fulfillment:string;note:string;issue:string};

const statusOptions=['loaded','out-for-delivery','delivered','issue'];
const fulfillmentOptions=['packed','fulfilled','partial','restock-blocked','substituted'];

function makeStops(memory:Record<string,any>){return (memory.routes||[]).flatMap((route:any)=>(route.orders||[]).map((order:any)=>({...order,routeName:route.name,routeId:route.id,day:route.day,window:route.window,priority:route.priority,driver:route.driver||memory.driver||'Driver'})))}

export default function DriverMobileWorkflow({memory}:Props){
  const stops=useMemo(()=>makeStops(memory),[memory]);
  const [active,setActive]=useState(stops[0]?.id||'');
  const [states,setStates]=useState<Record<string,StopState>>(()=>Object.fromEntries(stops.map((stop:any)=>[stop.id,{status:stop.status||'loaded',fulfillment:'packed',note:stop.notes||'',issue:''}])));
  const [turnIn,setTurnIn]=useState({fuelStart:'',fuelEnd:'',milesDriven:'',payments:'',missed:'0',rescheduled:'0',ownerFollowup:''});
  const [notice,setNotice]=useState('');
  const activeStop=stops.find((stop:any)=>stop.id===active)||stops[0];
  const completed=Object.values(states).filter(state=>state.status==='delivered').length;
  const issues=Object.values(states).filter(state=>state.status==='issue'||state.fulfillment==='partial'||state.fulfillment==='restock-blocked').length;

  function updateStop(orderId:string,patch:Partial<StopState>){setStates(current=>({...current,[orderId]:{...(current[orderId]||{status:'loaded',fulfillment:'packed',note:'',issue:''}),...patch}}))}
  async function sendUpdate(stop:any){
    const state=states[stop.id];
    setNotice(`Saving ${stop.id}...`);
    try{
      const response=await fetch('/api/db/driver-update?sample=1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderId:stop.id,routeId:stop.routeId,driver:memory.driver||stop.driver||'Driver',status:state.status,fulfillment:state.fulfillment,customerNotes:state.note,restockIssue:state.issue,milesDriven:turnIn.milesDriven,fuelStart:turnIn.fuelStart,fuelEnd:turnIn.fuelEnd})});
      const result=await response.json();
      setNotice(result.ok?`${stop.id} saved. Efficiency: ${result.update?.routeEfficiency||'pending'}.`:'Update did not save. Keep the local notes and retry.');
    }catch(error){setNotice('Saved on this device only. Connection to ops intake did not respond.');}
  }
  async function submitTurnIn(){
    const routeIds=[...new Set(stops.map((stop:any)=>stop.routeId))].join(', ');
    const payload={driver:memory.driver||'Driver',routeId:routeIds,completed:String(completed),missed:turnIn.missed,rescheduled:turnIn.rescheduled,payments:turnIn.payments,customerNotes:Object.entries(states).map(([id,state])=>`${id}: ${state.status}, ${state.fulfillment}. ${state.note} ${state.issue}`.trim()).join('\n'),ownerFollowup:turnIn.ownerFollowup,fuelStart:turnIn.fuelStart,fuelEnd:turnIn.fuelEnd,milesDriven:turnIn.milesDriven};
    setNotice('Submitting turn-in...');
    try{const response=await fetch('/api/ops/turn-ins',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const result=await response.json();setNotice(result.ok?'Turn-in submitted to ops intake.':'Turn-in saved locally but ops intake did not confirm.')}catch(error){setNotice('Turn-in saved locally. Ops intake did not respond.');}
  }

  return <section className="section driver-mobile-workflow" id="mobile-route">
    <div className="driver-topline"><div><p className="eyebrow">Driver Mobile</p><h2>Work the route from your phone.</h2></div><div className="driver-score"><span>{completed}/{stops.length}</span><small>delivered</small></div><div className="driver-score warn"><span>{issues}</span><small>issues</small></div></div>
    <div className="stop-strip" aria-label="Stops">{stops.map((stop:any)=><button key={stop.id} onClick={()=>setActive(stop.id)} className={active===stop.id?'active':''}><span>{stop.id}</span><small>{states[stop.id]?.status||stop.status}</small></button>)}</div>
    {activeStop&&<article className="driver-stop-card marble">
      <p className="eyebrow">{activeStop.routeName} - {activeStop.window}</p><h3>{activeStop.customer}</h3><p>{activeStop.box}</p><p>{activeStop.notes}</p><div className="status-buttons">{statusOptions.map(status=><button key={status} onClick={()=>updateStop(activeStop.id,{status})} className={states[activeStop.id]?.status===status?'active':''}>{status.replace(/-/g,' ')}</button>)}</div><div className="status-buttons fulfillment">{fulfillmentOptions.map(fulfillment=><button key={fulfillment} onClick={()=>updateStop(activeStop.id,{fulfillment})} className={states[activeStop.id]?.fulfillment===fulfillment?'active':''}>{fulfillment.replace(/-/g,' ')}</button>)}</div><textarea value={states[activeStop.id]?.note||''} onChange={e=>updateStop(activeStop.id,{note:e.target.value})} placeholder="Customer note, delivery detail, call-ahead result..."/><input value={states[activeStop.id]?.issue||''} onChange={e=>updateStop(activeStop.id,{issue:e.target.value})} placeholder="Restock issue or substitution"/><button className="primary-driver" onClick={()=>sendUpdate(activeStop)}>Save Stop Update</button></article>}
    <div className="turnin-panel marble" id="turn-in-mobile"><p className="eyebrow">End Of Day</p><h3>Turn in the route.</h3><div className="turnin-grid"><input value={turnIn.fuelStart} onChange={e=>setTurnIn({...turnIn,fuelStart:e.target.value})} placeholder="Fuel start"/><input value={turnIn.fuelEnd} onChange={e=>setTurnIn({...turnIn,fuelEnd:e.target.value})} placeholder="Fuel end"/><input value={turnIn.milesDriven} onChange={e=>setTurnIn({...turnIn,milesDriven:e.target.value})} placeholder="Miles"/><input value={turnIn.missed} onChange={e=>setTurnIn({...turnIn,missed:e.target.value})} placeholder="Missed"/><input value={turnIn.rescheduled} onChange={e=>setTurnIn({...turnIn,rescheduled:e.target.value})} placeholder="Rescheduled"/><input value={turnIn.payments} onChange={e=>setTurnIn({...turnIn,payments:e.target.value})} placeholder="Payments"/></div><textarea value={turnIn.ownerFollowup} onChange={e=>setTurnIn({...turnIn,ownerFollowup:e.target.value})} placeholder="Owner follow-up before tomorrow"/><button className="primary-driver" onClick={submitTurnIn}>Submit Turn-In</button>{notice&&<p className="driver-notice">{notice}</p>}</div>
    <style>{`.driver-mobile-workflow{display:grid;gap:18px}.driver-topline{display:grid;grid-template-columns:1fr auto auto;gap:12px;align-items:end}.driver-topline h2{margin:0}.driver-score{border:1px solid #b8892d66;border-radius:16px;padding:10px 12px;background:#080605;text-align:center}.driver-score span{display:block;color:#f8e7b0;font-size:1.35rem;font-weight:900}.driver-score small{color:#ded2bd;font-weight:800}.driver-score.warn span{color:#fca5a5}.stop-strip{display:flex;gap:10px;overflow:auto;padding-bottom:6px;scroll-snap-type:x mandatory}.stop-strip button{scroll-snap-align:start;min-width:138px;border:1px solid #b8892d66;background:#080605;color:#f8e7b0;border-radius:18px;padding:12px;text-align:left;font-weight:900}.stop-strip button.active{background:linear-gradient(135deg,#facc15,#a16207);color:#160b04}.stop-strip small{display:block;margin-top:4px;color:inherit;opacity:.82}.driver-stop-card,.turnin-panel{display:grid;gap:12px}.driver-stop-card h3,.turnin-panel h3{margin:0;color:#f8e7b0}.status-buttons{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.status-buttons.fulfillment{grid-template-columns:repeat(5,1fr)}.status-buttons button,.primary-driver{border:1px solid #d4af37;background:#080605;color:#f8e7b0;border-radius:999px;padding:10px;font-weight:900;text-transform:capitalize}.status-buttons button.active,.primary-driver{background:linear-gradient(135deg,#facc15,#a16207);color:#160b04;border-color:#f8e7b0}.driver-stop-card textarea,.driver-stop-card input,.turnin-panel textarea,.turnin-grid input{min-width:0;border:1px solid #b8892d;background:#050403;color:#fff7ed;border-radius:16px;padding:12px;font:inherit}.driver-stop-card textarea,.turnin-panel textarea{min-height:86px}.turnin-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.driver-notice{color:#f8e7b0!important;font-weight:900}@media(max-width:760px){.driver-topline{grid-template-columns:1fr 86px 76px;align-items:stretch}.driver-score{padding:8px}.status-buttons,.status-buttons.fulfillment,.turnin-grid{grid-template-columns:1fr 1fr}.status-buttons button{min-height:44px}.driver-stop-card,.turnin-panel{border-radius:18px;padding:16px}}`}</style>
  </section>
}
