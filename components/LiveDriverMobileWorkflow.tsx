'use client';
import {useEffect,useState} from 'react';
import DriverMobileWorkflow from './DriverMobileWorkflow';

type Props={memory:Record<string,any>};

export default function LiveDriverMobileWorkflow({memory}:Props){
  const [live,setLive]=useState(memory);
  const [status,setStatus]=useState('Loading live driver route snapshot...');
  useEffect(()=>{
    const controller=new AbortController();
    async function load(){
      try{
        const name=encodeURIComponent(String(memory.driver||'Driver'));
        const response=await fetch(`/api/ops/live-snapshot?role=driver&driver=${name}`,{credentials:'same-origin',signal:controller.signal});
        const result=await response.json();
        if(!response.ok||!result.ok){setStatus(result?.message||'Live driver snapshot unavailable. Using fallback.');return}
        setLive(result.snapshot||memory);
        setStatus(`Driver route loaded from ${result.storage||'live snapshot API'}.`);
      }catch(error:any){if(error?.name!=='AbortError')setStatus('Live driver snapshot unavailable. Using fallback.');}
    }
    load();
    return()=>controller.abort();
  },[memory]);
  return <><section className="section"><article className="marble"><p className="eyebrow">Live source</p><h3>{status}</h3></article></section><DriverMobileWorkflow memory={live}/></>;
}
