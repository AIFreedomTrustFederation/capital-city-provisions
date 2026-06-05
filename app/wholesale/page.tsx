export const metadata={
  title:'Wholesale Meat Supplier | Capital City Provisions',
  description:'Wholesale meat, seafood, poultry, pork, and freezer-box provisioning for restaurants, churches, lodges, caterers, food trucks, and events.'
};

const markets=['Restaurants','Food Trucks','Churches','Lodges','Caterers','Events'];
const support=['Bulk protein sourcing','Recurring delivery planning','Freezer-box and event bundles','Route-aware fulfillment','Custom account pricing','Reliable communication'];

export default function WholesalePage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">Wholesale</p><h1>Premium provisions for serious kitchens.</h1><p className="lead">Bulk meat, seafood, poultry, pork, and freezer-box sourcing for restaurants, churches, lodges, caterers, food trucks, and community events.</p><div className="actions"><a href="/contact">Request Wholesale Pricing</a><a href="/catalog">View Catalog</a></div></div><img src="/images/freezer-owner.png" alt="Wholesale freezer provisioning"/></section>
  <section className="section"><p className="eyebrow">Who We Serve</p><h2>Recurring protein supply for groups that feed people.</h2><div className="grid">{markets.map(m=><article key={m}><h3>{m}</h3><p>Request pricing, availability, delivery planning, and recurring provisioning support.</p></article>)}</div></section>
  <section className="section route-section"><div><p className="eyebrow">Account Support</p><h2>Built for practical operations, not vague promises.</h2><p className="lead">Wholesale accounts need predictable communication, route awareness, and product planning before delivery is promised.</p></div><div className="route-list">{support.map(item=><article key={item}><h3>{item}</h3><p>Available through Capital City Provisions wholesale planning.</p></article>)}</div></section>
  <section className="cta poster-frame final-cta"><p className="eyebrow">Apply</p><h2>Tell us what you serve and how often.</h2><p>We will match your account to current inventory, route capacity, and recurring supply needs.</p><div className="actions"><a href="/contact">Contact Wholesale</a><a href="/delivery-map">Check Route Map</a></div></section>
</main>}
