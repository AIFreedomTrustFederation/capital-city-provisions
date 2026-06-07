export const metadata={
  title:'Freezer Boxes | Capital City Provisions',
  description:'Compare stocked-home boxes for small households, families, large freezers, and bulk buyers across Capital City Provisions delivery areas.'
};

const boxes=[
  {name:'Baby Freezer Package',fit:'Couples, apartments, and smaller households',size:'5 cu ft',image:'/images/freezer-starter.png',best:'A compact freezer fill for customers who want premium proteins without overbuying.',includes:['Beef and poultry essentials','Simple weeknight portions','Easy first stock-up'],cta:'Start Small'},
  {name:'Mama Freezer Package',fit:'Small families and busy kitchens',size:'7 cu ft',image:'/images/freezer-family.png',best:'More food, more variety, and more peace of mind for the normal weekly rhythm.',includes:['Beef, chicken, and pork variety','Family-friendly portions','Restock Club ready'],cta:'Feed The Family'},
  {name:'Papa Freezer Package',fit:'Families ready to stock up',size:'10 cu ft',image:'/images/freezer-rancher.png',best:'A powerful family package for cutting down constant grocery runs.',includes:['Premium beef, chicken, pork, and seafood','Dinner and meal-prep coverage','Longer runway between restocks'],cta:'Build The Reserve'},
  {name:'Big Mama Freezer Package',fit:'Large households and serious meal planners',size:'15 cu ft',image:'/images/freezer-family.png',best:'Built for families who cook often and want restaurant-quality proteins ready whenever they are.',includes:['Deeper protein variety','Larger family portions','Holiday and event support'],cta:'Plan Big'},
  {name:'Big Papa Freezer Package',fit:'Food-security reserve',size:'22 cu ft',image:'/images/freezer-owner.png',best:'The whole-cow alternative for serious savings, serious quality, and serious freezer confidence.',includes:['Maximum home reserve','Custom freezer planning','Bulk and event-friendly volume'],cta:'Go Big'}
];

const reasons=['Cuts selected for usefulness, not filler','Delivery timing checked before the order is pushed','Box options that scale with freezer size','Support for homes, holidays, events, and business buyers'];

export default function FreezerBoxesPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">Freezer Packages</p><h1>Fill your freezer without doing all the work.</h1><p className="lead">Choose by household size, cooking style, budget, and available space. We bring the food, help organize the plan, and turn the order into meals you will actually use.</p><div className="actions"><a href="/delivery-map">Check Delivery</a><a href="/contact">Schedule A Freezer Consultation</a></div></div><img src="/images/freezer-family.png" alt="Family stocked-home box"/></section>
  <section className="section"><p className="eyebrow">Compare Packages</p><h2>From Baby Freezer to Big Papa reserve.</h2><div className="box-grid detail-box-grid">{boxes.map(box=><article key={box.name} className="marble box-card"><img src={box.image} alt={`${box.name} option`}/><div className="box-card-copy"><p className="eyebrow">{box.fit}</p><h3>{box.name}</h3><p className="box-size">{box.size}</p><p>{box.best}</p><ul>{box.includes.map(item=><li key={item}>{item}</li>)}</ul><a href="/contact">{box.cta}</a></div></article>)}</div></section>
  <section className="section route-section"><div><p className="eyebrow">Why It Works</p><h2>Useful food beats random bundles.</h2><p className="lead">Every plan is meant to make the week easier: recognizable cuts, sensible portions, and a clear delivery path before anyone overpromises.</p></div><div className="route-list">{reasons.map(reason=><article key={reason}><h3>{reason}</h3><p>A cleaner way to buy for the month ahead.</p></article>)}</div></section>
  <section className="cta poster-frame final-cta"><p className="eyebrow">Ready</p><h2>Start with your ZIP and build from there.</h2><p>The concierge keeps the plan connected to your delivery area, freezer size, and household needs.</p><div className="actions"><a href="/#quick-route">Check ZIP</a><a href="/contact">Contact Sales</a></div></section>
</main>}
