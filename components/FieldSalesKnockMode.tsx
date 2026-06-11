'use client';
import {useState} from 'react';
import {zipZone} from '../lib/zip-zone';

type KnockStatus='not-home'|'not-interested'|'warm'|'hot'|'reserved'|'follow-up';
type FormState={rep:string;name:string;phone:string;email:string;address:string;zip:string;household:string;need:string;offer:string;value:string;status:KnockStatus;note:string;callback:string};

const defaultForm:FormState={rep:'Field Rep',name:'',phone:'',email:'',address:'',zip:'',household:'',need:'Freezer box interest',offer:'Door-to-door freezer-box follow-up',value:'0',status:'warm',note:'',callback:''};
const CONTACT_REQUIRED_STATUSES:KnockStatus[]=['warm','hot','reserved','follow-up'];
function money(value:number){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value||0)}
function cleanZip(value:string){return (value.match(/\d{5}/)?.[0]||'').trim()}
function scriptFor(status:KnockStatus,zip:string){const zone=zipZone(zip);if(status==='not-home')return 'Leave a door hanger only where allowed. Do not imply an order was placed. Mark no contact.';if(status==='not-interested')return 'Thank them, step away cleanly, and do not argue. Mark no interest.';if(zone.status==='manual-review')return 'Keep it honest: this ZIP needs route review before any delivery promise. Capture contact only if they request follow-up.';if(zone.status==='edge-route')return 'Explain this is a one-hour edge area. Grouped demand must be confirmed before dispatch.';return 'Simple pitch: We fill freezers with premium proteins, confirm the route before anything is locked in, and keep giveaway entry separate from purchases.'}

export default function FieldSalesKnockMode(){
  const [form,setForm]=useState<FormState>(defaultForm);
  const [notice,setNotice]=useState('');
  const [saving,setSaving]=useState(false);
  const zip=cleanZip(form.zip||form.address);
  const zone=zipZone(zip);
  const estimatedValue=Number(form.value||0);
  async function saveLead(){
    if(!form.name&&form.status!=='not-home'){setNotice('Add a name or mark the door as not-home before saving.');return}
    if(!form.phone&&!form.email&&CONTACT_REQUIRED_STATUSES.includes(form.status)){setNotice('Warm and hot leads need a phone or email before saving.');return}
    setSaving(true);setNotice('Saving field sales lead...');
    const salesStatus=form.status==='reserved'?'reserved':form.status==='hot'?'pitched':form.status==='warm'||form.status==='follow-up'?'queued':'skipped';
    try{
      const response=await fetch('/api/ops/driver-sales',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:`KNOCK-${Date.now()}`,driver:form.rep||'Field Rep',sourceStopId:'door-to-door',sourceCustomer:'cold-knock',routeId:`field-${zone.ring||'unknown'}`,leadName:form.name||`Door ${zip||'unknown'}`,email:form.email,phone:form.phone,address:form.address,zip,area:zone.city||form.address||zip,need:form.need,offer:form.offer,estimatedValue,status:salesStatus,temperature:form.status==='hot'||form.status==='reserved'?'hot':form.status==='warm'||form.status==='follow-up'?'warm':'watch',note:[form.note,form.callback?`Callback: ${form.callback}`:'',`Knock status: ${form.status}`,zone.message].filter(Boolean).join(' | '),deliveryZoneStatus:zone.status,deliveryZoneCity:zone.city,deliveryZoneCounty:zone.county,deliveryZoneRing:zone.ring,deliveryZoneMinutes:zone.minutes,deliveryZonePriority:zone.priority,deliveryZoneMessage:zone.message,deliveryZoneNotes:zone.notes,driverRoutePlan:scriptFor(form.status,zip)})});
      const result=await response.json();
      if(!response.ok||!result.ok)throw new Error(result?.message||'Save failed');
      setNotice(`${form.name||'Door'} saved to live field sales queue as ${salesStatus}.`);
      setForm(defaultForm);
    }catch(error){setNotice('Saved on phone only failed. Try again before leaving the block.');}
    finally{setSaving(false)}
  }
  return <section className="section field-sales-mode" id="field-sales-knock">
    <div className="sales-app-shell">
      <div className="sales-phone-top"><div><p className="eyebrow">Field Sales</p><h2>Cold door-to-door knock capture.</h2></div><div className="live-pill">ZIP aware</div></div>
      <div className="sales-hero-board"><article><p className="eyebrow">ZIP Zone</p><h3>{zip||'Enter ZIP'}</h3><p>{zone.message}</p><strong>{zone.status} · {zone.ring} · {zone.minutes??'manual'} min</strong></article><article><p className="eyebrow">Pitch Guardrail</p><h3>Promise nothing early.</h3><p>Confirm route, timing, and product availability before locking any order.</p></article><article><p className="eyebrow">Value</p><h3>{money(estimatedValue)}</h3><p>Estimated freezer-box opportunity.</p></article></div>
      <div className="sales-work-grid"><div className="lead-capture-card"><input value={form.rep} onChange={e=>setForm({...form,rep:e.target.value})} placeholder="Rep name"/><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Lead name"/><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone"/><input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email"/><input value={form.address} onChange={e=>setForm({...form,address:e.target.value})} placeholder="Street / apartment note"/><input value={form.zip} onChange={e=>setForm({...form,zip:e.target.value})} placeholder="ZIP"/><input value={form.household} onChange={e=>setForm({...form,household:e.target.value})} placeholder="Household size"/><input value={form.need} onChange={e=>setForm({...form,need:e.target.value})} placeholder="Need"/><input value={form.offer} onChange={e=>setForm({...form,offer:e.target.value})} placeholder="Offer"/><input value={form.value} onChange={e=>setForm({...form,value:e.target.value})} placeholder="Estimated value"/><select value={form.status} onChange={e=>setForm({...form,status:e.target.value as KnockStatus})}><option value="not-home">Not home</option><option value="not-interested">Not interested</option><option value="warm">Warm</option><option value="hot">Hot</option><option value="reserved">Reserved</option><option value="follow-up">Follow-up</option></select><input value={form.callback} onChange={e=>setForm({...form,callback:e.target.value})} placeholder="Callback time"/><textarea value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="Real conversation note"/><button onClick={saveLead} disabled={saving}>{saving?'Saving...':'Save Door Knock'}</button></div>
        <aside className="sales-ai-panel"><p className="eyebrow">Door Script</p><h3>{form.status}</h3><p>{scriptFor(form.status,zip)}</p><p><strong>Compliance:</strong> no false scarcity, no pressure, no giveaway odds tied to purchase, no delivery promise outside confirmed route.</p>{notice&&<p className="sales-save-notice">{notice}</p>}</aside></div>
    </div>
  </section>
}
