export const metadata={
  title:'Freezer Boxes | Capital City Provisions',
  description:'Compare premium freezer boxes for small households, families, large freezers, and bulk provisioning across Capital City Provisions delivery routes.'
};

const boxes=[
  {name:'Starter Box',fit:'Small household',size:'7 cu ft',image:'/images/freezer-starter.png',best:'Individuals, couples, and first-time freezer customers',includes:['Balanced beef and poultry starter mix','Easy weeknight portions','Low-commitment freezer stocking'],cta:'Start Small'},
  {name:'Family Box',fit:'Family restock',size:'15 cu ft',image:'/images/freezer-family.png',best:'Families who want dependable weekly meal coverage',includes:['Beef, chicken, and pork variety','Family-sized portions','Flexible restock cadence'],cta:'Feed The Family'},
  {name:'Rancher Box',fit:'Large freezer',size:'20 cu ft',image:'/images/freezer-rancher.png',best:'Large households and serious home provision planning',includes:['Deeper beef allocation','Bulk meal planning support','Longer freezer runway'],cta:'Build The Reserve'},
  {name:'Owner Box',fit:'Bulk partner',size:'30 cu ft',image:'/images/freezer-owner.png',best:'Large families, event hosts, and partner accounts',includes:['Maximum freezer capacity','Custom protein planning','Wholesale-friendly volume'],cta:'Plan Bulk Stock'}
];

const reasons=['Ranch-direct quality from trusted producers','Route-based delivery windows','Curated boxes instead of random bundles','Household and wholesale planning support'];

export default function FreezerBoxesPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">Freezer Boxes</p><h1>Premium freezer-box provisioning.</h1><p className="lead">Choose a box around your household size, freezer space, protein preferences, and delivery route.</p><div className="actions"><a href="/delivery-map">Check Delivery Route</a><a href="/contact">Ask For Help</a></div></div><img src="/images/freezer-family.png" alt="Family freezer box provisioning"/></section>
  <section className="section"><p className="eyebrow">Compare Boxes</p><h2>Start with the freezer plan that fits real life.</h2><div className="box-grid detail-box-grid">{boxes.map(box=><article key={box.name} className="marble box-card"><img src={box.image} alt={`${box.name} option`}/><div className="box-card-copy"><p className="eyebrow">{box.fit}</p><h3>{box.name}</h3><p className="box-size">{box.size}</p><p>{box.best}</p><ul>{box.includes.map(item=><li key={item}>{item}</li>)}</ul><a href="/contact">{box.cta}</a></div></article>)}</div></section>
  <section className="section route-section"><div><p className="eyebrow">Why It Works</p><h2>Freezer confidence without guesswork.</h2><p className="lead">The goal is not just premium meat. It is knowing your freezer is stocked with useful proteins, sensible portions, and a delivery plan you can trust.</p></div><div className="route-list">{reasons.map(reason=><article key={reason}><h3>{reason}</h3><p>Built into every Capital City Provisions freezer-box conversation.</p></article>)}</div></section>
  <section className="cta poster-frame final-cta"><p className="eyebrow">Ready To Reserve</p><h2>Match your box to your delivery route.</h2><p>Use the concierge button or check the route map before choosing your freezer box.</p><div className="actions"><a href="/delivery-map">Check My Route</a><a href="/contact">Contact Sales</a></div></section>
</main>}
