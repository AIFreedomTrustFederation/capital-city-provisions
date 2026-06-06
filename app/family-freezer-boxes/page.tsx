export const metadata={
  title:'Family Freezer Boxes | Capital City Provisions',
  description:'Compare Starter, Family, Rancher, and Premium Owner freezer boxes for Sacramento-area families, monthly provisioning, and food security planning.'
};

const boxes=[
  {name:'Starter Box',fit:'1-2 people',budget:'Entry freezer restock',image:'/images/freezer-starter.png',items:['Beef and poultry basics','Easy weeknight portions','Low-commitment first order']},
  {name:'Family Box',fit:'3-5 people',budget:'Monthly meal coverage',image:'/images/freezer-family.png',items:['Beef, chicken, and pork variety','Family dinner portions','Balanced freezer staples']},
  {name:'Rancher Box',fit:'Large households',budget:'Deep freezer planning',image:'/images/freezer-rancher.png',items:['Higher-volume beef allocation','Bulk meal prep support','Longer freezer runway']},
  {name:'Premium Owner Box',fit:'Bulk and events',budget:'Maximum capacity',image:'/images/freezer-owner.png',items:['Custom protein planning','Wholesale-friendly volume','Large family and event support']}
];

const benefits=['Monthly provisioning without random grocery runs','Route-first delivery expectations','Practical freezer planning by household size','Food-security support for everyday and emergency meals'];

export default function FamilyFreezerBoxesPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">Family Freezer Boxes</p><h1>Stock the freezer around real meals.</h1><p className="lead">Choose a freezer box that fits your household size, budget, delivery ZIP, and monthly protein needs.</p><div className="actions"><a href="/#quick-route">Check My ZIP</a><a href="/freezer-boxes">Compare All Boxes</a></div></div><img src="/images/freezer-family.png" alt="Family freezer box delivery"/></section>
  <section className="section"><p className="eyebrow">Box Lineup</p><h2>Starter, Family, Rancher, and Premium Owner boxes.</h2><div className="box-grid detail-box-grid">{boxes.map(box=><article key={box.name} className="marble box-card"><img src={box.image} alt={`${box.name} freezer box`}/><div className="box-card-copy"><p className="eyebrow">{box.fit}</p><h3>{box.name}</h3><p className="box-size">{box.budget}</p><ul>{box.items.map(item=><li key={item}>{item}</li>)}</ul><a href="/#quick-route">Check Delivery First</a></div></article>)}</div></section>
  <section className="section route-section"><div><p className="eyebrow">Why Families Buy</p><h2>Less guesswork, more meals ready.</h2><p className="lead">A freezer box should make the next month easier, not just fill space. Start with the ZIP check, then match your box to the route and household plan.</p></div><div className="route-list">{benefits.map(item=><article key={item}><h3>{item}</h3><p>Built into the Capital City Provisions box flow.</p></article>)}</div></section>
  <section className="cta poster-frame final-cta"><p className="eyebrow">Build My Box</p><h2>Start with your delivery ZIP.</h2><p>The saved ZIP carries into the Box Concierge so the route and freezer plan stay connected.</p><div className="actions"><a href="/#quick-route">Check My ZIP</a><a href="/contact">Ask For Help</a></div></section>
</main>}
