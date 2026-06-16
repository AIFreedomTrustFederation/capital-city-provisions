export const metadata={
  title:'Meat Delivery Sacramento | Capital City Provisions',
  description:'Premium meat delivery in the Sacramento area with freezer boxes, beef, chicken, pork, seafood, wholesale supply, and route-based delivery planning.'
};

const services=['Family freezer boxes','Beef, poultry, pork, and seafood planning','Route-based delivery by ZIP','Wholesale supply for kitchens and events'];
const areas=['Roseville','Rocklin','Lincoln','Fair Oaks','Carmichael','Folsom','Orangevale','Sacramento-area expansion ZIPs'];

export default function MeatDeliverySacramentoPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">Meat Delivery Sacramento</p><h1>Premium meat delivery for Sacramento-area freezers.</h1><p className="lead">Capital City Provisions delivers freezer-ready proteins through practical local routes, starting with your ZIP code.</p><div className="actions"><a href="/#quick-route">Check My ZIP</a><a href="/family-freezer-boxes">Family Freezer Boxes</a></div></div><img src="/images/launch-freezer-box-hero.webp" alt="Meat delivery Sacramento"/></section>
  <section className="section route-section"><div><p className="eyebrow">What We Deliver</p><h2>Freezer boxes and premium proteins.</h2><p className="lead">Use this page as the main local landing page for customers searching for Sacramento meat delivery.</p></div><div className="route-list">{services.map(item=><article key={item}><h3>{item}</h3><p>Available through route-aware customer follow-up.</p></article>)}</div></section>
  <section className="section"><p className="eyebrow">Delivery Area</p><h2>Sacramento-area route planning.</h2><div className="delivery-grid">{areas.map(area=><article key={area} className="marble"><h3>{area}</h3><p>Check your ZIP to confirm current route status.</p></article>)}</div></section>
</main>}
