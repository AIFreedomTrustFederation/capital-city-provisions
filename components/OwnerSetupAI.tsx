'use client';
import {useEffect,useState} from 'react';

const departments=['sales','billing','delivery','support','owner'];

export default function OwnerSetupAI(){
  const [form,setForm]=useState({displayName:'Owner',preferredSenderEmail:'',defaultDepartment:'owner',backupRoute:'aifreedomtrust+ccp-owner@gmail.com',setupComplete:false});
  const [notice,setNotice]=useState('');
  useEffect(()=>{try{const saved=localStorage.getItem('ccp_setup_owner');if(saved)setForm({...form,...JSON.parse(saved)})}catch{}},[]);
  function save(){localStorage.setItem('ccp_setup_owner',JSON.stringify({...form,setupComplete:true,updatedAt:new Date().toISOString()}));setForm({...form,setupComplete:true});setNotice('Owner setup saved for this workspace.');}
  return <section className="section setup-ai-card" id="owner-setup-ai"><div className="owner-board-head"><div><p className="eyebrow">Owner Setup AI</p><h2>Finish the control-room setup.</h2><p>Confirm identity, department routing, and backup handling before using Owner AI.</p></div><strong>{form.setupComplete?'Complete':'Needs setup'}</strong></div><div className="turnin-form marble"><input value={form.displayName} onChange={e=>setForm({...form,displayName:e.target.value})} placeholder="Owner display name"/><input value={form.preferredSenderEmail} onChange={e=>setForm({...form,preferredSenderEmail:e.target.value})} placeholder="Preferred sending email"/><select value={form.defaultDepartment} onChange={e=>setForm({...form,defaultDepartment:e.target.value,backupRoute:`aifreedomtrust+ccp-${e.target.value}@gmail.com`})}>{departments.map(d=><option key={d} value={d}>{d}</option>)}</select><input value={form.backupRoute} onChange={e=>setForm({...form,backupRoute:e.target.value})} placeholder="Backup route"/><button type="button" onClick={save}>Save Owner Setup</button></div>{notice&&<p className="sales-save-notice">{notice}</p>}</section>
}
