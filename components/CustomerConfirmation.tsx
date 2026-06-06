'use client';
import {useEffect,useMemo,useState} from 'react';

const LATEST_LEAD_KEY='ccp_latest_lead';
const ZIP_STORAGE_KEY='ccp_delivery_zip';

type SavedLead=Record<string,string>;

function loadSavedLead(){try{return JSON.parse(localStorage.getItem(LATEST_LEAD_KEY)||'{}') as SavedLead}catch(error){return {}}}
function maskContact(value=''){if(!value)return 'Not saved';if(value.includes('@')){const [name,domain]=value.split('@');return `${name.slice(0,2)}***@${domain||''}`}return value.replace(/\d(?=\d{2})/g,'*')}
function clean(value:any,fallback='Not saved'){return String(value||'').trim()||fallback}
function buildSummary(saved:SavedLead){return [{label:'ZIP',value:clean(saved.zip||saved.address)},{label:'Plan',value:clean(saved.recommendation||saved.interest)},{label:'Budget',value:clean(saved.estimatedBudget||saved.budget)},{label:'Route',value:clean(saved.route)},{label:'Delivery',value:`${clean(saved.deliveryDay,'TBD')} ${clean(saved.deliveryWindow,'')}`.trim()},{label:'Contact',value:maskContact(saved.phone||saved.email)}]}

export default function CustomerConfirmation(){
  const [saved,setSaved]=useState<SavedLead>({});
  const [notice,setNotice]=useState('');
  useEffect(()=>{setSaved(loadSavedLead())},[]);
  const hasSaved=Object.keys(saved).length>0;
  const summary=useMemo(()=>buildSummary(saved),[saved]);
  function continueBox(){window.dispatchEvent(new CustomEvent('ccp:open-lead'));setNotice('Box Concierge opened. Your saved details stay on this device.');}
  function editDetails(){window.dispatchEvent(new CustomEvent('ccp:open-lead'));setNotice('Open the concierge to update your details.');}
  function clearSaved(){localStorage.removeItem(LATEST_LEAD_KEY);localStorage.removeItem(ZIP_STORAGE_KEY);document.cookie='ccp_customer_saved=; max-age=0; path=/; SameSite=Lax';setSaved({});setNotice('Saved customer details cleared from this device.');}
  function saveBackup(){const blob=new Blob([JSON.stringify({savedAt:new Date().toISOString(),lead:saved},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='capital-city-box-request.json';link.click();URL.revokeObjectURL(url);setNotice('A local copy was exported. Nothing was sent to an external AI service.');}

  return <section className="section confirmation-panel" id="saved-confirmation">
    <div><p className="eyebrow">Saved Confirmation</p><h2>{hasSaved?'Your plan is saved on this device.':'Ready when you are.'}</h2><p className="lead">Use this page to resume, edit, or clear your stocked-home request. The concierge will not reopen unless you choose it.</p></div>
    {hasSaved?<div className="confirmation-grid">{summary.map(item=><article key={item.label}><span>{item.label}</span><strong>{item.value}</strong></article>)}</div>:<article className="confirmation-empty marble"><h3>No saved request found.</h3><p>Start with a ZIP check or build a box, then this page will show the saved plan summary when you return.</p></article>}
    <div className="confirmation-actions"><button onClick={continueBox}>{hasSaved?'Continue My Box':'Build My Box'}</button><button onClick={editDetails}>Edit Details</button>{hasSaved&&<button onClick={saveBackup}>Export Local Copy</button>}{hasSaved&&<button className="quiet" onClick={clearSaved}>Clear Saved Info</button>}<a href="/giveaway">Enter Giveaway Free</a><a href="/how-delivery-works">Delivery Steps</a></div>
    {notice&&<p className="confirmation-notice">{notice}</p>}
    <style>{`.confirmation-panel{display:grid;gap:18px}.confirmation-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.confirmation-grid article,.confirmation-empty{border:1px solid #b8892d66;border-radius:18px;background:#080605;padding:16px}.confirmation-grid span{display:block;color:#ded2bd;font-weight:800}.confirmation-grid strong{display:block;color:#f8e7b0;font-size:1.15rem;margin-top:5px}.confirmation-actions{display:flex;flex-wrap:wrap;gap:10px}.confirmation-actions button,.confirmation-actions a{border:1px solid #f8e7b0;background:linear-gradient(135deg,#facc15,#a16207);color:#160b04;border-radius:999px;padding:12px 15px;font-weight:900;text-decoration:none}.confirmation-actions .quiet{background:#080605;color:#f8e7b0;border-color:#d4af37}.confirmation-empty h3{margin:0;color:#f8e7b0}.confirmation-notice{color:#f8e7b0!important;font-weight:900}.light-mode .confirmation-grid article,.light-mode .confirmation-empty{background:#fff9ec;border-color:#9a6a12}.light-mode .confirmation-grid span,.light-mode .confirmation-empty p{color:#4a3321}.light-mode .confirmation-grid strong,.light-mode .confirmation-empty h3{color:#1f1308}@media(max-width:760px){.confirmation-grid{grid-template-columns:1fr}.confirmation-actions{display:grid}.confirmation-actions button,.confirmation-actions a{text-align:center;width:100%}}`}</style>
  </section>
}
