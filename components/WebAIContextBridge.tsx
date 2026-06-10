'use client';
import {useEffect,useMemo,useState} from 'react';
import LocalAIConcierge from './LocalAIConcierge';

type Role='customer'|'driver'|'owner';
type PromptButton={label:string;prompt:string};
type Props={context?:Record<string,any>;role?:Role;title?:string;intro?:string;initialPrompt?:string;prompts?:PromptButton[];zip?:string;driver?:string;showStatus?:boolean};

function mergeContext(base:Record<string,any>,apiContext:Record<string,any>|null,role:Role,status:string){
  return {role,contextSource:apiContext?'api/ai/context':'page-fallback',contextStatus:status,...base,...(apiContext||{}),memory:{...(base.memory||{}),...(apiContext||{})}};
}

export default function WebAIContextBridge({context={},role='customer',title,intro,initialPrompt,prompts,zip,driver,showStatus=true}:Props){
  const [apiContext,setApiContext]=useState<Record<string,any>|null>(null);
  const [status,setStatus]=useState('Loading role-safe WebAI context...');

  useEffect(()=>{
    const controller=new AbortController();
    async function loadContext(){
      const params=new URLSearchParams({role});
      const resolvedZip=zip||context.zip||context.lead?.zip||context.lead?.address||context.route?.zip||'';
      const resolvedDriver=driver||context.driver||context.memory?.driver||'Driver';
      if(role==='customer'&&resolvedZip)params.set('zip',String(resolvedZip));
      if(role==='driver')params.set('driver',String(resolvedDriver));
      try{
        const response=await fetch(`/api/ai/context?${params.toString()}`,{credentials:'same-origin',signal:controller.signal});
        const result=await response.json();
        if(!response.ok||!result.ok){setApiContext(null);setStatus(result?.message||'Role-safe context unavailable. Using page fallback.');return}
        setApiContext(result.context||{});setStatus(`WebAI context loaded from ${result.storage||'role-safe context API'}.`);
      }catch(error:any){
        if(error?.name==='AbortError')return;
        setApiContext(null);setStatus('Role-safe context could not load. Using page fallback.');
      }
    }
    loadContext();
    return()=>controller.abort();
  },[role,zip,driver,context]);

  const merged=useMemo(()=>mergeContext(context,apiContext,role,status),[context,apiContext,role,status]);

  return <>
    {showStatus&&<div className="ai-context-status"><span>{apiContext?'Role-safe live context':'Fallback context'}</span><p>{status}</p></div>}
    <LocalAIConcierge role={role} context={merged} title={title} intro={intro} initialPrompt={initialPrompt} prompts={prompts}/>
    <style>{`.ai-context-status{border:1px solid #b8892d66;border-radius:16px;padding:10px;margin-bottom:12px;background:#050403}.ai-context-status span{color:#d4af37;font-weight:900}.ai-context-status p{margin:4px 0 0!important;font-size:.9rem!important}`}</style>
  </>;
}
