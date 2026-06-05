'use client';
import {useEffect,useState} from 'react';

export default function LeadCapture(){
  const [open,setOpen]=useState(false);
  const [light,setLight]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setOpen(true),1800);return()=>clearTimeout(t)},[]);
  useEffect(()=>{document.body.classList.toggle('light-mode',light)},[light]);
  return <>
    <button className="theme-toggle" onClick={()=>setLight(!light)}>{light?'Luxury Dark':'Clean Light'}</button>
    <button className="lead-tab" onClick={()=>setOpen(true)}>Reserve Box</button>
    {open&&<div className="lead-overlay" role="dialog" aria-modal="true"><div className="lead-modal">
      <button className="lead-close" onClick={()=>setOpen(false)}>×</button>
      <p className="eyebrow">Early Access</p>
      <h2>Reserve your first freezer box.</h2>
      <p>Get launch availability, route updates, and early freezer-box pricing.</p>
      <form action="mailto:orders@capitalcityprovisions.com" method="post" encType="text/plain">
        <input name="name" placeholder="Full name" required />
        <input name="email" type="email" placeholder="Email address" required />
        <input name="phone" type="tel" placeholder="Phone number" />
        <input name="address" placeholder="Delivery address or ZIP code" />
        <select name="interest" defaultValue="">
          <option value="" disabled>Interested in...</option>
          <option>Family Freezer Box</option>
          <option>Steak Lovers Club</option>
          <option>Surf & Turf Club</option>
          <option>Wholesale Account</option>
        </select>
        <button type="submit">Reserve My Spot</button>
      </form>
    </div></div>}
  </>
}
