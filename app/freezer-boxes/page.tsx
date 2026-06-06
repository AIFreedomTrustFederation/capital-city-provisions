export const metadata={
  title:'Freezer Boxes | Capital City Provisions',
  description:'Compare stocked-home boxes for small households, families, large freezers, and bulk buyers across Capital City Provisions delivery areas.'
};

const boxes=[
  {name:'Starter Box',fit:'Small household',size:'7 cu ft',image:'/images/freezer-starter.png',best:'A clean first stock-up for individuals, couples, and lighter kitchens',includes:['Beef and poultry essentials','Weeknight-ready portions','Easy first order'],cta:'Start Small'},
  {name:'Family Box',fit:'Family rhythm',size:'15 cu ft',image:'/images/freezer-family.png',best:'A dependable mix for dinners, lunches, and backup meals',includes:['Beef, chicken, and pork variety','Family-sized portions','Flexible monthly cadence'],cta:'Feed The Family'},
  {name:'Rancher Box',fit:'Deep stock',size:'20 cu ft',image:'/images/freezer-rancher.png',best:'More volume and variety for serious home planning',includes:['Deeper beef allocation','Bulk meal prep support','Longer runway between restocks'],cta:'Build The Reserve'},
  {name:'Owner Box',fit:'Bulk partner',size:'30 cu ft',image:'/images/freezer-owner.png',best:'High-capacity supply for big families, hosts, and partner accounts',includes:['Maximum capacity','Custom cut planning','Wholesale-friendly volume'],cta:'Plan Bulk Stock'}
];

const reasons=['Cuts selected for usefulness, not filler','Delivery timing checked before the order is pushed','Box options that scale with household size','Support for homes, events, and business buyers'];

export default function FreezerBoxesPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">Home Stock Boxes</p><h1>Build a box that fits how you actually eat.</h1><p className="lead">Choose by household size, cooking style, budget, and available space. We help turn the order into meals you will actually use.</p><div className="actions"><a href="/delivery-map">Check Delivery</a><a href="/contact">Ask For Help</a></div></div><img src="/images/freezer-family.png" alt="Family stocked-home box"/></section>
  <section className="section"><p className="eyebrow">Compare Options</p><h2>From first stock-up to full reserve.</h2><div className="box-grid detail-box-grid">{boxes.map(box=><article key={box.name} className="marble box-card"><img src={box.image} alt={`${box.name} option`}/><div className="box-card-copy"><p className="eyebrow">{box.fit}</p><h3>{box.name}</h3><p className="box-size">{box.size}</p><p>{box.best}</p><ul>{box.includes.map(item=><li key={item}>{item}</li>)}</ul><a href="/contact">{box.cta}</a></div></article>)}</div></section>
  <section className="section route-section"><div><p className="eyebrow">Why It Works</p><h2>Useful food beats random bundles.</h2><p className="lead">Every plan is meant to make the week easier: recognizable cuts, sensible portions, and a clear delivery path before anyone overpromises.</p></div><div className="route-list">{reasons.map(reason=><article key={reason}><h3>{reason}</h3><p>A cleaner way to buy for the month ahead.</p></article>)}</div></section>
  <section className="cta poster-frame final-cta"><p className="eyebrow">Ready</p><h2>Start with your ZIP and build from there.</h2><p>The concierge keeps the plan connected to your delivery area and household needs.</p><div className="actions"><a href="/#quick-route">Check ZIP</a><a href="/contact">Contact Sales</a></div></section>
</main>}
