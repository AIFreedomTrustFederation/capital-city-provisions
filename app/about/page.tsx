export const metadata={
  title:'About Capital City Provisions | Founder Story',
  description:'Learn the story behind Capital City Provisions and its mission to make stocked-home protein delivery clearer, smarter, and more dependable.'
};

const values=[
  {title:'Clarity first',text:'Customers should know availability and timing before they commit.'},
  {title:'Useful food',text:'Plans are shaped around meals people actually cook, not random filler.'},
  {title:'Modern service',text:'ZIP checks, saved preferences, and AI-assisted guidance keep the experience simple.'},
  {title:'Human accountability',text:'Behind the tools, real follow-up keeps orders, delivery, and support grounded.'}
];

const audiences=[
  {title:'Families',text:'Build a monthly stock-up around dinners, backup meals, and the weekly rhythm at home.',href:'/freezer-boxes',cta:'Compare Boxes'},
  {title:'Steak Buyers',text:'Request classic cuts and bundle options without guessing what is available near you.',href:'/steak-delivery',cta:'View Steak Delivery'},
  {title:'Wholesale Accounts',text:'Plan recurring supply for kitchens, churches, caterers, lodges, events, and food trucks.',href:'/wholesale',cta:'Wholesale Supply'},
  {title:'Prepared Households',text:'Create a calmer reserve for busy weeks, emergencies, and fewer last-minute store runs.',href:'/food-security-freezer-boxes',cta:'Food Security Plans'}
];

const proof=[
  'ZIP-aware guidance before follow-up',
  'Customer pages organized by need',
  'Public AI focused on buying help only',
  'Driver and owner tools kept behind access gates'
];

export default function AboutPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">About</p><h1>A smarter way to keep the house stocked.</h1><p className="lead">Capital City Provisions blends curated protein, local delivery intelligence, and practical service for families, partners, and community buyers.</p><div className="actions"><a href="/how-delivery-works">How It Works</a><a href="/freezer-boxes">Compare Boxes</a></div></div><img src="/images/freezer-family.png" alt="Capital City Provisions home stock box"/></section>

  <section className="section route-section"><div><p className="eyebrow">Founder Story</p><h2>Old-school standards. Modern ordering flow.</h2><p className="lead">The idea is simple: buying meat for the home should feel clear, useful, and worth the space it takes up.</p><p>Instead of pushing one-size-fits-all bundles, the experience starts with delivery area, household needs, preferred cuts, and available storage. The result is a cleaner path from curiosity to a stocked kitchen.</p></div><div className="route-list">{values.map(value=><article key={value.title}><h3>{value.title}</h3><p>{value.text}</p></article>)}</div></section>

  <section className="section"><div className="section-heading"><p className="eyebrow">Who We Serve</p><h2>Find the path that matches your need.</h2><p className="lead">Each section of the site is built for a different buyer, so customers do not have to sort through information meant for someone else.</p></div><div className="box-grid detail-box-grid">{audiences.map(audience=><article key={audience.title} className="marble"><h3>{audience.title}</h3><p>{audience.text}</p><a href={audience.href}>{audience.cta}</a></article>)}</div></section>

  <section className="section route-section"><div><p className="eyebrow">Trust System</p><h2>Helpful for customers. Protected for operations.</h2><p className="lead">Public pages stay focused on buying help. Internal tools stay gated for the people running routes, fulfillment, and reporting.</p></div><div className="route-list">{proof.map(item=><article key={item}><h3>{item}</h3><p>Cleaner for customers and stronger for the team.</p></article>)}</div></section>

  <section className="cta poster-frame final-cta"><p className="eyebrow">Promise</p><h2>Better cuts, clearer timing, a fuller kitchen.</h2><p>Start with your ZIP or open the concierge to build a plan around your home.</p><div className="actions"><a href="/#delivery-zone-check">Check ZIP</a><a href="/contact">Contact Us</a></div></section>
</main>}
