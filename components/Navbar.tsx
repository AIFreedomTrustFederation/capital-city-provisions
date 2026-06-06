'use client';
import {useState} from 'react';

const links=[
  ['Boxes','/family-freezer-boxes'],
  ['Steak','/steak-delivery'],
  ['Giveaway','/giveaway'],
  ['Delivery','/delivery-map'],
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
