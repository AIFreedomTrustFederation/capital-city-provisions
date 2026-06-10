'use client';
import {useMemo,useState} from 'react';

type Props={memory:Record<string,any>};
type QueueStatus='queued'|'pitched'|'reserved'|'skipped';
type SaleLead={id:string;name:string;email:string;phone:string;address:string;zip:string;area:string;need:string;offer:string;value:number;distance:string;temperature:'hot'|'warm'|'watch';status:QueueStatus;note:string;driverRoutePlan?:string;ownerOverride?:string};

function money(value:number){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value||0)}
function makeStops(memory:Record<string,any>){return (memory.routes||[]).flatMap((route:any)=>(route.orders||[]).map((order:any)=>({...order,routeName:route.name,routeId:route.id,day:route.day,window:route.window,priority:route.priority,driver:route.driver||memory.driver||'Driver'})))}
function mapSearchUrl(target:string){return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${target} Sacramento CA`)}`}
function pitchFor(lead?:SaleLead){
  if(!lead)return 'Capture a real customer lead first, then the sales co-pilot can help write the pitch.';
  if(lead.need.toLowerCase().includes('wholesale'))return `Keep it direct: "We can build your recurring protein list around your actual service days. I can queue a wholesale quote now and have ownership confirm pricing before you commit."`;
  if(lead.need.toLowerCase().includes('emergency'))return `Lead with planning: "We can stock the freezer around real meals, not random bulk. I can queue a food-security plan and confirm the route before anything is charged."`;
  return `Keep it simple: "Your route is already active nearby. I can reserve the right box size, note your protein preferences, and have the team confirm the final plan before delivery."`;
}

