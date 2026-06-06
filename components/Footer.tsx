const links=[
  ['Freezer Giveaway','/giveaway'],
  ['Official Rules','/official-rules'],
  ['Family Freezer Boxes','/family-freezer-boxes'],
  ['Steak Delivery','/steak-delivery'],
  ['Meat Delivery Sacramento','/meat-delivery-sacramento'],
  ['Freezer Boxes Sacramento','/freezer-boxes-sacramento'],
  ['Beef Delivery Sacramento','/beef-delivery-sacramento'],
  ['Wholesale Supplier Sacramento','/wholesale-meat-supplier-sacramento'],
  ['Food Security Boxes','/food-security-freezer-boxes'],
  ['About','/about'],
  ['How Delivery Works','/how-delivery-works'],
  ['Reviews','/reviews'],
  ['FAQ','/faq'],
  ['Delivery Area','/delivery-map'],
  ['Customer AI','/customer-concierge'],
  ['AI Route Concierge','/ai-route-concierge'],
  ['Ops Hub','/ops'],
  ['System Database','/system-database'],
  ['Driver Ops','/driver'],
  ['Owner Command','/owner'],
  ['Reports','/reports']
];

export default function Footer(){return <footer className="footer"><p>Capital City Provisions</p><p>Premium ranch quality, modern convenience, practical food security, and ethical local route incentives.</p><p>{links.map(([label,href],index)=><span key={href}>{index>0?' | ':''}<a href={href}>{label}</a></span>)}</p><p>No purchase necessary for giveaway entry. Cheesecake order bonuses are separate from giveaway odds.</p></footer>}
