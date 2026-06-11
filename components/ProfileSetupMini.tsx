'use client';
import {useEffect,useState} from 'react';
const departments=['sales','billing','delivery','support','owner'];
const route=(d:string)=>['aifreedomtrust','+ccp-',d,'@gmail.com'].join('');
export default function ProfileSetupMini(){
  const [form,setForm]=useState({displayName:'',preferredSenderEmail:'',defaultDepartment:'support',backupRoute:route('support'),setupComplete:false});
  const [notice,setNotice]=useState('Loading...');
  useEffect(()=>{fetch('/api/setup/profile',{credentials:'same-origin'}).then(r=>r.json()).then(data=>{if(data?.profile)setForm(current=>({...current,...data.profile}));setNotice('')}).catch(()=>setNotice('Unavailable'))},[]);
  async function save(){const data=await fetch('/api/setup/profile',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,setupComplete:true})}).then(r=>r.json()).catch(()=>null);setNotice(data?.ok?`Saved to ${data.storage}.`:'Save failed.');}
  return <section className="section" id="profile-setup"><p className="eyebrow">Setup Profile</p><h2>Confirm this workspace.</h2><div className="turnin-form marble"><input value={form.displayName} onChange={e=>setForm({...form,displayName:e.target.value})} placeholder="Display name"/><input value={form.preferredSenderEmail} onChange={e=>setForm({...form,preferredSenderEmail:e.target.value})} placeholder="Preferred email"/><select value={form.defaultDepartment} onChange={e=>setForm({...form,defaultDepartment:e.target.value,backupRoute:route(e.target.value)})}>{departments.map(d=><option key={d} value={d}>{d}</option>)}</select><input value={form.backupRoute} onChange={e=>setForm({...form,backupRoute:e.target.value})} placeholder="Backup route"/><button type="button" onClick={save}>Save Setup</button></div>{notice&&<p className="sales-save-notice">{notice}</p>}</section>
}
