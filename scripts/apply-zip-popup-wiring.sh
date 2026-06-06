#!/usr/bin/env bash
set -euo pipefail

mkdir -p components

cat > components/ZipCodePopup.tsx <<'TSX'
'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const routes: Record<string, { route: string; day: string; window: string }> = {
  '95628': { route: 'Fair Oaks / Carmichael Route', day: 'Tuesday', window: '3-7 PM' },
  '95608': { route: 'Fair Oaks / Carmichael Route', day: 'Tuesday', window: '3-7 PM' },
  '95661': { route: 'Roseville Route', day: 'Wednesday', window: '2-6 PM' },
  '95678': { route: 'Roseville Route', day: 'Wednesday', window: '2-6 PM' },
  '95765': { route: 'Rocklin / Lincoln Route', day: 'Thursday', window: '2-6 PM' },
  '95677': { route: 'Rocklin / Lincoln Route', day: 'Thursday', window: '2-6 PM' },
  '95648': { route: 'Rocklin / Lincoln Route', day: 'Thursday', window: '2-6 PM' },
  '95630': { route: 'Folsom / Orangevale Route', day: 'Friday', window: '2-6 PM' },
  '95662': { route: 'Folsom / Orangevale Route', day: 'Friday', window: '2-6 PM' }
};

function cleanZip(value: string) {
  const match = value.match(/\d{5}/);
  return match ? match[0] : '';
}

