'use client';

import {useEffect,useMemo,useState} from 'react';

type Status='connected'|'watch'|'blocked';

type Check={
  key:string;
  label:string;
  status:Status;
  detail:string;
};

type RouteCheck={
  route:string;
  label:string;
  expected:string;
  status:Status;
};

type PublicLanguageCheck={
  scope:string;
  path:string;
  terms:string[];
  status:Status;
  note:string;
};

type Payload={
  ok:boolean;
  generatedAt:string;
  commit:string;
  environment:string;
  storage:{postgresConfigured:boolean;mode:string};
  summary:{connected:number;watch:number;blocked:number;total:number};
  checks:Check[];
  routes:RouteCheck[];
  publicLanguage:PublicLanguageCheck[];
  customerOperations:Record<string,number>;
  recursiveLoop:string[];
  watchItems:string[];
  message?:string;
};

const empty:Payload={
  ok:false,
  generatedAt:'',
  commit:'',
  environment:'',
  storage:{postgresConfigured:false,mode:'loading'},
  summary:{connected:0,watch:0,blocked:0,total:0},
  checks:[],
  routes:[],
  publicLanguage:[],
  customerOperations:{},
  recursiveLoop:[],
  watchItems:[],
};

function badge(status:Status){
  if(status==='connected')return 'Connected';
  if(status==='watch')return 'Watch';
  return 'Blocked';
}

