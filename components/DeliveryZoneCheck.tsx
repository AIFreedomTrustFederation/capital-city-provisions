'use client';
import {useState} from 'react';

type ZoneResult={ok?:boolean;zip?:string;deliveryZone?:any;coverage?:{status:string;headline:string;message:string};hub?:any};

export default function DeliveryZoneCheck(){
  const [zip,setZip]=useState('');
  const [result,setResult]=useState<ZoneResult|null>(null);
  const [loading,setLoading]=useState(false);
  async function check(e:React.FormEvent){
    e.preventDefault();
    const clean=zip.replace(/\D/g,'').slice(0,5);
    if(clean.length!==5){setResult({coverage:{status:'unknown',headline:'Enter a 5-digit ZIP code.',message:'We need a full ZIP code to check the Rancho Cordova delivery zone.'}});return}
    setLoading(true);
    try{
      const response=await fetch(`/api/delivery-zone?zip=${encodeURIComponent(clean)}`);
      const data=await response.json();
      setResult(data);
    }catch(error){
      setResult({coverage:{status:'unknown',headline:'ZIP check is unavailable right now.',message:'Please leave your ZIP and we will manually confirm the route.'}});
    }finally{setLoading(false)}
  }
  const status=result?.coverage?.status||'';
  const cta=status==='manual-review'?'Join Route Request':'Continue With Freezer Box';
  const href=status==='manual-review'?'/contact':'/freezer-boxes';
  return <section className="section delivery-zone-check" id="delivery-zone-check">
    <article className="marble">
      <p className="eyebrow">Delivery Zone Check</p>
      <h2>Check your ZIP from our Rancho Cordova route hub.</h2>
      <p>We map delivery from Rancho Cordova 95670 and group freezer-box orders by nearby ZIPs so routes stay efficient.</p>
      <form onSubmit={check} className="zone-form"><input value={zip} onChange={event=>setZip(event.target.value)} inputMode="numeric" pattern="[0-9]*" maxLength={5} placeholder="Enter ZIP code"/><button type="submit" disabled={loading}>{loading?'Checking...':'Check ZIP'}</button></form>
      {result?.coverage&&<div className={`zone-result ${status}`}><h3>{result.coverage.headline}</h3><p>{result.coverage.message}</p>{result.deliveryZone&&<small>{result.deliveryZone.ring} route · about {result.deliveryZone.minutes} minutes · {result.deliveryZone.notes}</small>}<div className="actions"><a href={href}>{cta}</a><a href="/delivery-map">See Delivery Areas</a></div></div>}
    </article>
    <style>{`.delivery-zone-check .zone-form{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}.delivery-zone-check input{flex:1;min-width:180px;border:1px solid #b8892d;border-radius:999px;background:#050403;color:#fff7ed;padding:13px 16px}.delivery-zone-check button,.delivery-zone-check a{border:0;border-radius:999px;background:#f8d16a;color:#120c05;padding:13px 18px;font-weight:800;text-decoration:none}.zone-result{margin-top:18px;border:1px solid rgba(248,209,106,.35);border-radius:18px;padding:16px;background:rgba(248,209,106,.08)}.zone-result h3{margin:0 0 8px}.zone-result small{display:block;color:#f8e7b0;margin-top:8px}.zone-result .actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}.zone-result.manual-review{border-color:rgba(255,160,122,.55)}`}</style>
  </section>
}