export default function ZipCodePopup() {
  const pathname = usePathname() || '/';
  const [open, setOpen] = useState(false);
  const [zip, setZip] = useState('');
  const [checkedZip, setCheckedZip] = useState('');
  const [error, setError] = useState('');

  const internalPage = ['/driver', '/ops', '/reports', '/api'].some((path) => pathname.startsWith(path));
  const dismissedKey = `ccp_zip_dismissed:${pathname}`;
  const route = checkedZip ? routes[checkedZip] : null;

  useEffect(() => {
    if (internalPage) return;
    setCheckedZip('');
    setError('');
    const savedZip = localStorage.getItem('ccp_delivery_zip') || '';
    if (savedZip) setZip(savedZip);
    if (sessionStorage.getItem(dismissedKey) === 'true') return;
    const timer = window.setTimeout(() => setOpen(true), savedZip ? 2600 : 1400);
    return () => window.clearTimeout(timer);
  }, [dismissedKey, internalPage]);

  function closePopup() {
    sessionStorage.setItem(dismissedKey, 'true');
    setOpen(false);
  }

  function checkRoute() {
    const nextZip = cleanZip(zip);
    if (!nextZip) {
      setError('Please enter a valid 5-digit ZIP code.');
      setCheckedZip('');
      return;
    }
    localStorage.setItem('ccp_delivery_zip', nextZip);
    setZip(nextZip);
    setCheckedZip(nextZip);
    setError('');
  }

  function startLead() {
    closePopup();
    window.dispatchEvent(new CustomEvent('ccp:open-lead-capture', { detail: { zip: checkedZip || cleanZip(zip) } }));
  }

  if (internalPage || !open) return null;

  return (
    <div className="zip-overlay" role="dialog" aria-modal="true" aria-labelledby="zip-title">
      <div className="zip-modal">
        <button className="zip-close" onClick={closePopup} aria-label="Close ZIP checker">×</button>
        <p className="eyebrow">Delivery Route Check</p>
        <h2 id="zip-title">Check your ZIP before building your box.</h2>
        <p>See whether your address is already on a weekly Capital City Provisions route.</p>
        <div className="zip-form">
          <input value={zip} onChange={(event) => setZip(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') checkRoute(); if (event.key === 'Escape') closePopup(); }} inputMode="numeric" maxLength={10} placeholder="Enter ZIP code" aria-label="Delivery ZIP code" />
          <button onClick={checkRoute}>Check Route</button>
        </div>
        {error && <p className="zip-error">{error}</p>}
        {checkedZip && (
          <div className={`zip-result ${route ? 'available' : 'waitlist'}`}>
            <h3>{route ? 'Delivery available in your area.' : 'You may be just outside our current route.'}</h3>
            <p>{route ? 'Fresh stock is planned around weekly route days. We will confirm your exact stop before delivery.' : 'You can still request a box. We group nearby customers and confirm new delivery routes as demand builds.'}</p>
            <strong>{route ? route.route : 'Expansion / Waitlist Route'}</strong>
            <span>{route ? `${route.day} · ${route.window}` : 'Next grouped route · To be confirmed'}</span>
            <div className="zip-actions">
              <button onClick={startLead}>{route ? 'Build My Box' : 'Join Route Waitlist'}</button>
              <button className="ghost" onClick={closePopup}>Keep Browsing</button>
            </div>
          </div>
        )}
        {!checkedZip && <button className="zip-secondary" onClick={closePopup}>Skip for now</button>}
      </div>
    </div>
  );
}
TSX

python3 - <<'PY'
from pathlib import Path
p = Path('app/layout.tsx')
s = p.read_text()
if "ZipCodePopup" not in s:
    s = s.replace("import LeadCapture from '../components/LeadCapture';", "import LeadCapture from '../components/LeadCapture';\nimport ZipCodePopup from '../components/ZipCodePopup';")
    s = s.replace('<body><Navbar />{children}<Footer /><LeadCapture /></body>', '<body><Navbar />{children}<Footer /><ZipCodePopup /><LeadCapture /></body>')
p.write_text(s)
PY

python3 - <<'PY'
from pathlib import Path
p = Path('components/LeadCapture.tsx')
s = p.read_text()
s = s.replace("useEffect(()=>{const t=setTimeout(()=>{if(window.matchMedia('(min-width: 900px)').matches)setOpen(true)},1800);return()=>clearTimeout(t)},[]);", "useEffect(()=>{const t=setTimeout(()=>{if(window.matchMedia('(min-width: 900px)').matches&&sessionStorage.getItem('ccp_lead_dismissed')!=='true')setOpen(true)},1800);return()=>clearTimeout(t)},[]);\n  useEffect(()=>{const handler=(event:Event)=>{const detail=(event as CustomEvent<{zip?:string}>).detail;if(detail?.zip){setData(d=>({...d,address:detail.zip||''}));setRoute(routePlan(detail.zip||''));setStep(s=>s===0?1:s)}setOpen(true)};window.addEventListener('ccp:open-lead-capture',handler as EventListener);return()=>window.removeEventListener('ccp:open-lead-capture',handler as EventListener)},[]);")
s = s.replace('<button className="lead-close" onClick={()=>setOpen(false)} aria-label="Close concierge">x</button>', '<button className="lead-close" onClick={()=>{sessionStorage.setItem(\'ccp_lead_dismissed\',\'true\');setOpen(false)}} aria-label="Close concierge">x</button>')
p.write_text(s)
PY

cat >> app/premium.css <<'CSS'

.zip-overlay{position:fixed;inset:0;z-index:58;display:grid;place-items:center;background:rgba(0,0,0,.62);padding:18px}.zip-modal{width:min(520px,calc(100vw - 24px));position:relative;border:1px solid #d4af37;border-radius:26px;background:linear-gradient(180deg,#160b07,#070504);box-shadow:0 30px 100px #000;padding:24px}.zip-close{position:absolute;right:14px;top:14px;width:36px;height:36px;border-radius:50%;border:1px solid #b8892d;background:#090706;color:#f8e7b0;font-weight:900}.zip-modal h2{font-size:clamp(1.55rem,4.6vw,2.45rem);margin-right:34px}.zip-form{display:grid;grid-template-columns:1fr auto;gap:10px;margin-top:18px}.zip-form input{min-width:0;border:1px solid #d4af37;border-radius:16px;background:#090706;color:#fff7ed;padding:14px;font:inherit}.zip-form button,.zip-actions button,.zip-secondary{border:1px solid #d4af37;border-radius:16px;padding:13px 16px;font-weight:900;background:linear-gradient(135deg,#facc15,#a16207);color:#160b04}.zip-error{color:#fecaca}.zip-result{margin-top:18px;border:1px solid #b8892d66;border-radius:20px;background:#090706;padding:16px}.zip-result.available{border-color:#22c55e99}.zip-result.waitlist{border-color:#facc1599}.zip-result h3{margin:.1rem 0 .35rem;color:#f8e7b0}.zip-result strong,.zip-result span{display:block;color:#d4af37;margin-top:8px}.zip-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}.zip-actions .ghost,.zip-secondary{background:#090706;color:#f8e7b0}.zip-secondary{margin-top:16px;width:100%}@media(max-width:620px){.zip-overlay{place-items:end center;padding:12px}.zip-modal{border-radius:24px;padding:20px}.zip-form{grid-template-columns:1fr}.zip-form button,.zip-actions button{width:100%}}
CSS

echo "ZIP popup wiring applied. Run npm run typecheck && npm run build."
