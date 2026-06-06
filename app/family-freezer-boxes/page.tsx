export const metadata={
  title:'Family Freezer Boxes | Capital City Provisions',
  description:'Compare Starter, Family, Rancher, and Premium Owner boxes for Sacramento-area families, monthly provisioning, and stocked-home planning.'
};

const boxes=[
  {name:'Starter Box',fit:'1-2 people',budget:'First stock-up',image:'/images/freezer-starter.png',items:['Beef and poultry basics','Simple weeknight portions','Low-commitment first order']},
  {name:'Family Box',fit:'3-5 people',budget:'Monthly meal coverage',image:'/images/freezer-family.png',items:['Beef, chicken, and pork variety','Dinner-friendly portions','Balanced staples']},
  {name:'Rancher Box',fit:'Large households',budget:'Deep reserve',image:'/images/freezer-rancher.png',items:['More beef volume','Meal prep support','Longer time between orders']},
  {name:'Premium Owner Box',fit:'Bulk and events',budget:'Maximum capacity',image:'/images/freezer-owner.png',items:['Custom planning','Wholesale-friendly volume','Large family and event support']}
];

const benefits=['Fewer emergency grocery runs','Clear delivery expectations before you commit','Plans sized around your household','Backup meals without the chaos'];

export default function FamilyFreezerBoxesPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">Family Boxes</p><h1>Keep the week fed before it gets busy.</h1><p className="lead">A smarter stock-up for households that want dinner options ready, without building every meal from scratch at the last minute.</p><div className="actions"><a href="/#quick-route">Check ZIP</a><a href="/freezer-boxes">Compare Boxes</a></div></div><img src="/images/freezer-family.png" alt="Family box delivery"/></section>
  <section className="section"><p className="eyebrow">Lineup</p><h2>Choose the level that matches your home.</h2><div className="box-grid detail-box-grid">{boxes.map(box=><article key={box.name} className="marble box-card"><img src={box.image} alt={`${box.name} box`}/><div className="box-card-copy"><p className="eyebrow">{box.fit}</p><h3>{box.name}</h3><p className="box-size">{box.budget}</p><ul>{box.items.map(item=><li key={item}>{item}</li>)}</ul><a href="/#quick-route">Check Delivery First</a></div></article>)}</div></section>
  <section className="section route-section"><div><p className="eyebrow">Why Families Buy</p><h2>Less scramble. More ready meals.</h2><p className="lead">The best box is the one your household actually uses. Start with ZIP, then match size and cuts to how you cook.</p></div><div className="route-list">{benefits.map(item=><article key={item}><h3>{item}</h3><p>A practical upgrade to the monthly food routine.</p></article>)}</div></section>
  <section className="cta poster-frame final-cta"><p className="eyebrow">Build My Box</p><h2>Start with the delivery ZIP.</h2><p>Your saved ZIP helps the concierge keep every recommendation grounded in your area.</p><div className="actions"><a href="/#quick-route">Check ZIP</a><a href="/contact">Ask For Help</a></div></section>
</main>}
