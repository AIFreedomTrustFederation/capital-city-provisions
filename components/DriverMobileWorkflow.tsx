'use client';
import {useMemo,useState} from 'react';

type Props={memory:Record<string,any>};
type StopState={status:string;fulfillment:string;note:string;issue:string;ownerFollowup:string};
type NoteTarget='note'|'issue'|'ownerFollowup';

const statusOptions=['loaded','out-for-delivery','delivered','issue'];
const fulfillmentOptions=['packed','fulfilled','partial','restock-blocked','substituted'];

function makeStops(memory:Record<string,any>){return (memory.routes||[]).flatMap((route:any)=>(route.orders||[]).map((order:any)=>({...order,routeName:route.name,routeId:route.id,day:route.day,window:route.window,priority:route.priority,driver:route.driver||memory.driver||'Driver'})))}
function stopQuery(stop:any){return encodeURIComponent([stop.address,stop.customer,stop.zip,stop.routeName,'Sacramento CA'].filter(Boolean).join(' '))}
function navigateUrl(stop:any){return `https://www.google.com/maps/search/?api=1&query=${stopQuery(stop)}`}
function routeUrl(stops:any[]){const origin='Capital City Provisions Sacramento CA';const destination=stops[stops.length-1]||stops[0];const waypoints=stops.slice(0,-1).map(stop=>[stop.address,stop.customer,stop.zip].filter(Boolean).join(' ')).filter(Boolean).join('|');const params=new URLSearchParams({api:'1',origin,destination:[destination?.address,destination?.customer,destination?.zip].filter(Boolean).join(' ')||origin,travelmode:'driving'});if(waypoints)params.set('waypoints',waypoints);return `https://www.google.com/maps/dir/?${params.toString()}`}
function getSpeechRecognition(){if(typeof window==='undefined')return null;return (window as any).SpeechRecognition||(window as any).webkitSpeechRecognition||null}

