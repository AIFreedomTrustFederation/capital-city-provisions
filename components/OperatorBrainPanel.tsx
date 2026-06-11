'use client';
import {useEffect,useState} from 'react';

type Brain={summary?:string;recommendedActions?:string[];hotZips?:any[];routes?:any[];restockRisks?:any[];salesPriorities?:any[]};
function money(value:number){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value||0)}

export default function OperatorBrainPanel(){
  const [brain,setBrain]=useState<Brain|null>(null);
  const [status,setStatus]=useState('Loading owner operator brain...');
  useEffect(()=>{
    const controller=new AbortController();
    async function load(){
      try{
        const response=await fetch('/api/ops/operator-brain',{credentials:'same-origin',signal:controller.signal});
        const result=await response.json();
        if(!response.ok||!result.ok){setStatus(result?.message||'Operator brain unavailable.');return}
        setBrain(result.brain||null);
        setStatus(`Operator brain loaded from ${result.storage||'live records'}.`);
      }catch(error:any){if(error?.name!=='AbortError')setStatus('Operator brain unavailable.');}
    }
    load();
    return()=>controller.abort();
  },[]);
  const actions=brain?.recommendedActions||[];
  return <section className="section operator-brain" id="operator-brain">
    <div className="owner-board-head"><div><p className="eyebrow">Operator Brain</p><h2>What should we do first today?</h2><p>{status}</p></div></div>
    <div className="brain-summary marble"><h3>{brain?.summary||'Waiting for live demand signals.'}</h3><p>The brain reads live orders, route signals, restock issues, driver sales leads, and owner reports before making recommendations.</p></div>
    <div className="route-list ops-cards brain-grid">
      <article><p className="eyebrow">Recommended Actions</p>{actions.length?actions.map(action=><p key={action}>{action}</p>):<p>No live actions yet. Create the first live order or driver sales lead.</p>}</article>
      <article><p className="eyebrow">ZIP Heat</p>{(brain?.hotZips||[]).length?(brain?.hotZips||[]).slice(0,5).map(zip=><p key={zip.zip}><strong>{zip.zip}</strong> — {zip.orders} order(s), {zip.leads} lead(s), {money(zip.value)}</p>):<p>No ZIP heat yet.</p>}</article>
      <article><p className="eyebrow">Route Focus</p>{(brain?.routes||[]).length?(brain?.routes||[]).slice(0,5).map(route=><p key={route.routeId}><strong>{route.routeId}</strong> — {route.nextAction}</p>):<p>No active route focus yet.</p>}</article>
      <article><p className="eyebrow">Restock Risk</p>{(brain?.restockRisks||[]).length?(brain?.restockRisks||[]).slice(0,5).map(risk=><p key={risk.product}><strong>{risk.product}</strong> — {risk.reason}</p>):<p>No restock risk yet.</p>}</article>
      <article><p className="eyebrow">Sales Priorities</p>{(brain?.salesPriorities||[]).length?(brain?.salesPriorities||[]).slice(0,5).map(lead=><p key={lead.id||lead.leadName}><strong>{lead.leadName||'Lead'}</strong> — {money(lead.estimatedValue)}. {lead.nextAction}</p>):<p>No driver sales priorities yet.</p>}</article>
    </div>
    <style>{`.operator-brain .brain-summary{margin-bottom:18px}.operator-brain .brain-summary h3{font-size:clamp(1.4rem,3vw,2.4rem);margin:0 0 8px}.brain-grid article{min-height:180px}.brain-grid p strong{color:#f8e7b0}`}</style>
  </section>
}
