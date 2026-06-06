const links=[
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
  ['Delivery Area','/delivery-map']
];

export default function Footer(){return <footer className="footer"><p>Capital City Provisions</p><p>Premium ranch quality, modern convenience, and practical food security.</p><p>{links.map(([label,href],index)=><span key={href}>{index>0?' | ':''}<a href={href}>{label}</a></span>)}</p><p>AI box planning support available through the on-site Box Concierge.</p></footer>}
