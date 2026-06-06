'use client';
import {useMemo,useState} from 'react';

type Props={memory:Record<string,any>};
type QueueStatus='queued'|'pitched'|'reserved'|'skipped';
type SaleLead={id:string;name:string;zip:string;area:string;need:string;offer:string;value:number;distance:string;temperature:'hot'|'warm'|'watch';status:QueueStatus;note:string};

const starterLeads:SaleLead[]=[
  {id:'SALE-2101',name:'R. Walker',zip:'95661',area:'Roseville',need:'Family freezer restock',offer:'Family Box + cheesecake thank-you',value:525,distance:'0.8 mi from current stop',temperature:'hot',status:'queued',note:'Asked about weeknight meals and ground beef.'},
  {id:'SALE-2102',name:'Sierra Prep Kitchen',zip:'95678',area:'Roseville',need:'Recurring wholesale quote',offer:'Wholesale sample sheet',value:1180,distance:'1.4 mi from route',temperature:'hot',status:'queued',note:'Catering buyer wants simple protein pricing.'},
  {id:'SALE-2103',name:'D. Flores',zip:'95628',area:'Fair Oaks',need:'Starter freezer plan',offer:'Starter Box route hold',value:315,distance:'Queued for Tuesday route',temperature:'warm',status:'queued',note:'Price sensitive, likes chicken and sirloin.'},
  {id:'SALE-2104',name:'H. Bennett',zip:'95630',area:'Folsom',need:'Emergency meals',offer:'Food security plan consult',value:640,distance:'Waitlist route build',temperature:'watch',status:'queued',note:'Wants monthly provisioning after payday.'}
];

function money(value:number){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value||0)}
function makeStops(memory:Record<string,any>){return (memory.routes||[]).flatMap((route:any)=>(route.orders||[]).map((order:any)=>({...order,routeName:route.name,routeId:route.id,day:route.day,window:route.window,priority:route.priority,driver:route.driver||memory.driver||'Driver'})))}
function mapSearchUrl(target:string){return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${target} Sacramento CA`)}`}
function pitchFor(lead:SaleLead){
  if(lead.need.toLowerCase().includes('wholesale'))return `Keep it direct: "We can build your recurring protein list around your actual service days. I can queue a wholesale quote now and have ownership confirm pricing before you commit."`;
  if(lead.need.toLowerCase().includes('emergency'))return `Lead with planning: "We can stock the freezer around real meals, not random bulk. I can queue a food-security plan and confirm the route before anything is charged."`;
  return `Keep it simple: "Your route is already active nearby. I can reserve the right box size, note your protein preferences, and have the team confirm the final plan before delivery."`;
}

