export const metadata={title:'About Capital City Provisions | Founder Story',description:'Learn the story behind Capital City Provisions and its mission to make stocked-home protein delivery clearer and more dependable.'};

const values=[
  ['Clarity first','Customers should know availability and timing before they commit.'],
  ['Useful food','Plans are shaped around meals people actually cook, not random filler.'],
  ['Guided service','ZIP checks, saved preferences, and concierge support keep the experience simple.'],
  ['Human accountability','Real follow-up keeps orders, delivery, and support grounded.']
];

const audiences=[
  ['Families','Build a monthly stock-up around dinners, backup meals, and the weekly rhythm at home.','/freezer-boxes','Compare Boxes'],
  ['Steak Buyers','Request classic cuts and bundle options without guessing what is available near you.','/steak-delivery','View Steak Delivery'],
  ['Wholesale Accounts','Plan recurring supply for kitchens, churches, caterers, lodges, events, and food trucks.','/wholesale','Wholesale Supply'],
  ['Prepared Households','Create a calmer reserve for busy weeks, emergencies, and fewer last-minute store runs.','/food-security-freezer-boxes','Food Security Plans']
];

const proof=['ZIP-aware guidance before follow-up','Customer pages organized by need','Concierge support focused on buying help','Driver and owner tools kept behind access gates'];

export default function AboutPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">About</p><h1>A smarter way to keep the house stocked.</h1><p className="lead">Capital City Provisions blends curated protein, local delivery intelligence, and practical service for families, partners, and community buyers.</p><div className="actions"><a href="/how-delivery-works">How It Works</a><a href="/freezer-boxes">Compare Boxes</a></div></div><img src="/images/freezer-family.png" alt="Capital City Provisions home stock box"/></section>
  <section className="section route-section"><div><p className="eyebrow">Founder Story</p><h2>Old-school standards. Modern ordering flow.</h2><p className="lead">Buying meat for the home should feel clear, useful, and worth the space it takes up.</p><p>The experience starts with delivery area, household needs, preferred cuts, and available storage.</p></div><div className="route-list">{values.map(([title,text])=><article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>
  <section className="section"><div className="section-heading"><p className="eyebrow">Who We Serve</p><h2>Find the path that matches your need.</h2><p className="lead">Each section of the site is built for a different buyer, so customers do not have to sort through information meant for someone else.</p></div><div className="box-grid detail-box-grid">{audiences.map(([title,text,href,cta])=><article key={title} className="marble"><h3>{title}</h3><p>{text}</p><a href={href}>{cta}</a></article>)}</div></section>
  <section className="section route-section"><div><p className="eyebrow">Trust System</p><h2>Helpful for customers. Protected for operations.</h2><p className="lead">Public pages stay focused on buying help. Internal tools stay gated for the people running routes, fulfillment, and reporting.</p></div><div className="route-list">{proof.map(item=><article key={item}><h3>{item}</h3><p>Cleaner for customers and stronger for the team.</p></article>)}</div></section>
  <section className="cta poster-frame final-cta"><p className="eyebrow">Promise</p><h2>Better cuts, clearer timing, a fuller kitchen.</h2><p>Start with your ZIP or open the concierge to build a plan around your home.</p><div className="actions"><a href="/#quick-route">Check ZIP</a><a href="/contact">Contact Us</a></div></section>
</main>}
