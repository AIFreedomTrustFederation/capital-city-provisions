export const metadata={
  title:'About Capital City Provisions | Founder Story',
  description:'Learn the founder story behind Capital City Provisions and its mission to bring premium proteins, freezer planning, and food security to Sacramento-area families.'
};

const values=[
  'Premium American proteins sourced for consistency and trust.',
  'Freezer-ready planning for real households, events, and community needs.',
  'Route-based delivery that keeps promises practical.',
  'Warm customer follow-up from ZIP check through delivery.'
];

export default function AboutPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">About / Founder Story</p><h1>Built for families who want food confidence.</h1><p className="lead">Capital City Provisions brings premium protein delivery, practical freezer planning, and local route discipline together for households, businesses, and communities.</p><div className="actions"><a href="/how-delivery-works">How Delivery Works</a><a href="/freezer-boxes">Compare Boxes</a></div></div><img src="/images/freezer-family.png" alt="Capital City Provisions freezer box"/></section>
  <section className="section route-section"><div><p className="eyebrow">Founder Story</p><h2>Modern convenience with old-school responsibility.</h2><p className="lead">The company was shaped around a simple idea: people should know what is in their freezer, where their next meals are coming from, and when delivery is actually realistic.</p><p>Instead of pushing random bundles, Capital City Provisions starts with route fit, household needs, protein preferences, and freezer capacity. The result is a cleaner buying experience and a stronger food-security plan.</p></div><div className="route-list">{values.map(value=><article key={value}><h3>{value}</h3><p>A practical promise for every customer conversation.</p></article>)}</div></section>
  <section className="cta poster-frame final-cta"><p className="eyebrow">Our Promise</p><h2>Premium proteins, clear routes, stocked freezers.</h2><p>Start with a ZIP check or open the Box Concierge to build the plan around your home.</p><div className="actions"><a href="/#quick-route">Check My ZIP</a><a href="/contact">Contact Us</a></div></section>
</main>}
