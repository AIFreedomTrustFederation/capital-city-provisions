'use client';
import {useEffect,useState} from 'react';

type AccessRole='driver'|'owner';
type AccessGateProps={role:AccessRole;children:React.ReactNode};

const ACCESS_CONFIG={
  driver:{label:'Driver Access',storageKey:'ccp_driver_access',code:'DRIVER2026',hint:'Enter the driver code to open route and delivery tools.'},
  owner:{label:'Owner Access',storageKey:'ccp_owner_access',code:'OWNER2026',hint:'Enter the owner code to open reports, database, and internal AI tools.'}
};

export default function AccessGate({role,children}:AccessGateProps){
  const config=ACCESS_CONFIG[role];
  const [code,setCode]=useState('');
  const [allowed,setAllowed]=useState(false);
  const [error,setError]=useState('');

  useEffect(()=>{setAllowed(localStorage.getItem(config.storageKey)==='granted')},[config.storageKey]);

  function submit(e:React.FormEvent){
    e.preventDefault();
    if(code.trim()===config.code){
      localStorage.setItem(config.storageKey,'granted');
      setAllowed(true);setError('');return;
    }
    setError('Access code not recognized.');
  }

  if(allowed)return <>{children}</>;

  return <main className="site page-flow"><section className="page-hero poster-frame access-panel"><div><p className="eyebrow">{config.label}</p><h1>Internal workspace locked.</h1><p className="lead">{config.hint}</p><form onSubmit={submit} className="access-form"><input value={code} onChange={e=>setCode(e.target.value)} placeholder="Access code" type="password" autoComplete="off"/><button type="submit">Unlock</button></form>{error&&<p className="access-error">{error}</p>}<p>Customer ordering, route checks, giveaway entry, and public pages do not require this code.</p></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions secure internal access"/></section><style>{`.access-form{display:grid;grid-template-columns:1fr auto;gap:10px;max-width:560px;margin-top:22px}.access-form input{min-width:0;border:1px solid #b8892d;background:#050403;color:#fff7ed;border-radius:999px;padding:14px 16px;font:inherit}.access-form button{border:1px solid #f8e7b0;background:linear-gradient(135deg,#facc15,#a16207);color:#160b04;border-radius:999px;padding:14px 18px;font-weight:900}.access-error{color:#fecaca!important}@media(max-width:760px){.access-form{grid-template-columns:1fr}.access-form button{width:100%}}`}</style></main>
}