export default function DriverSalesRouteMode({memory}:Props){
  const stops=useMemo(()=>makeStops(memory),[memory]);
  const [leads,setLeads]=useState<SaleLead[]>([]);
  const [active,setActive]=useState(stops[0]?.id||'');
  const [selectedLead,setSelectedLead]=useState('');
  const [draft,setDraft]=useState({name:'',email:'',phone:'',address:'',zip:'',area:'',need:'',offer:'Freezer box follow-up',value:'0',temperature:'warm' as SaleLead['temperature'],note:''});
  const [ai,setAi]=useState({answer:pitchFor(),loading:false});
  const [notice,setNotice]=useState('');
  const [routePlan,setRoutePlan]=useState('');
  const activeStop=stops.find((stop:any)=>stop.id===active)||stops[0];
  const lead=leads.find(item=>item.id===selectedLead)||leads[0];
  const reserved=leads.filter(item=>item.status==='reserved');
  const pitched=leads.filter(item=>item.status==='pitched'||item.status==='reserved');
  const queuedValue=leads.filter(item=>item.status!=='skipped').reduce((sum,item)=>sum+item.value,0);
  const routeCapacity=(memory.routes||[]).reduce((sum:number,route:any)=>sum+(route.capacity||0),0);
  const routeReserved=(memory.routes||[]).reduce((sum:number,route:any)=>sum+(route.reserved||0),0)+reserved.length;
  const capacityPercent=Math.min(100,Math.round((routeReserved/Math.max(routeCapacity,1))*100));

  function addLead(){
    if(!draft.name||!draft.phone&&!draft.email){setNotice('Add a real lead name plus phone or email before queueing.');return}
    const record:SaleLead={id:`SALE-${Date.now()}`,name:draft.name,email:draft.email,phone:draft.phone,address:draft.address,zip:draft.zip,area:draft.area||draft.zip||'Live route',need:draft.need||'Freezer box follow-up',offer:draft.offer,value:Number(draft.value||0),distance:activeStop?'From current live route':'Live field lead',temperature:draft.temperature,status:'queued',note:draft.note};
    setLeads(current=>[record,...current]);
    setSelectedLead(record.id);
    setAi({answer:pitchFor(record),loading:false});
    setNotice(`${record.name} added as a live sales lead draft. Save it when ready.`);
    setDraft({name:'',email:'',phone:'',address:'',zip:'',area:'',need:'',offer:'Freezer box follow-up',value:'0',temperature:'warm',note:''});
  }

  async function updateLead(id:string,status:QueueStatus){
    const target=leads.find(item=>item.id===id);
    if(!target)return;
    setLeads(current=>current.map(item=>item.id===id?{...item,status}:item));
    setNotice(`Saving ${target.name} as ${status}...`);
    try{
      const response=await fetch('/api/ops/driver-sales',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:target.id,driver:memory.driver||'Driver',sourceStopId:activeStop?.id,sourceCustomer:activeStop?.customer,routeId:activeStop?.routeId,leadName:target.name,email:target.email,phone:target.phone,address:target.address,zip:target.zip,area:target.area,need:target.need,offer:target.offer,estimatedValue:target.value,status,temperature:target.temperature,note:target.note,ownerOverride:target.ownerOverride,driverRoutePlan:target.driverRoutePlan||routePlan})});
      const result=await response.json();
      setNotice(result.ok?`${target.name} saved to live driver sales queue.`:`${target.name} stayed on this phone. Try again before turn-in.`);
    }catch(error){setNotice(`${target.name} stayed on this phone. Connection to sales queue did not respond.`);}
  }
  async function askSalesAi(intent:string){
    if(!lead){setAi({answer:pitchFor(),loading:false});return}
    const local=intent==='queue'?`Queue ${lead.name} as ${lead.offer}. Next action: confirm ZIP ${lead.zip}, preferred proteins, and best callback time before promising delivery.`:pitchFor(lead);
    setAi({answer:local,loading:true});
    try{
      const response=await fetch('/api/ai/route-concierge',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({role:'driver',intent:'driver-sales-route',salesIntent:intent,activeStop,lead,leads,driverRoutePlan:routePlan,driver:memory.driver||'Driver'})});
      const result=await response.json();
      const rec=result?.recommendation;
      setAi({answer:rec?.driverAnswer||rec?.summary||rec?.raw||local,loading:false});
    }catch(error){setAi({answer:local,loading:false});}
  }

  return <section className="section sales-route-mode" id="sales-route-mode">
    <div className="sales-app-shell">
      <div className="sales-phone-top"><div><p className="eyebrow">Driver Sales Route</p><h2>Deliver, sell, queue the next route.</h2></div><div className="live-pill">Live route</div></div>
      <div className="sales-hero-board"><article className="active-delivery"><p className="eyebrow">Current Stop</p><h3>{activeStop?.customer||'No active stop'}</h3><p>{activeStop?.box||'Real stops appear after live orders are assigned.'}</p><div className="delivery-actions">{activeStop&&<a href={mapSearchUrl(`${activeStop.customer} ${activeStop.zip}`)} target="_blank" rel="noreferrer">Navigate</a>}<button onClick={()=>askSalesAi('pitch')} disabled={!lead}>Sales Script</button></div></article><article className="route-fill"><p className="eyebrow">Route Queue</p><strong>{routeReserved}/{routeCapacity}</strong><span>{capacityPercent}% filled after queued sales</span><i><b style={{width:`${capacityPercent}%`}}/></i></article><article className="sales-total"><p className="eyebrow">Open Opportunity</p><strong>{money(queuedValue)}</strong><span>{reserved.length} reserved, {pitched.length} pitched</span></article></div>
      <div className="sales-work-grid"><div className="delivery-stack"><p className="eyebrow">Delivery Queue</p>{stops.length?stops.map((stop:any)=><button key={stop.id} onClick={()=>setActive(stop.id)} className={active===stop.id?'active':''}><span>{stop.id}</span><b>{stop.customer}</b><small>{stop.box} - {stop.routeName}</small></button>):<article><h3>No live stops yet.</h3><p>Live delivery stops will appear here after real orders are scheduled.</p></article>}</div>
        <div className="sales-lead-stack"><div className="stack-head"><div><p className="eyebrow">Next Sale Queue</p><h3>Only real captured leads appear here.</h3></div><button onClick={()=>askSalesAi('queue')} disabled={!lead}>AI Queue</button></div><div className="lead-capture-card"><input value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})} placeholder="Lead name"/><input value={draft.phone} onChange={e=>setDraft({...draft,phone:e.target.value})} placeholder="Phone"/><input value={draft.email} onChange={e=>setDraft({...draft,email:e.target.value})} placeholder="Email"/><input value={draft.zip} onChange={e=>setDraft({...draft,zip:e.target.value})} placeholder="ZIP"/><input value={draft.need} onChange={e=>setDraft({...draft,need:e.target.value})} placeholder="Need"/><input value={draft.offer} onChange={e=>setDraft({...draft,offer:e.target.value})} placeholder="Offer"/><input value={draft.value} onChange={e=>setDraft({...draft,value:e.target.value})} placeholder="Estimated value"/><textarea value={draft.note} onChange={e=>setDraft({...draft,note:e.target.value})} placeholder="Real customer note"/><button onClick={addLead}>Add Real Lead</button></div>{leads.map(item=><article key={item.id} onClick={()=>setSelectedLead(item.id)} className={`${selectedLead===item.id?'active ':''}${item.temperature}`}><div><span>{item.id}</span><h4>{item.name}</h4><p>{item.need}</p><small>{item.phone} - {item.email}</small></div><div><strong>{money(item.value)}</strong><small>{item.distance}</small></div><div className="queue-actions"><button onClick={event=>{event.stopPropagation();updateLead(item.id,'pitched')}}>Pitch</button><button onClick={event=>{event.stopPropagation();updateLead(item.id,'reserved')}}>Reserve</button><button onClick={event=>{event.stopPropagation();updateLead(item.id,'skipped')}}>Skip</button></div><small>{item.status}</small></article>)}</div>
        <aside className="sales-ai-panel"><p className="eyebrow">AI Sales Co-Pilot</p><h3>{ai.loading?'Writing driver guidance...':lead?.offer||'No live lead selected'}</h3><p>{ai.answer}</p>{lead&&<div className="lead-brief"><span><b>{lead.area}</b> area</span><span><b>{lead.zip}</b> ZIP</span><span><b>{lead.temperature}</b> signal</span></div>}<textarea value={lead?.note||''} readOnly /><div className="contact-grid"><a href={lead?.phone?`tel:${lead.phone}`:'#'}>Call</a><a href={lead?.phone?`sms:${lead.phone}`:'#'}>Text</a><a href={lead?.email?`mailto:${lead.email}`:'#'}>Email</a></div><textarea value={routePlan} onChange={event=>setRoutePlan(event.target.value)} placeholder="Plain-language route plan for a real lead." /><button onClick={()=>askSalesAi('pitch')} disabled={!lead}>Refresh Script</button><a href={lead?mapSearchUrl(`${lead.area} ${lead.zip}`):'#'} target="_blank" rel="noreferrer">Open Area Map</a>{notice&&<p className="sales-save-notice">{notice}</p>}</aside>
      </div>
    </div>
  </section>
}
