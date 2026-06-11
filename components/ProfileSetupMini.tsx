'use client';
import {useEffect,useState} from 'react';
export default function ProfileSetupMini(){
  const [displayName,setDisplayName]=useState('');
  const [notice,setNotice]=useState('Loading...');
  useEffect(()=>{fetch('/api/setup/profile',{credentials:'same-origin'}).then(r=>r.json()).then(data=>{setDisplayName(data?.profile?.displayName||'');setNotice('')}).catch(()=>setNotice('Unavailable'))},[]);
  async function save(){const data=await fetch('/api/setup/profile',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({displayName,setupComplete:true})}).then(r=>r.json()).catch(()=>null);setNotice(data?.ok?'Saved.':'Save failed.');}
  return <section className="section" id="profile-setup"><p className="eyebrow">Setup Profile</p><h2>Confirm this workspace.</h2><div className="turnin-form marble"><input value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="Display name"/><button type="button" onClick={save}>Save Setup</button></div>{notice&&<p className="sales-save-notice">{notice}</p>}</section>
}