export default function DriverMobileWorkflow({memory}:Props){
  const stops=useMemo(()=>makeStops(memory),[memory]);
  const [active,setActive]=useState(stops[0]?.id||'');
  const [states,setStates]=useState<Record<string,StopState>>(()=>Object.fromEntries(stops.map((stop:any)=>[stop.id,{status:stop.status||'loaded',fulfillment:'packed',note:stop.notes||'',issue:'',ownerFollowup:''}])));
  const [turnIn,setTurnIn]=useState({fuelStart:'',fuelEnd:'',milesDriven:'',payments:'',missed:'0',rescheduled:'0',ownerFollowup:''});
  const [notice,setNotice]=useState('');
  const [listening,setListening]=useState<NoteTarget|null>(null);
  const activeStop=stops.find((stop:any)=>stop.id===active)||stops[0];
  const completed=Object.values(states).filter(state=>state.status==='delivered').length;
  const issues=Object.values(states).filter(state=>state.status==='issue'||state.fulfillment==='partial'||state.fulfillment==='restock-blocked'||state.issue).length;
  const routeMapUrl=routeUrl(stops);

  function updateStop(orderId:string,patch:Partial<StopState>){setStates(current=>({...current,[orderId]:{...(current[orderId]||{status:'loaded',fulfillment:'packed',note:'',issue:'',ownerFollowup:''}),...patch}}))}
  function appendToActive(target:NoteTarget,text:string){if(!activeStop)return;const current=states[activeStop.id]||{status:'loaded',fulfillment:'packed',note:'',issue:'',ownerFollowup:''};updateStop(activeStop.id,{[target]:`${current[target]||''}${current[target]?' ':''}${text}`.trim()} as Partial<StopState>)}
  function startVoice(target:NoteTarget){
    const Recognition=getSpeechRecognition();
    if(!Recognition){setNotice('Voice notes are not supported in this browser. Use the note fields instead.');return}
    const recognition=new Recognition();
    recognition.lang='en-US';recognition.interimResults=false;recognition.maxAlternatives=1;setListening(target);setNotice('Listening... speak the driver note.');
    recognition.onresult=(event:any)=>{const text=event.results?.[0]?.[0]?.transcript||'';if(text){appendToActive(target,text);setNotice(`Voice note added to ${target==='note'?'customer note':target==='issue'?'restock issue':'owner follow-up'}.`)}}
    recognition.onerror=()=>setNotice('Voice note stopped. Try again or type the note.');
    recognition.onend=()=>setListening(null);
    recognition.start();
  }
  async function sendUpdate(stop:any){
    const state=states[stop.id];
    setNotice(`Saving ${stop.id}...`);
    try{
      const response=await fetch('/api/db/driver-update?sample=1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderId:stop.id,routeId:stop.routeId,driver:memory.driver||stop.driver||'Driver',status:state.status,fulfillment:state.fulfillment,customerNotes:`${state.note} ${state.ownerFollowup?`Owner follow-up: ${state.ownerFollowup}`:''}`.trim(),restockIssue:state.issue,milesDriven:turnIn.milesDriven,fuelStart:turnIn.fuelStart,fuelEnd:turnIn.fuelEnd})});
      const result=await response.json();
      setNotice(result.ok?`${stop.id} saved. Efficiency: ${result.update?.routeEfficiency||'pending'}.`:'Update did not save. Keep the local notes and retry.');
    }catch(error){setNotice('Saved on this device only. Connection to ops intake did not respond.');}
  }
  async function submitTurnIn(){
    const routeIds=[...new Set(stops.map((stop:any)=>stop.routeId))].join(', ');
    const payload={driver:memory.driver||'Driver',routeId:routeIds,completed:String(completed),missed:turnIn.missed,rescheduled:turnIn.rescheduled,payments:turnIn.payments,customerNotes:Object.entries(states).map(([id,state])=>`${id}: ${state.status}, ${state.fulfillment}. ${state.note} ${state.issue} ${state.ownerFollowup}`.trim()).join('\n'),ownerFollowup:turnIn.ownerFollowup,fuelStart:turnIn.fuelStart,fuelEnd:turnIn.fuelEnd,milesDriven:turnIn.milesDriven};
    setNotice('Submitting turn-in...');
    try{const response=await fetch('/api/ops/turn-ins',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const result=await response.json();setNotice(result.ok?'Turn-in submitted to ops intake.':'Turn-in saved locally but ops intake did not confirm.')}catch(error){setNotice('Turn-in saved locally. Ops intake did not respond.');}
  }

  return <section className="section driver-mobile-workflow" id="mobile-route">
    <div className="driver-topline"><div><p className="eyebrow">Driver Mobile</p><h2>Work the route from your phone.</h2></div><div className="driver-score"><span>{completed}/{stops.length}</span><small>delivered</small></div><div className="driver-score warn"><span>{issues}</span><small>issues</small></div></div>
    <div className="route-map-hero"><div><p className="eyebrow">Route Map</p><h3>Open the full route in Google Maps.</h3><p>Uses full addresses when available, then falls back to customer, ZIP, and route area.</p></div><a href={routeMapUrl} target="_blank" rel="noreferrer">Open Route Map</a></div>
    <div className="stop-strip" aria-label="Stops">{stops.map((stop:any)=><button key={stop.id} onClick={()=>setActive(stop.id)} className={active===stop.id?'active':''}><span>{stop.id}</span><small>{states[stop.id]?.status||stop.status}</small></button>)}</div>
    {activeStop&&<article className="driver-stop-card marble">
      <div className="stop-card-head"><div><p className="eyebrow">{activeStop.routeName} - {activeStop.window}</p><h3>{activeStop.customer}</h3><p>{activeStop.box}</p></div><a href={navigateUrl(activeStop)} target="_blank" rel="noreferrer">Navigate</a></div>
      <p>{activeStop.notes}</p><div className="status-buttons">{statusOptions.map(status=><button key={status} onClick={()=>updateStop(activeStop.id,{status})} className={states[activeStop.id]?.status===status?'active':''}>{status.replace(/-/g,' ')}</button>)}</div><div className="status-buttons fulfillment">{fulfillmentOptions.map(fulfillment=><button key={fulfillment} onClick={()=>updateStop(activeStop.id,{fulfillment})} className={states[activeStop.id]?.fulfillment===fulfillment?'active':''}>{fulfillment.replace(/-/g,' ')}</button>)}</div>
      <div className="voice-row"><button onClick={()=>startVoice('note')} className={listening==='note'?'listening':''}>Voice Customer Note</button><button onClick={()=>startVoice('issue')} className={listening==='issue'?'listening':''}>Voice Issue</button><button onClick={()=>startVoice('ownerFollowup')} className={listening==='ownerFollowup'?'listening':''}>Voice Owner Follow-Up</button></div>
      <textarea value={states[activeStop.id]?.note||''} onChange={e=>updateStop(activeStop.id,{note:e.target.value})} placeholder="Customer note, delivery detail, call-ahead result..."/><input value={states[activeStop.id]?.issue||''} onChange={e=>updateStop(activeStop.id,{issue:e.target.value})} placeholder="Restock issue or substitution"/><textarea value={states[activeStop.id]?.ownerFollowup||''} onChange={e=>updateStop(activeStop.id,{ownerFollowup:e.target.value})} placeholder="Owner follow-up for this stop"/><button className="primary-driver" onClick={()=>sendUpdate(activeStop)}>Save Stop Update</button></article>}
    <div className="turnin-panel marble" id="turn-in-mobile"><p className="eyebrow">End Of Day</p><h3>Turn in the route.</h3><div className="turnin-grid"><input value={turnIn.fuelStart} onChange={e=>setTurnIn({...turnIn,fuelStart:e.target.value})} placeholder="Fuel start"/><input value={turnIn.fuelEnd} onChange={e=>setTurnIn({...turnIn,fuelEnd:e.target.value})} placeholder="Fuel end"/><input value={turnIn.milesDriven} onChange={e=>setTurnIn({...turnIn,milesDriven:e.target.value})} placeholder="Miles"/><input value={turnIn.missed} onChange={e=>setTurnIn({...turnIn,missed:e.target.value})} placeholder="Missed"/><input value={turnIn.rescheduled} onChange={e=>setTurnIn({...turnIn,rescheduled:e.target.value})} placeholder="Rescheduled"/><input value={turnIn.payments} onChange={e=>setTurnIn({...turnIn,payments:e.target.value})} placeholder="Payments"/></div><textarea value={turnIn.ownerFollowup} onChange={e=>setTurnIn({...turnIn,ownerFollowup:e.target.value})} placeholder="Owner follow-up before tomorrow"/><button className="primary-driver" onClick={submitTurnIn}>Submit Turn-In</button>{notice&&<p className="driver-notice">{notice}</p>}</div>
    <style>{`.driver-mobile-workflow{display:grid;gap:18px}.driver-topline{display:grid;grid-template-columns:1fr auto auto;gap:12px;align-items:end}.driver-topline h2{margin:0}.driver-score{border:1px solid #b8892d66;border-radius:16px;padding:10px 12px;background:#080605;text-align:center}.driver-score span{display:block;color:#f8e7b0;font-size:1.35rem;font-weight:900}.driver-score small{color:#ded2bd;font-weight:800}.driver-score.warn span{color:#fca5a5}.route-map-hero{display:grid;grid-template-columns:1fr auto;gap:16px;align-items:center;border:1px solid #d4af37;border-radius:20px;background:linear-gradient(135deg,#100904,#2a1606);padding:18px}.route-map-hero h3{margin:0;color:#f8e7b0}.route-map-hero a,.stop-card-head a{border:1px solid #f8e7b0;background:linear-gradient(135deg,#facc15,#a16207);color:#160b04;border-radius:999px;padding:13px 16px;font-weight:900;text-decoration:none;text-align:center}.stop-strip{display:flex;gap:10px;overflow:auto;padding-bottom:6px;scroll-snap-type:x mandatory}.stop-strip button{scroll-snap-align:start;min-width:138px;border:1px solid #b8892d66;background:#080605;color:#f8e7b0;border-radius:18px;padding:12px;text-align:left;font-weight:900}.stop-strip button.active{background:linear-gradient(135deg,#facc15,#a16207);color:#160b04}.stop-strip small{display:block;margin-top:4px;color:inherit;opacity:.82}.driver-stop-card,.turnin-panel{display:grid;gap:12px}.stop-card-head{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:start}.driver-stop-card h3,.turnin-panel h3{margin:0;color:#f8e7b0}.status-buttons{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.status-buttons.fulfillment{grid-template-columns:repeat(5,1fr)}.status-buttons button,.primary-driver,.voice-row button{border:1px solid #d4af37;background:#080605;color:#f8e7b0;border-radius:999px;padding:10px;font-weight:900;text-transform:capitalize}.status-buttons button.active,.primary-driver,.voice-row button.listening{background:linear-gradient(135deg,#facc15,#a16207);color:#160b04;border-color:#f8e7b0}.voice-row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.driver-stop-card textarea,.driver-stop-card input,.turnin-panel textarea,.turnin-grid input{min-width:0;border:1px solid #b8892d;background:#050403;color:#fff7ed;border-radius:16px;padding:12px;font:inherit}.driver-stop-card textarea,.turnin-panel textarea{min-height:86px}.turnin-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.driver-notice{color:#f8e7b0!important;font-weight:900}@media(max-width:760px){.driver-topline{grid-template-columns:1fr 86px 76px;align-items:stretch}.driver-score{padding:8px}.route-map-hero,.stop-card-head{grid-template-columns:1fr}.route-map-hero a,.stop-card-head a{width:100%}.status-buttons,.status-buttons.fulfillment,.turnin-grid,.voice-row{grid-template-columns:1fr 1fr}.voice-row button:first-child{grid-column:1/-1}.status-buttons button{min-height:44px}.driver-stop-card,.turnin-panel{border-radius:18px;padding:16px}}`}</style>
  </section>
}
