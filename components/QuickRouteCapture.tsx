'use client';
import {useEffect,useState} from 'react';

type Route={route:string;day:string;window:string;status:string;message:string};

const ZIP_STORAGE_KEY='ccp_delivery_zip';
const ROUTE_LEAD_KEY='ccp_quick_route_lead';
const PROMPT_PAGE_KEY='ccp_route_prompt_page';

function routePlan(zip=''):Route{
  const clean=(zip.match(/\d{5}/)?.[0]||'').trim();
  const routes:Record<string,Route>={
    '95628':{route:'Fair Oaks / Carmichael Route',day:'Tuesday',window:'3-7 PM',status:'Delivery available',message:'We are collecting nearby orders for this route.'},
    '95608':{route:'Fair Oaks / Carmichael Route',day:'Tuesday',window:'3-7 PM',status:'Delivery available',message:'We are collecting nearby orders for this route.'},
    '95661':{route:'Roseville Route',day:'Wednesday',window:'2-6 PM',status:'Confirmed route',message:'This route is active and ready for freezer-box reservations.'},
    '95678':{route:'Roseville Route',day:'Wednesday',window:'2-6 PM',status:'Confirmed route',message:'This route is active and ready for freezer-box reservations.'},
    '95765':{route:'Rocklin / Lincoln Route',day:'Thursday',window:'2-6 PM',status:'Almost full',message:'This route is close to dispatch-ready.'},
    '95677':{route:'Rocklin / Lincoln Route',day:'Thursday',window:'2-6 PM',status:'Almost full',message:'This route is close to dispatch-ready.'},
    '95648':{route:'Rocklin / Lincoln Route',day:'Thursday',window:'2-6 PM',status:'Almost full',message:'This route is close to dispatch-ready.'},
    '95630':{route:'Folsom / Orangevale Route',day:'Friday',window:'2-6 PM',status:'Building route',message:'We are grouping nearby orders for profitable delivery.'},
    '95662':{route:'Folsom / Orangevale Route',day:'Friday',window:'2-6 PM',status:'Building route',message:'We are grouping nearby orders for profitable delivery.'}
  };
  return routes[clean]||{route:'Expansion / Waitlist Route',day:'Next grouped route',window:'To be confirmed',status:'Join waitlist',message:'Leave your details and we will group your area with nearby customers.'};
}

function nextStep(route:Route){
  if(route.status==='Confirmed route')return 'Expect route follow-up within 24 hours so we can match your freezer box.';
  if(route.status==='Almost full')return 'We will follow up quickly while your route is close to dispatch-ready.';
  if(route.status==='Join waitlist')return 'We will group your area with nearby customers and follow up when a route opens.';
  return 'We will use this route request to plan your freezer-box follow-up.';
}

function pagePromptKey(){
  return `${PROMPT_PAGE_KEY}:${window.location.pathname}`;
}

function saveZip(zip:string){
  const clean=(zip.match(/\d{5}/)?.[0]||'').trim();
  if(!clean)return '';
  localStorage.setItem(ZIP_STORAGE_KEY,clean);
  window.dispatchEvent(new CustomEvent('ccp:delivery-zip',{detail:{zip:clean}}));
  return clean;
}

