export const metadata={
  title:'Wholesale Meat Supplier | Capital City Provisions',
  description:'Wholesale meat, seafood, poultry, and pork supply for restaurants, churches, lodges, caterers, food trucks, and events.'
};

const markets=['Restaurants','Food Trucks','Churches','Lodges','Caterers','Events'];
const support=['Volume sourcing','Recurring supply rhythm','Event-ready bundles','Fulfillment notes','Account pricing','Clear communication'];

export default function WholesalePage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">Wholesale</p><h1>Supply that keeps serious kitchens moving.</h1><p className="lead">Meat, seafood, poultry, and pork support for restaurants, churches, lodges, caterers, food trucks, and event teams.</p><div className="actions"><a href="/contact">Request Pricing</a><a href="/catalog">View Catalog</a></div></div><img src="/images/freezer-owner.png" alt="Wholesale provisioning"/></section>
  <section className="section"><p className="eyebrow">Who We Serve</p><h2>Built for teams that feed people at scale.</h2><div className="grid">{markets.map(m=><article key={m}><h3>{m}</h3><p>Share your volume, timing, and product needs so we can shape the account around real operations.</p></article>)}</div></section>
  <section className="section route-section"><div><p className="eyebrow">Account Support</p><h2>Practical supply, not vague promises.</h2><p className="lead">Wholesale buyers need availability, timing, substitutions, and follow-up that make sense before the kitchen commits.</p></div><div className="route-list">{support.map(item=><article key={item}><h3>{item}</h3><p>Designed for recurring buyers and high-volume events.</p></article>)}</div></section>
  <section className="cta poster-frame final-cta"><p className="eyebrow">Apply</p><h2>Tell us what you serve and how often.</h2><p>We will match the account to inventory, timing, and recurring demand.</p><div className="actions"><a href="/contact">Contact Wholesale</a><a href="/delivery-map">Check Delivery</a></div></section>
</main>}
