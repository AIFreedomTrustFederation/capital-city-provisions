'use client';
import {useEffect,useState} from 'react';

const sections=[
  {
    title:'Shop By Need',
    links:[
      ['Home Stock Boxes','/freezer-boxes'],
      ['Family Boxes','/family-freezer-boxes'],
      ['Steak Delivery','/steak-delivery'],
      ['Prepared Households','/food-security-freezer-boxes']
    ]
  },
  {
    title:'Delivery',
    links:[
      ['How It Works','/how-delivery-works'],
      ['Delivery Areas','/delivery-map'],
      ['Meat Delivery Sacramento','/meat-delivery-sacramento'],
      ['Beef Delivery Sacramento','/beef-delivery-sacramento']
    ]
  },
  {
    title:'Business',
    links:[
      ['Wholesale Supply','/wholesale'],
      ['Wholesale Sacramento','/wholesale-meat-supplier-sacramento'],
      ['Contact Wholesale','/contact']
    ]
  },
  {
    title:'Help',
    links:[
      ['About','/about'],
      ['Reviews','/reviews'],
      ['FAQ','/faq'],
      ['Contact','/contact']
    ]
  },
  {
    title:'Promotions',
    links:[
      ['Freezer Giveaway','/giveaway'],
      ['Official Rules','/official-rules'],
      ['Box Concierge','/customer-concierge']
    ]
  },
  {
    title:'Team Access',
    links:[
      ['Driver Gate','/internal-access?role=driver&returnTo=/driver'],
      ['Owner Gate','/internal-access?role=owner&returnTo=/owner'],
      ['Reports Gate','/internal-access?role=owner&returnTo=/reports']
    ]
  }
];

export default function Footer(){
  const [open,setOpen]=useState<Record<string,boolean>>({});
  useEffect(()=>{
    const desktop=window.matchMedia('(min-width: 761px)');
    const sync=()=>setOpen(Object.fromEntries(sections.map(section=>[section.title,desktop.matches])));
    sync();
    desktop.addEventListener('change',sync);
    return()=>desktop.removeEventListener('change',sync);
  },[]);
  return <footer className="footer">
    <div className="footer-inner">
      <section className="footer-brand" aria-label="Capital City Provisions summary">
        <p className="footer-logo">Capital City Provisions</p>
        <p>Curated cuts, smarter delivery, and stocked-home planning for Sacramento-area families, kitchens, and community buyers.</p>
        <p className="footer-note">No purchase necessary for giveaway entry. Cheesecake bonuses are separate from giveaway odds.</p>
      </section>
      <nav className="footer-grid" aria-label="Footer navigation">
        {sections.map(section=><section className={open[section.title]?'footer-column open':'footer-column'} key={section.title} aria-label={section.title}>
          <button className="footer-heading" onClick={()=>setOpen(current=>({...current,[section.title]:!current[section.title]}))} aria-expanded={!!open[section.title]}>{section.title}<span aria-hidden="true">+</span></button>
          <ul>
            {section.links.map(([label,href])=><li key={href}><a href={href}>{label}</a></li>)}
          </ul>
        </section>)}
      </nav>
    </div>
  </footer>
}