export default function QuickRouteCapture(){
  const [zip,setZip]=useState('');
  const [route,setRoute]=useState<Route|null>(null);
  const [details,setDetails]=useState({name:'',email:'',phone:''});
  const [sent,setSent]=useState(false);
  const [prompt,setPrompt]=useState(false);

  useEffect(()=>{
    const saved=localStorage.getItem(ZIP_STORAGE_KEY)||'';
    if(saved)setZip(saved);

    const currentPageKey=pagePromptKey();
    const maybePrompt=()=>{
      if(route||localStorage.getItem(ZIP_STORAGE_KEY)||sessionStorage.getItem(currentPageKey))return;
      sessionStorage.setItem(currentPageKey,'shown');
      setPrompt(true);
    };

    const timer=setTimeout(maybePrompt,10000);
    const onScroll=()=>{if(window.scrollY>520)maybePrompt()};
    window.addEventListener('scroll',onScroll,{passive:true});
    return()=>{clearTimeout(timer);window.removeEventListener('scroll',onScroll)};
  },[route]);

  function checkZip(e?:React.FormEvent){
    e?.preventDefault();
    const clean=saveZip(zip);
    if(!clean)return;
    setZip(clean);
    setRoute(routePlan(clean));
    setPrompt(false);
  }

  async function holdRoute(e:React.FormEvent){
    e.preventDefault();
    const clean=saveZip(zip);
    const plan=route||routePlan(clean);
    const lead={...details,address:clean,zip:clean,interest:'Quick route check',recommendation:'Freezer box route follow-up',route:plan.route,deliveryDay:plan.day,deliveryWindow:plan.window,routeStatus:plan.status,message:'Quick capture from landing page',source:'delivery-zip-popup'};
    localStorage.setItem(ROUTE_LEAD_KEY,JSON.stringify(lead));
    await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(lead)});
    setSent(true);
  }

  return <>
    <div className="quick-route" id="quick-route">
      <p className="quick-price">Boxes sized for $300-$1,000+ monthly freezer plans.</p>
      <form onSubmit={checkZip} className="quick-route-form">
        <input inputMode="numeric" pattern="[0-9]*" value={zip} onChange={e=>setZip(e.target.value)} placeholder="Enter ZIP code" aria-label="ZIP code"/>
        <button type="submit">Check Delivery</button>
      </form>
      {route&&<div className="quick-result">
        <strong>{route.status}</strong>
        <span>{route.route} - {route.day} - {route.window}</span>
        <p>{route.message}</p>
        {!sent?<form onSubmit={holdRoute} className="quick-hold">
          <input value={details.name} onChange={e=>setDetails({...details,name:e.target.value})} placeholder="Name" aria-label="Name" required/>
          <input value={details.email} onChange={e=>setDetails({...details,email:e.target.value})} placeholder="Email" type="email" aria-label="Email" required/>
          <input value={details.phone} onChange={e=>setDetails({...details,phone:e.target.value})} placeholder="Phone" type="tel" aria-label="Phone"/>
          <button type="submit">Hold My Route</button>
        </form>:<div className="quick-thanks"><strong>{route.route} request received.</strong><p>{nextStep(route)}</p><div><a href="/freezer-boxes">Compare Freezer Boxes</a><a href="mailto:sales@capitalcityprovisions.com">Email Sales</a></div></div>}
      </div>}
      <a className="quick-contact" href="mailto:sales@capitalcityprovisions.com">Email Sales</a>
    </div>
    {prompt&&!route&&<div className="route-nudge">
      <button aria-label="Close route check prompt" onClick={()=>setPrompt(false)}>x</button>
      <strong>Want us to check your delivery route?</strong>
      <span>It takes one ZIP code.</span>
      <a href="#quick-route" onClick={()=>setPrompt(false)}>Check ZIP</a>
    </div>}
    <style>{`
      .quick-route{margin-top:20px;border:1px solid #b8892d88;border-radius:22px;background:linear-gradient(180deg,#090706,#130a06);padding:16px;box-shadow:inset 0 0 0 1px #f8e7b014}.quick-price{margin:0 0 10px!important;color:#f8e7b0!important;font-weight:900;font-size:.98rem!important}.quick-route-form,.quick-hold{display:grid;grid-template-columns:1fr auto;gap:10px}.quick-route input,.quick-hold input{min-width:0;border:1px solid #b8892d;background:#050403;color:#fff7ed;border-radius:999px;padding:13px 15px;font:inherit}.quick-route button,.quick-result a,.quick-contact{border:1px solid #f8e7b0;background:linear-gradient(135deg,#facc15,#a16207);color:#160b04;border-radius:999px;padding:13px 16px;font-weight:900;text-decoration:none;white-space:nowrap}.quick-result{margin-top:12px;border-top:1px solid #b8892d55;padding-top:12px}.quick-result strong{display:block;color:#d4af37}.quick-result span{display:block;color:#f8e7b0;margin-top:3px}.quick-result p{margin:6px 0!important;font-size:.95rem!important}.quick-hold{grid-template-columns:1fr 1fr}.quick-hold button{grid-column:1/-1}.quick-thanks{border:1px solid #d4af37;border-radius:18px;padding:13px;background:#080605}.quick-thanks div{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px}.quick-thanks a{margin-top:0!important;padding:10px 13px}.quick-contact{display:inline-block;margin-top:10px;background:#090706!important;color:#f8e7b0!important;border-color:#d4af37!important}.route-nudge{position:fixed;left:18px;bottom:18px;z-index:42;max-width:310px;border:1px solid #d4af37;border-radius:20px;background:linear-gradient(180deg,#130a06,#050403);box-shadow:0 20px 60px #000;padding:16px;color:#fff7ed}.route-nudge button{position:absolute;right:10px;top:8px;border:0;background:transparent;color:#f8e7b0;font-weight:900}.route-nudge strong,.route-nudge span{display:block;padding-right:18px}.route-nudge span{color:#ded2bd;margin:4px 0 10px}.route-nudge a{display:inline-block;border-radius:999px;background:linear-gradient(135deg,#facc15,#a16207);color:#160b04;padding:10px 14px;text-decoration:none;font-weight:900}@media(max-width:760px){.quick-route{padding:14px;margin-top:16px}.quick-route-form,.quick-hold{grid-template-columns:1fr}.quick-route button,.quick-contact{width:100%;text-align:center}.route-nudge{left:12px;right:12px;bottom:74px;max-width:none}.quick-price{font-size:.9rem!important}.quick-thanks div{display:grid}.quick-thanks a{text-align:center}}
    `}</style>
  </>
}