export default function DriverSalesRouteMode({memory}:Props){
  const stops=useMemo(()=>makeStops(memory),[memory]);
  const [leads,setLeads]=useState<SaleLead[]>(starterLeads);
  const [active,setActive]=useState(stops[0]?.id||'');
  const [selectedLead,setSelectedLead]=useState(starterLeads[0]?.id||'');
  const [ai,setAi]=useState({answer:pitchFor(starterLeads[0]),loading:false});
  const [notice,setNotice]=useState('');
  const activeStop=stops.find((stop:any)=>stop.id===active)||stops[0];
  const lead=leads.find(item=>item.id===selectedLead)||leads[0];
  const reserved=leads.filter(item=>item.status==='reserved');
  const pitched=leads.filter(item=>item.status==='pitched'||item.status==='reserved');
  const queuedValue=leads.filter(item=>item.status!=='skipped').reduce((sum,item)=>sum+item.value,0);
  const routeCapacity=(memory.routes||[]).reduce((sum:number,route:any)=>sum+(route.capacity||0),0);
  const routeReserved=(memory.routes||[]).reduce((sum:number,route:any)=>sum+(route.reserved||0),0)+reserved.length;
  const capacityPercent=Math.min(100,Math.round((routeReserved/Math.max(routeCapacity,1))*100));

  async function updateLead(id:string,status:QueueStatus){
    const target=leads.find(item=>item.id===id);
    if(!target)return;
    setLeads(current=>current.map(item=>item.id===id?{...item,status}:item));
    setNotice(`Saving ${target.name} as ${status}...`);
    try{
      const response=await fetch('/api/ops/driver-sales?sample=1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:target.id,driver:memory.driver||'Driver',sourceStopId:activeStop?.id,sourceCustomer:activeStop?.customer,routeId:activeStop?.routeId,leadName:target.name,zip:target.zip,area:target.area,need:target.need,offer:target.offer,estimatedValue:target.value,status,temperature:target.temperature,note:target.note})});
      const result=await response.json();
      setNotice(result.ok?`${target.name} saved to driver sales queue.`:`${target.name} stayed on this phone. Try again before turn-in.`);
    }catch(error){
      setNotice(`${target.name} stayed on this phone. Connection to sales queue did not respond.`);
    }
  }
  async function askSalesAi(intent:string){
    if(!lead)return;
    const local=intent==='queue'?`Queue ${lead.name} as ${lead.offer}. Next action: confirm ZIP ${lead.zip}, preferred proteins, and best callback time before promising delivery.`:pitchFor(lead);
    setAi({answer:local,loading:true});
    try{
      const response=await fetch('/api/ai/route-concierge',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({role:'driver',intent:'driver-sales-route',salesIntent:intent,activeStop,lead,leads,driver:memory.driver||'Driver'})});
      const result=await response.json();
      const rec=result?.recommendation;
      setAi({answer:rec?.driverAnswer||rec?.summary||rec?.raw||local,loading:false});
    }catch(error){
      setAi({answer:local,loading:false});
    }
  }

  return <section className="section sales-route-mode" id="sales-route-mode">
    <div className="sales-app-shell">
      <div className="sales-phone-top">
        <div><p className="eyebrow">Driver Sales Route</p><h2>Deliver, sell, queue the next route.</h2></div>
        <div className="live-pill">Live route</div>
      </div>

      <div className="sales-hero-board">
        <article className="active-delivery">
          <p className="eyebrow">Current Stop</p>
          <h3>{activeStop?.customer||'No active stop'}</h3>
          <p>{activeStop?.box||'Choose a stop to start.'}</p>
          <div className="delivery-actions">
            {activeStop&&<a href={mapSearchUrl(`${activeStop.customer} ${activeStop.zip}`)} target="_blank" rel="noreferrer">Navigate</a>}
            <button onClick={()=>askSalesAi('pitch')}>Sales Script</button>
          </div>
        </article>
        <article className="route-fill">
          <p className="eyebrow">Route Queue</p>
          <strong>{routeReserved}/{routeCapacity}</strong>
          <span>{capacityPercent}% filled after queued sales</span>
          <i><b style={{width:`${capacityPercent}%`}}/></i>
        </article>
        <article className="sales-total">
          <p className="eyebrow">Open Opportunity</p>
          <strong>{money(queuedValue)}</strong>
          <span>{reserved.length} reserved, {pitched.length} pitched</span>
        </article>
      </div>

      <div className="sales-work-grid">
        <div className="delivery-stack">
          <p className="eyebrow">Delivery Queue</p>
          {stops.map((stop:any)=><button key={stop.id} onClick={()=>setActive(stop.id)} className={active===stop.id?'active':''}>
            <span>{stop.id}</span><b>{stop.customer}</b><small>{stop.box} - {stop.routeName}</small>
          </button>)}
        </div>

        <div className="sales-lead-stack">
          <div className="stack-head"><div><p className="eyebrow">Next Sale Queue</p><h3>Nearby asks worth acting on.</h3></div><button onClick={()=>askSalesAi('queue')}>AI Queue</button></div>
          {leads.map(item=><article key={item.id} onClick={()=>setSelectedLead(item.id)} className={`${selectedLead===item.id?'active ':''}${item.temperature}`}>
            <div><span>{item.id}</span><h4>{item.name}</h4><p>{item.need}</p></div>
            <div><strong>{money(item.value)}</strong><small>{item.distance}</small></div>
            <div className="queue-actions">
              <button onClick={event=>{event.stopPropagation();updateLead(item.id,'pitched')}}>Pitch</button>
              <button onClick={event=>{event.stopPropagation();updateLead(item.id,'reserved')}}>Reserve</button>
              <button onClick={event=>{event.stopPropagation();updateLead(item.id,'skipped')}}>Skip</button>
            </div>
            <small>{item.status}</small>
          </article>)}
        </div>

        <aside className="sales-ai-panel">
          <p className="eyebrow">AI Sales Co-Pilot</p>
          <h3>{ai.loading?'Writing driver guidance...':lead?.offer}</h3>
          <p>{ai.answer}</p>
          <div className="lead-brief">
            <span><b>{lead?.area}</b> area</span>
            <span><b>{lead?.zip}</b> ZIP</span>
            <span><b>{lead?.temperature}</b> signal</span>
          </div>
          <textarea value={lead?.note||''} readOnly />
          <button onClick={()=>askSalesAi('pitch')}>Refresh Script</button>
          <a href={lead?mapSearchUrl(`${lead.area} ${lead.zip}`):'#'} target="_blank" rel="noreferrer">Open Area Map</a>
          {notice&&<p className="sales-save-notice">{notice}</p>}
        </aside>
      </div>
    </div>
    <style>{`.sales-route-mode{padding-top:18px}.sales-app-shell{border:1px solid rgba(212,175,55,.5);border-radius:28px;background:linear-gradient(180deg,#060504,#120b06);padding:18px;box-shadow:0 24px 80px rgba(0,0,0,.34)}.sales-phone-top{display:flex;justify-content:space-between;gap:14px;align-items:center;margin-bottom:14px}.sales-phone-top h2{margin:0;color:#fff7ed}.live-pill{border:1px solid #86efac;background:#052e1a;color:#bbf7d0;border-radius:999px;padding:10px 14px;font-weight:900}.sales-hero-board{display:grid;grid-template-columns:1.4fr .8fr .8fr;gap:12px;margin-bottom:14px}.sales-hero-board article,.sales-ai-panel,.delivery-stack,.sales-lead-stack{border:1px solid rgba(212,175,55,.55);border-radius:22px;background:#070504;padding:16px}.active-delivery h3,.sales-ai-panel h3,.stack-head h3{margin:0;color:#f8e7b0}.delivery-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}.delivery-actions a,.delivery-actions button,.stack-head button,.queue-actions button,.sales-ai-panel button,.sales-ai-panel a{border:1px solid #f8e7b0;background:linear-gradient(135deg,#facc15,#a16207);color:#170b04;border-radius:999px;padding:11px 12px;font-weight:900;text-align:center;text-decoration:none}.route-fill strong,.sales-total strong{display:block;color:#fff7ed;font-size:2rem;line-height:1}.route-fill i{display:block;height:10px;border:1px solid #b8892d66;border-radius:999px;background:#050403;overflow:hidden;margin-top:12px}.route-fill b{display:block;height:100%;background:linear-gradient(90deg,#22c55e,#facc15,#ef4444);border-radius:999px}.sales-work-grid{display:grid;grid-template-columns:260px minmax(0,1fr) 340px;gap:12px}.delivery-stack,.sales-lead-stack{display:grid;gap:10px;align-content:start}.delivery-stack button{border:1px solid rgba(184,137,45,.55);background:#050403;color:#f8e7b0;border-radius:18px;padding:12px;text-align:left}.delivery-stack button.active{background:linear-gradient(135deg,#facc15,#a16207);color:#170b04;border-color:#fff7ed}.delivery-stack span,.sales-lead-stack span{font-size:.78rem;font-weight:900;text-transform:uppercase;letter-spacing:.08em}.delivery-stack b{display:block}.delivery-stack small{display:block;color:inherit;opacity:.78}.stack-head{display:flex;justify-content:space-between;gap:10px;align-items:start}.sales-lead-stack article{display:grid;grid-template-columns:1fr auto;gap:10px;border:1px solid rgba(184,137,45,.45);border-radius:20px;background:#050403;padding:12px;cursor:pointer}.sales-lead-stack article.active{border-color:#f8e7b0;box-shadow:0 0 0 2px rgba(250,204,21,.22)}.sales-lead-stack article.hot{background:linear-gradient(135deg,rgba(127,29,29,.35),#050403)}.sales-lead-stack article.warm{background:linear-gradient(135deg,rgba(113,63,18,.35),#050403)}.sales-lead-stack h4{margin:2px 0;color:#fff7ed}.sales-lead-stack p{margin:0}.sales-lead-stack strong{color:#f8e7b0}.queue-actions{grid-column:1/-1;display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.sales-ai-panel{display:grid;gap:10px;align-content:start;position:sticky;top:86px}.lead-brief{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.lead-brief span{border:1px solid rgba(184,137,45,.55);border-radius:14px;padding:9px;color:#ded2bd}.lead-brief b{display:block;color:#f8e7b0}.sales-ai-panel textarea{min-height:96px;border:1px solid #b8892d;background:#050403;color:#fff7ed;border-radius:16px;padding:12px;font:inherit;resize:vertical}.sales-save-notice{border:1px solid rgba(134,239,172,.55);border-radius:14px;background:#052e1a;color:#bbf7d0!important;padding:10px;font-weight:900}@media(max-width:980px){.sales-hero-board,.sales-work-grid{grid-template-columns:1fr}.sales-ai-panel{position:static}.sales-phone-top{align-items:flex-start}.live-pill{white-space:nowrap}}@media(max-width:620px){.sales-app-shell{border-radius:20px;padding:12px}.sales-phone-top{display:grid}.sales-hero-board article,.sales-ai-panel,.delivery-stack,.sales-lead-stack{border-radius:18px;padding:13px}.delivery-actions,.lead-brief{grid-template-columns:1fr}.stack-head{display:grid}.sales-lead-stack article{grid-template-columns:1fr}.queue-actions{grid-template-columns:1fr 1fr}.queue-actions button:last-child{grid-column:1/-1}}`}</style>
  </section>
}
