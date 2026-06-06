'use client';
import {useState} from 'react';

const links=[
  ['Boxes','/freezer-boxes'],
  ['How Delivery Works','/how-delivery-works'],
  ['Delivery Area','/delivery-map'],
  ['Reviews','/reviews'],
  ['FAQ','/faq'],
  ['Wholesale','/wholesale'],
  ['Contact','/contact']
];

export default function Navbar(){
  const [open,setOpen]=useState(false);
  return <nav className="nav">
    <a className="brand" href="/">Capital City Provisions</a>
    <button className="menu-button" onClick={()=>setOpen(!open)} aria-label="Toggle navigation">Menu</button>
    <div className={open?'nav-links open':'nav-links'}>{links.map(([label,href])=><a key={href} href={href} onClick={()=>setOpen(false)}>{label}</a>)}</div>
  </nav>
}
