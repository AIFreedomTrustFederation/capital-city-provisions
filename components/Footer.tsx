'use client';
import {useEffect,useState} from 'react';

const sections=[
  {title:'Shop',links:[['Meat Boxes','/freezer-boxes'],['Family Freezer Boxes','/family-freezer-boxes'],['Steak Delivery','/steak-delivery'],['Menu','/menu'],['Restock Club','/food-security-freezer-boxes']]},
  {title:'Customers',links:[['How Delivery Works','/how-delivery-works'],['Delivery Areas','/delivery-map'],['Customer Concierge','/customer-concierge'],['Customer Portal','/customer'],['Reviews','/reviews'],['Contact Support','/contact']]},
  {title:'Business',links:[['Wholesale','/wholesale'],['Affiliate Suppliers','/affiliate-suppliers'],['Driver Network','/drivers'],['Catering Partners','/catering-partners'],['Vendor Intake','/vendor-intake'],['Route Partnerships','/route-partnerships']]},
  {title:'Company',links:[['About','/about'],['Team','/team'],['Service Areas','/delivery-map'],['Food Security Mission','/food-security-freezer-boxes'],['AIFT Research','https://aifreedomtrustfederation.github.io/AI-Freedom-Trust/docs/aetherion-flight-paper-post-quantum-sovereign-network.md'],['Contact','/contact']]},
  {title:'Legal',links:[['Privacy Policy','/privacy'],['Terms of Service','/terms'],['Refund Policy','/refund-policy'],['Official Rules','/official-rules'],['SMS Terms','/sms-terms'],['Accessibility','/accessibility']]}
];

const badges=['LLC Operated','Freezer-Ready Packaging','Local Route Delivery','Supplier Network','Customer Concierge','Secure Payment Path'];

