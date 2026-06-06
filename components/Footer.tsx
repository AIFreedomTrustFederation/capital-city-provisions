const links=[
  ['About','/about'],
  ['How Delivery Works','/how-delivery-works'],
  ['Reviews','/reviews'],
  ['FAQ','/faq'],
  ['Delivery Area','/delivery-map'],
  ['Wholesale','/wholesale']
];

export default function Footer(){return <footer className="footer"><p>Capital City Provisions</p><p>Premium ranch quality, modern convenience, and practical food security.</p><div className="footer-links">{links.map(([label,href])=><a key={href} href={href}>{label}</a>)}</div><p>AI box planning support available through the on-site Box Concierge.</p></footer>}
