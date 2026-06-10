'use client';
import {useMemo,useState} from 'react';

type Props={memory:Record<string,any>};
type StopState={status:string;fulfillment:string;note:string;issue:string;ownerFollowup:string};
type CopilotAction='next'|'route'|'customerText'|'issue'|'turnIn';

const statusOptions=['loaded','out-for-delivery','delivered','issue'];
const fulfillmentOptions=['packed','fulfilled','partial','restock-blocked','substituted'];

function makeStops(memory:Record<string,any>){return (memory.routes||[]).flatMap((route:any)=>(route.orders||[]).map((order:any)=>({...order,routeName:route.name,routeId:route.id,day:route.day,window:route.window,priority:route.priority,driver:route.driver||memory.driver||'Driver'})))}
function stopQuery(stop:any){return encodeURIComponent([stop.address,stop.customer,stop.zip,stop.routeName,'Sacramento CA'].filter(Boolean).join(' '))}
function navigateUrl(stop:any){return `https://www.google.com/maps/search/?api=1&query=${stopQuery(stop)}`}
function routeUrl(stops:any[]){const origin='Capital City Provisions Sacramento CA';const destination=stops[stops.length-1]||stops[0];const waypoints=stops.slice(0,-1).map(stop=>[stop.address,stop.customer,stop.zip].filter(Boolean).join(' ')).filter(Boolean).join('|');const params=new URLSearchParams({api:'1',origin,destination:[destination?.address,destination?.customer,destination?.zip].filter(Boolean).join(' ')||origin,travelmode:'driving'});if(waypoints)params.set('waypoints',waypoints);return `https://www.google.com/maps/dir/?${params.toString()}`}
function money(value:number){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value||0)}
function stopValue(stop:any){return typeof stop.value==='number'?stop.value:0}
function localCopilot(action:CopilotAction,stops:any[],states:Record<string,StopState>,activeStop:any,turnIn:Record<string,string>){
  const openStops=stops.filter((stop:any)=>states[stop.id]?.status!=='delivered');
  const issueStops=stops.filter((stop:any)=>states[stop.id]?.status==='issue'||states[stop.id]?.fulfillment==='partial'||states[stop.id]?.fulfillment==='restock-blocked'||states[stop.id]?.issue);
  const nextStop=openStops.find((stop:any)=>states[stop.id]?.status==='out-for-delivery')||openStops.sort((a:any,b:any)=>stopValue(b)-stopValue(a))[0]||activeStop;
  if(action==='next')return nextStop?`Next best move: work ${nextStop.id} for ${nextStop.customer}. Box: ${nextStop.box}. ${nextStop.notes||'Confirm delivery details before arrival.'}`:'No live stops are open. Start the turn-in only after real orders are assigned.';
  if(action==='route')return `Today has ${stops.length} live stop(s), ${openStops.length} still open, and ${issueStops.length} needing attention.`;
  if(action==='customerText')return activeStop?`Text draft: Hi, this is Capital City Provisions. Your ${activeStop.box} is on today's ${activeStop.routeName}. We are heading your way in the ${activeStop.window} window. Reply here with any gate, parking, or drop-off note.`:'Pick a live stop first and I will draft the customer text.';
  if(action==='issue')return issueStops.length?`Issue summary: ${issueStops.map((stop:any)=>`${stop.id} ${stop.customer}: ${states[stop.id]?.fulfillment}; ${states[stop.id]?.issue||'needs review'}`).join(' | ')}`:'No active issue stops yet.';
  return `Turn-in prep: delivered ${Object.values(states).filter(state=>state.status==='delivered').length}/${stops.length}, missed ${turnIn.missed||'0'}, rescheduled ${turnIn.rescheduled||'0'}, miles ${turnIn.milesDriven||'not entered'}.`;
}

