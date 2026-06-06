'use client';
import {useState} from 'react';

const links=[
  ['Boxes','/freezer-boxes'],
  ['Steak','/steak-delivery'],
  ['How It Works','/how-delivery-works'],
  ['Delivery','/delivery-map'],
  ['Wholesale','/wholesale'],
  ['Giveaway','/giveaway'],
  ['About','/about'],
  ['Reviews','/reviews'],
  ['FAQ','/faq'],
  ['Contact','/contact']
];

export default function Navbar(){
  const [open,setOpen]=useState(false);
  return <nav className="nav" aria-label="Main navigation">
    <a className="brand" href="/">Capital City Provisions</a>
    <button className="menu-button" onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls="main-navigation">Menu</button>
    <div id="main-navigation" className={open?'nav-links open':'nav-links'}>{links.map(([label,href])=><a key={href} href={href} onClick={()=>setOpen(false)}>{label}</a>)}</div>
  </nav>
}
