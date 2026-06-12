'use client';
import {useState} from 'react';

const links = [
  ['Catalog', '/catalog'],
  ['Freezer Boxes', '/freezer-boxes'],
  ['Steak', '/steak-delivery'],
  ['Restock Club', '/monthly-restock'],
  ['Wholesale', '/wholesale'],
  ['Giveaway', '/giveaway'],
  ['How It Works', '/how-delivery-works'],
  ['Contact', '/contact'],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="nav" aria-label="Main navigation">
      <a className="brand" href="/">Capital City Provisions</a>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="main-navigation">Menu</button>
      <div id="main-navigation" className={open ? 'nav-links open' : 'nav-links'}>
        {links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
      </div>
    </nav>
  );
}
