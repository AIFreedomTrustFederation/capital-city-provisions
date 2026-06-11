'use client';
import {useEffect,useState} from 'react';

export default function DriverSetupAI(){
  const [displayName,setDisplayName]=useState('Driver');
  const [email,setEmail]=useState('');
  const [department,setDepartment]=useState('delivery');
  const [notice,setNotice]=useState('');
  useEffect(()=>{try{const saved=localStorage.getItem('ccp_setup_driver');if(saved){const data=JSON.parse(saved);setDisplayName(data.displayName||'Driver');setEmail(data.preferredSenderEmail||'');setDepartment(data.defaultDepartment||'delivery')}}catch{}},[]);
  function save(){localStorage.setItem('ccp_setup_driver',JSON.stringify({displayName,preferredSenderEmail:email,defaultDepartment:department,backupRoute:`aifreedomtrust+ccp-${department}@gmail.com`,setupComplete:true,updatedAt:new Date().toISOString()}));setNotice('Driver setup saved.');}
  return <section className="section" id="driver-setup-ai"><div className="owner-board-head"><div><p className="eyebrow">Driver Setup AI</p><h2>Prepare the route-day workspace.</h2><p>Confirm the driver name, sending address, and default department before route work begins.</p></div></div><div className="turnin-form marble"><input value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="Driver display name"/><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Preferred sending email"/><select value={department} onChange={e=>setDepartment(e.target.value)}><option value="delivery">delivery</option><option value="sales">sales</option><option value="support">support</option></select><button type="button" onClick={save}>Save Driver Setup</button></div>{notice&&<p className="sales-save-notice">{notice}</p>}</section>
}