export default function DevOnlyAIStatusBoard(){
  const [payload,setPayload]=useState<Payload>(empty);
  const [loading,setLoading]=useState(true);
  const [notice,setNotice]=useState('Loading dev-only AI status...');

  async function load(){
    setLoading(true);
    const result=await fetch('/api/dev/ai-status',{credentials:'same-origin'})
      .then(response=>response.json())
      .catch(()=>null);

    if(result?.ok){
      setPayload(result);
      setNotice('Dev status loaded.');
    }else{
      setPayload(empty);
      setNotice(result?.message||'Dev status unavailable.');
    }
    setLoading(false);
  }

  useEffect(()=>{load()},[]);

  const customerOps=useMemo(()=>Object.entries(payload.customerOperations||{}),[payload.customerOperations]);

  return (
    <section className="section dev-ai-status" id="dev-ai-status">
      <div className="dev-status-hero">
        <div>
          <p className="eyebrow">Dev Only AI Status Board</p>
          <h1>Internal diagnostics for the whole operating loop.</h1>
          <p>{notice}</p>
          <div className="dev-status-actions">
            <button onClick={load} disabled={loading}>{loading?'Refreshing...':'Refresh Status'}</button>
            <a href="/owner">Owner Command</a>
            <a href="/team">Team Gate</a>
          </div>
        </div>

        <aside>
          <span>Environment <b>{payload.environment||'unknown'}</b></span>
          <span>Storage <b>{payload.storage.mode}</b></span>
          <span>Commit <b>{payload.commit?.slice(0,12)||'unknown'}</b></span>
          <span>Generated <b>{payload.generatedAt?new Date(payload.generatedAt).toLocaleString():'not loaded'}</b></span>
        </aside>
      </div>

      <div className="dev-summary-grid">
        <article><small>Connected</small><strong>{payload.summary.connected}</strong></article>
        <article><small>Watch</small><strong>{payload.summary.watch}</strong></article>
        <article><small>Blocked</small><strong>{payload.summary.blocked}</strong></article>
        <article><small>Total Checks</small><strong>{payload.summary.total}</strong></article>
      </div>

      <div className="dev-check-grid">
        {payload.checks.map(check=>(
          <article key={check.key} className={`status-${check.status}`}>
            <span>{badge(check.status)}</span>
            <h3>{check.label}</h3>
            <p>{check.detail}</p>
          </article>
        ))}
      </div>

      <div className="dev-two-col">
        <article>
          <p className="eyebrow">Customer Operations Counters</p>
          <h2>Runtime signal inventory.</h2>
          <div className="dev-kv-list">
            {customerOps.map(([key,value])=>(
              <span key={key}><b>{key}</b><strong>{value}</strong></span>
            ))}
            {!customerOps.length&&<p>No customer operation counters loaded.</p>}
          </div>
        </article>

        <article>
          <p className="eyebrow">Known Watch Items</p>
          <h2>Next backend hardening.</h2>
          <div className="dev-watch-list">
            {payload.watchItems.map(item=><p key={item}>{item}</p>)}
            {!payload.watchItems.length&&<p>No watch items loaded.</p>}
          </div>
        </article>
      </div>

      <div className="dev-route-table">
        <p className="eyebrow">Route + API Health</p>
        <h2>Dead-end and endpoint map.</h2>
        <div>
          <table>
            <thead>
              <tr><th>Route</th><th>Label</th><th>Expected</th><th>Status</th></tr>
            </thead>
            <tbody>
              {payload.routes.map(route=>(
                <tr key={route.route}>
                  <td>{route.route}</td>
                  <td>{route.label}</td>
                  <td>{route.expected}</td>
                  <td><span className={`mini-status status-${route.status}`}>{badge(route.status)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="dev-two-col">
        <article>
          <p className="eyebrow">Public Language Safety</p>
          <h2>Keep diagnostics behind the gate.</h2>
          {payload.publicLanguage.map(item=>(
            <div className="language-card" key={item.scope}>
              <b>{item.scope}</b>
              <span>{item.path}</span>
              <p>{item.note}</p>
              <small>Watch terms: {item.terms.join(', ')}</small>
            </div>
          ))}
        </article>

        <article>
          <p className="eyebrow">Recursive Loop</p>
          <h2>Customer signal return path.</h2>
          <ol className="dev-loop">
            {payload.recursiveLoop.map(step=><li key={step}>{step}</li>)}
          </ol>
        </article>
      </div>

      <style>{`
        .dev-ai-status{border:1px solid rgba(248,231,176,.22);border-radius:30px;background:radial-gradient(circle at top right,rgba(212,175,55,.14),transparent 30%),linear-gradient(135deg,#080503,#020202);padding:20px}
        .dev-ai-status h1,.dev-ai-status h2,.dev-ai-status h3{color:#f8e7b0;margin:.2rem 0}
        .dev-ai-status h1{font-size:clamp(2.4rem,6vw,5.2rem);line-height:.9;text-transform:uppercase}
        .dev-ai-status p{color:#ded2bd}
        .dev-status-hero{display:grid;grid-template-columns:1fr 360px;gap:16px;align-items:start}
        .dev-status-hero aside,.dev-summary-grid article,.dev-check-grid article,.dev-two-col article,.dev-route-table{border:1px solid rgba(248,231,176,.16);border-radius:22px;background:#050403;padding:14px}
        .dev-status-hero aside{display:grid;gap:8px}
        .dev-status-hero aside span,.dev-kv-list span{display:flex;justify-content:space-between;gap:12px;border-bottom:1px solid rgba(248,231,176,.12);padding-bottom:7px;color:#ded2bd}
        .dev-status-hero b,.dev-kv-list strong{color:#f8e7b0}
        .dev-status-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:12px}
        .dev-status-actions button,.dev-status-actions a{border:1px solid rgba(248,231,176,.42);border-radius:999px;background:#0b0704;color:#fff7ed;text-decoration:none;padding:.8rem 1rem;font-weight:900;cursor:pointer;text-transform:uppercase}
        .dev-status-actions button{background:linear-gradient(135deg,#facc15,#a16207);color:#160b04}
        .dev-status-actions button:disabled{opacity:.65;cursor:wait}
        .dev-summary-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:14px 0}
        .dev-summary-grid small{color:#d4af37;font-weight:900;text-transform:uppercase}
        .dev-summary-grid strong{display:block;color:#f8e7b0;font-size:2rem}
        .dev-check-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
        .dev-check-grid article span,.mini-status{display:inline-flex;border-radius:999px;padding:4px 10px;font-size:.72rem;font-weight:900;text-transform:uppercase}
        .status-connected span,.status-connected.mini-status{background:#14532d;color:#dcfce7}
        .status-watch span,.status-watch.mini-status{background:#713f12;color:#fef3c7}
        .status-blocked span,.status-blocked.mini-status{background:#7f1d1d;color:#fee2e2}
        .dev-two-col{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}
        .dev-kv-list,.dev-watch-list{display:grid;gap:8px;margin-top:10px}
        .dev-watch-list p,.language-card{border-top:1px solid rgba(248,231,176,.12);padding-top:8px}
        .language-card b{display:block;color:#f8e7b0}
        .language-card span,.language-card small{display:block;color:#d4af37}
        .dev-route-table{margin-top:12px}
        .dev-route-table div{overflow:auto}
        .dev-route-table table{width:100%;border-collapse:collapse;min-width:760px}
        .dev-route-table th,.dev-route-table td{border-bottom:1px solid rgba(248,231,176,.12);padding:10px;text-align:left;color:#ded2bd}
        .dev-route-table th{color:#f8e7b0}
        .dev-loop{display:grid;gap:8px;color:#ded2bd}
        .dev-loop li{padding-bottom:8px;border-bottom:1px solid rgba(248,231,176,.12)}
        @media(max-width:1100px){.dev-status-hero,.dev-check-grid,.dev-two-col{grid-template-columns:1fr}.dev-summary-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:640px){.dev-summary-grid{grid-template-columns:1fr}.dev-ai-status{padding:12px;border-radius:22px}}
      `}</style>
    </section>
  );
}
