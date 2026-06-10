'use client';
import {useEffect,useState} from 'react';
import DatabaseOpsConsole from './DatabaseOpsConsole';

type Props={snapshot:Record<string,any>};

export default function LiveDatabaseOpsConsole({snapshot}:Props){
  const [live,setLive]=useState(snapshot);
  const [status,setStatus]=useState('Loading live owner database snapshot...');
  useEffect(()=>{
    const controller=new AbortController();
    async function load(){
      try{
        const response=await fetch('/api/ops/live-snapshot?role=owner',{credentials:'same-origin',signal:controller.signal});
        const result=await response.json();
        if(!response.ok||!result.ok){setStatus(result?.message||'Live database snapshot unavailable. Using fallback.');return}
        setLive(result.snapshot||snapshot);
        setStatus(`System database loaded from ${result.storage||'live snapshot API'}.`);
      }catch(error:any){if(error?.name!=='AbortError')setStatus('Live database snapshot unavailable. Using fallback.');}
    }
    load();
    return()=>controller.abort();
  },[snapshot]);
  return <><section className="section"><article className="marble"><p className="eyebrow">Live source</p><h3>{status}</h3></article></section><DatabaseOpsConsole snapshot={live}/></>;
}