export default function Footer(){
  const [open,setOpen]=useState<Record<string,boolean>>({});
  useEffect(()=>{const desktop=window.matchMedia('(min-width: 761px)');const sync=()=>setOpen(Object.fromEntries(sections.map(section=>[section.title,desktop.matches])));sync();desktop.addEventListener('change',sync);return()=>desktop.removeEventListener('change',sync)},[]);
  return <footer className="footer corporate-footer">
    <div className="footer-inner">
      <section className="footer-brand" aria-label="Capital City Provisions summary">
        <p className="footer-logo">Capital City Provisions, LLC</p>
        <p>Premium freezer provisions, local delivery coordination, and stocked-home food solutions for families, events, and community routes.</p>
        <div className="footer-badges" aria-label="Trust highlights">{badges.map(badge=><span key={badge}>{badge}</span>)}</div>
      </section>
      <nav className="footer-grid" aria-label="Footer navigation">{sections.map(section=><section className={open[section.title]?'footer-column open':'footer-column'} key={section.title} aria-label={section.title}><button className="footer-heading" onClick={()=>setOpen(current=>({...current,[section.title]:!current[section.title]}))} aria-expanded={!!open[section.title]}>{section.title}<span aria-hidden="true">+</span></button><ul>{section.links.map(([label,href])=><li key={href}><a href={href} {...(href.startsWith('http')?{target:'_blank',rel:'noopener noreferrer'}:{})}>{label}</a></li>)}</ul></section>)}</nav>
      <section className="partner-network" aria-label="Partner network notice"><strong>Partner Network</strong><p>Capital City Provisions works with approved suppliers, delivery partners, route support teams, customer service representatives, and local business affiliates to provide freezer-ready provisions and coordinated local delivery support. Partner participation does not imply ownership, employment, agency, franchise, or endorsement unless expressly stated in writing by Capital City Provisions, LLC.</p></section>
      <section className="footer-legal" aria-label="Copyright notice"><p>Copyright 2026 Capital City Provisions, LLC. All rights reserved.</p><p>Capital City Provisions, CCP, associated trade dress, website content, photography, graphics, copy, promotional materials, ordering workflows, route systems, and brand assets are owned by Capital City Provisions, LLC or used under license. Unauthorized use, reproduction, scraping, resale, or redistribution is prohibited.</p></section>
    </div>
    <style>{`
      .corporate-footer{margin-top:18px;background:linear-gradient(180deg,#080604,#050403);border-top:1px solid rgba(226,201,143,.28);color:#fff4df}
      .corporate-footer .footer-inner{width:min(1180px,calc(100% - 24px));margin:0 auto;padding:2rem 0 1.4rem;display:grid;gap:1.25rem}
      .corporate-footer .footer-brand{display:grid;gap:.75rem;padding:1.25rem;border:1px solid rgba(226,201,143,.22);border-radius:24px;background:radial-gradient(circle at 80% 0%,rgba(226,201,143,.14),transparent 12rem),linear-gradient(135deg,#15110d,#080604)}
      .corporate-footer .footer-logo{margin:0;font-family:Georgia,'Times New Roman',serif;font-size:clamp(1.7rem,4vw,2.6rem);line-height:.95;color:#fff4df;letter-spacing:-.045em}
      .corporate-footer p{margin:0;color:#d8c9ad;line-height:1.55}.footer-badges{display:flex;flex-wrap:wrap;gap:.45rem}.footer-badges span{border:1px solid rgba(226,201,143,.28);border-radius:999px;background:rgba(255,244,223,.05);color:#e2c98f;padding:.42rem .62rem;font-size:.72rem;font-weight:900;text-transform:uppercase;letter-spacing:.05em}
      .corporate-footer .footer-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:.75rem}.corporate-footer .footer-column{border:1px solid rgba(226,201,143,.16);border-radius:18px;background:#0b0806;overflow:hidden}.corporate-footer .footer-heading{width:100%;display:flex;align-items:center;justify-content:space-between;gap:.5rem;background:transparent;border:0;color:#e2c98f;padding:.9rem 1rem;font-weight:950;text-transform:uppercase;letter-spacing:.08em;cursor:pointer}.corporate-footer .footer-heading span{display:none}.corporate-footer ul{list-style:none;margin:0;padding:0 1rem 1rem;display:grid;gap:.5rem}.corporate-footer li{margin:0}.corporate-footer a{color:#fff4df;text-decoration:none;font-size:.9rem}.corporate-footer a:hover{color:#e2c98f}.partner-network,.footer-legal{border:1px solid rgba(226,201,143,.16);border-radius:18px;background:rgba(255,244,223,.035);padding:1rem}.partner-network strong{display:block;color:#e2c98f;margin-bottom:.35rem;text-transform:uppercase;letter-spacing:.08em}.footer-legal{display:grid;gap:.55rem}.footer-legal p:first-child{color:#fff4df;font-weight:900}.footer-legal p:last-child{font-size:.78rem;color:#b9ab97}
      @media(max-width:760px){.corporate-footer .footer-inner{width:calc(100% - 18px);padding:1rem 0 1.2rem;gap:.8rem}.corporate-footer .footer-brand{padding:1rem;border-radius:20px}.corporate-footer .footer-logo{font-size:1.65rem}.footer-badges span:nth-child(n+4){display:none}.corporate-footer .footer-grid{grid-template-columns:1fr;gap:.45rem}.corporate-footer .footer-column{border-radius:16px}.corporate-footer .footer-heading{padding:.78rem .9rem}.corporate-footer .footer-heading span{display:block;transition:transform .18s ease}.corporate-footer .footer-column.open .footer-heading span{transform:rotate(45deg)}.corporate-footer .footer-column ul{display:none;padding:.1rem .9rem .85rem}.corporate-footer .footer-column.open ul{display:grid}.corporate-footer a{font-size:.88rem}.partner-network,.footer-legal{padding:.9rem;border-radius:16px}.partner-network p{font-size:.82rem}.footer-legal p:last-child{font-size:.72rem;line-height:1.45}}
    `}</style>
  </footer>
}
