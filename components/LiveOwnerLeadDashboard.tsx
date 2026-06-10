'use client';
import {useEffect,useState} from 'react';
import OwnerLeadDashboard from './OwnerLeadDashboard';

type Props={snapshot:Record<string,any>};

export default function LiveOwnerLeadDashboard({snapshot}:Props){
  const [live,setLive]=useState(snapshot);
  const [status,setStatus]=useState('Loading Postgres-backed owner snapshot...');

  useEffect(()=>{
    const controller=new AbortController();
    async function load(){
      try{
        const response=await fetch('/api/ops/live-snapshot?role=owner',{credentials:'same-origin',signal:controller.signal});
        const result=await response.json();
        if(!response.ok||!result.ok){setStatus(result?.message||'Live owner snapshot unavailable. Using page fallback.');return}
        setLive(result.snapshot||snapshot);
        setStatus(`Owner board loaded from ${result.storage||'live snapshot API'}.`);
      }catch(error:any){if(error?.name!=='AbortError')setStatus('Live owner snapshot unavailable. Using page fallback.');}
    }
    load();
    return()=>controller.abort();
  },[snapshot]);

  return <>
    <section className="section"><article className="marble"><p className="eyebrow">Live source</p><h3>{status}</h3><p>Owner boards hydrate from /api/ops/live-snapshot before falling back to local development memory.</p></article></section>
    <OwnerLeadDashboard snapshot={live}/>
  </>;
}