export default function DriverMobileWorkflow({memory}:Props){
  const stops=useMemo(()=>makeStops(memory),[memory]);
  const [active,setActive]=useState(stops[0]?.id||'');
  const [states,setStates]=useState<Record<string,StopState>>(()=>Object.fromEntries(stops.map((stop:any)=>[stop.id,{status:stop.status||'loaded',fulfillment:'packed',note:stop.notes||'',issue:'',ownerFollowup:''}])));
  const [turnIn,setTurnIn]=useState({fuelStart:'',fuelEnd:'',milesDriven:'',payments:'',missed:'0',rescheduled:'0',ownerFollowup:''});
  const [notice,setNotice]=useState('');
  const [copilot,setCopilot]=useState({question:'',answer:'',loading:false});
  const activeStop=stops.find((stop:any)=>stop.id===active)||stops[0];
  const completed=Object.values(states).filter(state=>state.status==='delivered').length;
  const issues=Object.values(states).filter(state=>state.status==='issue'||state.fulfillment==='partial'||state.fulfillment==='restock-blocked'||state.issue).length;
  const routeMapUrl=routeUrl(stops);
  const routeValue=stops.reduce((sum:number,stop:any)=>sum+stopValue(stop),0);
  const openStops=stops.filter((stop:any)=>states[stop.id]?.status!=='delivered').length;
  const nextSuggestion=localCopilot('next',stops,states,activeStop,turnIn);

  function updateStop(orderId:string,patch:Partial<StopState>){setStates(current=>({...current,[orderId]:{...(current[orderId]||{status:'loaded',fulfillment:'packed',note:'',issue:'',ownerFollowup:''}),...patch}}))}
  async function sendUpdate(stop:any){
    const state=states[stop.id];
    setNotice(`Saving ${stop.id}...`);
    try{
      const response=await fetch('/api/db/driver-update',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderId:stop.id,routeId:stop.routeId,driver:memory.driver||stop.driver||'Driver',status:state.status,fulfillment:state.fulfillment,customerNotes:`${state.note} ${state.ownerFollowup?`Owner follow-up: ${state.ownerFollowup}`:''}`.trim(),restockIssue:state.issue,milesDriven:turnIn.milesDriven,fuelStart:turnIn.fuelStart,fuelEnd:turnIn.fuelEnd})});
      const result=await response.json();
      setNotice(result.ok?`${stop.id} saved to live ops. Efficiency: ${result.update?.routeEfficiency||'pending'}.`:'Update did not save. Keep the local notes and retry.');
    }catch(error){setNotice('Saved on this device only. Connection to live ops intake did not respond.');}
  }
  async function submitTurnIn(){
    const routeIds=[...new Set(stops.map((stop:any)=>stop.routeId))].join(', ');
    const payload={driver:memory.driver||'Driver',routeId:routeIds,completed:String(completed),missed:turnIn.missed,rescheduled:turnIn.rescheduled,payments:turnIn.payments,customerNotes:Object.entries(states).map(([id,state])=>`${id}: ${state.status}, ${state.fulfillment}. ${state.note} ${state.issue} ${state.ownerFollowup}`.trim()).join('\n'),ownerFollowup:turnIn.ownerFollowup,fuelStart:turnIn.fuelStart,fuelEnd:turnIn.fuelEnd,milesDriven:turnIn.milesDriven};
    setNotice('Submitting turn-in...');
    try{const response=await fetch('/api/ops/turn-ins',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const result=await response.json();setNotice(result.ok?'Turn-in submitted to live ops intake.':'Turn-in saved locally but ops intake did not confirm.')}catch(error){setNotice('Turn-in saved locally. Ops intake did not respond.');}
  }
  async function askCopilot(action:CopilotAction,question?:string){
    const prompt=question||localCopilot(action,stops,states,activeStop,turnIn);
    setCopilot({question:prompt,answer:localCopilot(action,stops,states,activeStop,turnIn),loading:true});
    try{
      const response=await fetch('/api/ai/route-concierge',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({role:'driver',intent:action,question:prompt,activeStop,stops,stopStates:states,turnIn,driver:memory.driver||'Driver'})});
      const result=await response.json();
      const rec=result?.recommendation;
      const answer=rec?.driverAnswer||rec?.summary||rec?.ownerNote||rec?.raw||localCopilot(action,stops,states,activeStop,turnIn);
      setCopilot({question:prompt,answer:typeof answer==='string'?answer:JSON.stringify(answer),loading:false});
    }catch(error){setCopilot({question:prompt,answer:localCopilot(action,stops,states,activeStop,turnIn),loading:false});}
  }

  return <section className="section driver-mobile-workflow" id="mobile-route">
    <div className="driver-topline"><div><p className="eyebrow">Driver Mobile</p><h2>Work the live route from your phone.</h2></div><div className="driver-score"><span>{completed}/{stops.length}</span><small>delivered</small></div><div className="driver-score warn"><span>{issues}</span><small>issues</small></div></div>
    <div className="route-map-hero"><div><p className="eyebrow">Route Map</p><h3>Open the full route in Google Maps.</h3><p>{stops.length?'Uses live addresses when available, then falls back to customer, ZIP, and route area.':'No live stops assigned yet.'}</p></div>{stops.length?<a href={routeMapUrl} target="_blank" rel="noreferrer">Open Route Map</a>:<span>No route map yet</span>}</div>
    <div className="driver-ai-cockpit"><div className="ai-cockpit-main"><p className="eyebrow">Driver AI Co-Pilot</p><h3>{copilot.loading?'Thinking through the route...':'Best next move'}</h3><p>{copilot.answer||nextSuggestion}</p><form onSubmit={e=>{e.preventDefault();askCopilot('route',copilot.question)}} className="ai-ask-row"><input value={copilot.question} onChange={e=>setCopilot({...copilot,question:e.target.value})} placeholder="Ask about this live route, a stop, a note, or turn-in..." /><button type="submit">Ask</button></form></div><div className="ai-chip-grid"><button onClick={()=>askCopilot('next')}>Next Stop</button><button onClick={()=>askCopilot('route')}>Route Summary</button><button onClick={()=>askCopilot('customerText')}>Draft Text</button><button onClick={()=>askCopilot('issue')}>Issue Review</button><button onClick={()=>askCopilot('turnIn')}>Turn-In Prep</button></div><div className="ai-route-stats"><span><b>{openStops}</b> open</span><span><b>{money(routeValue)}</b> scheduled</span><span><b>{memory.driver||'Driver'}</b> assigned</span></div></div>
    <div className="stop-strip" aria-label="Stops">{stops.map((stop:any)=><button key={stop.id} onClick={()=>setActive(stop.id)} className={active===stop.id?'active':''}><span>{stop.id}</span><small>{states[stop.id]?.status||stop.status}</small></button>)}</div>
    {activeStop?<article className="driver-stop-card marble"><div className="stop-card-head"><div><p className="eyebrow">{activeStop.routeName} - {activeStop.window}</p><h3>{activeStop.customer}</h3><p>{activeStop.box}</p></div><a href={navigateUrl(activeStop)} target="_blank" rel="noreferrer">Navigate</a></div><p>{activeStop.notes}</p><div className="status-buttons">{statusOptions.map(status=><button key={status} onClick={()=>updateStop(activeStop.id,{status})} className={states[activeStop.id]?.status===status?'active':''}>{status.replace(/-/g,' ')}</button>)}</div><div className="status-buttons fulfillment">{fulfillmentOptions.map(fulfillment=><button key={fulfillment} onClick={()=>updateStop(activeStop.id,{fulfillment})} className={states[activeStop.id]?.fulfillment===fulfillment?'active':''}>{fulfillment.replace(/-/g,' ')}</button>)}</div><textarea value={states[activeStop.id]?.note||''} onChange={e=>updateStop(activeStop.id,{note:e.target.value})} placeholder="Customer note, delivery detail, call-ahead result..."/><input value={states[activeStop.id]?.issue||''} onChange={e=>updateStop(activeStop.id,{issue:e.target.value})} placeholder="Restock issue or substitution"/><textarea value={states[activeStop.id]?.ownerFollowup||''} onChange={e=>updateStop(activeStop.id,{ownerFollowup:e.target.value})} placeholder="Owner follow-up for this stop"/><button className="primary-driver" onClick={()=>sendUpdate(activeStop)}>Save Stop Update</button></article>:<article className="marble"><h3>No live route stops yet.</h3><p>Real customer stops will appear after live orders are created and scheduled.</p></article>}
    <div className="turnin-panel marble" id="turn-in-mobile"><p className="eyebrow">End Of Day</p><h3>Turn in the route.</h3><div className="turnin-grid"><input value={turnIn.fuelStart} onChange={e=>setTurnIn({...turnIn,fuelStart:e.target.value})} placeholder="Fuel start"/><input value={turnIn.fuelEnd} onChange={e=>setTurnIn({...turnIn,fuelEnd:e.target.value})} placeholder="Fuel end"/><input value={turnIn.milesDriven} onChange={e=>setTurnIn({...turnIn,milesDriven:e.target.value})} placeholder="Miles"/><input value={turnIn.missed} onChange={e=>setTurnIn({...turnIn,missed:e.target.value})} placeholder="Missed"/><input value={turnIn.rescheduled} onChange={e=>setTurnIn({...turnIn,rescheduled:e.target.value})} placeholder="Rescheduled"/><input value={turnIn.payments} onChange={e=>setTurnIn({...turnIn,payments:e.target.value})} placeholder="Payments"/></div><textarea value={turnIn.ownerFollowup} onChange={e=>setTurnIn({...turnIn,ownerFollowup:e.target.value})} placeholder="Owner follow-up"/><button className="primary-driver" onClick={submitTurnIn} disabled={!stops.length}>Submit Turn-In</button>{notice&&<p>{notice}</p>}</div>
  </section>
}
