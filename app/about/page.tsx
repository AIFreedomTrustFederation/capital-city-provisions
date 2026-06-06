export const metadata={
  title:'About Capital City Provisions | Founder Story',
  description:'Learn the founder story behind Capital City Provisions and its mission to bring premium proteins, freezer planning, and food security to Sacramento-area families.'
};

const values=[
  {title:'Route-first honesty',text:'Delivery promises start with ZIP, route capacity, and realistic timing before a box is reserved.'},
  {title:'Freezer confidence',text:'Boxes are planned around useful meals, family size, protein preferences, and the amount of freezer space available.'},
  {title:'Premium provisions',text:'Beef, chicken, pork, seafood, and freezer staples are presented clearly so customers know what they are building toward.'},
  {title:'Human follow-up',text:'Customers, wholesale accounts, and delivery teams all need clean communication from first question through final drop-off.'}
];

const audiences=[
  {title:'Families',text:'Build a practical monthly freezer plan around dinners, backup meals, and household food security.',href:'/freezer-boxes',cta:'Compare Boxes'},
  {title:'Steak Buyers',text:'Request ribeye, filet, New York strip, sirloin, and bundle options around route availability.',href:'/steak-delivery',cta:'View Steak Delivery'},
  {title:'Wholesale Accounts',text:'Plan recurring supply for restaurants, caterers, churches, lodges, events, and food trucks.',href:'/wholesale',cta:'Wholesale Supply'},
  {title:'Prepared Households',text:'Stock a freezer with a calm plan for emergencies, busy weeks, and fewer last-minute grocery runs.',href:'/food-security-freezer-boxes',cta:'Food Security Plans'}
];

const proof=[
  'ZIP-aware route checks before delivery promises',
  'Clear public pages for families, steak, wholesale, delivery, and FAQ',
  'Customer-only concierge language on public pages',
  'Driver and owner tools kept behind role gates'
];

export default function AboutPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">About / Founder Story</p><h1>Built for families who want food confidence.</h1><p className="lead">Capital City Provisions brings premium protein delivery, practical freezer planning, and local route discipline together for households, businesses, and community buyers.</p><div className="actions"><a href="/how-delivery-works">How Delivery Works</a><a href="/freezer-boxes">Compare Boxes</a></div></div><img src="/images/freezer-family.png" alt="Capital City Provisions freezer box"/></section>

  <section className="section route-section"><div><p className="eyebrow">Founder Story</p><h2>Modern convenience with old-school responsibility.</h2><p className="lead">The company was shaped around a simple idea: people should know what is in their freezer, where their next meals are coming from, and when delivery is actually realistic.</p><p>Instead of pushing random bundles, Capital City Provisions starts with route fit, household needs, protein preferences, and freezer capacity. The result is a cleaner buying experience and a stronger food-security plan.</p></div><div className="route-list">{values.map(value=><article key={value.title}><h3>{value.title}</h3><p>{value.text}</p></article>)}</div></section>

  <section className="section"><div className="section-heading"><p className="eyebrow">Who We Serve</p><h2>Different buyers need different paths.</h2><p className="lead">The site is organized so each visitor can quickly find the right starting point without reading through pages meant for someone else.</p></div><div className="box-grid detail-box-grid">{audiences.map(audience=><article key={audience.title} className="marble"><h3>{audience.title}</h3><p>{audience.text}</p><a href={audience.href}>{audience.cta}</a></article>)}</div></section>

  <section className="section route-section"><div><p className="eyebrow">Trust System</p><h2>Helpful on the public side. Protected on the operations side.</h2><p className="lead">Customers get clear buying guidance. Drivers and owners get their own gated tools for routes, fulfillment, reports, and operations.</p></div><div className="route-list">{proof.map(item=><article key={item}><h3>{item}</h3><p>Designed to keep the experience clean, useful, and role appropriate.</p></article>)}</div></section>

  <section className="cta poster-frame final-cta"><p className="eyebrow">Our Promise</p><h2>Premium proteins, clear routes, stocked freezers.</h2><p>Start with a ZIP check or open the Box Concierge to build the plan around your home.</p><div className="actions"><a href="/#quick-route">Check My ZIP</a><a href="/contact">Contact Us</a></div></section>
</main>}
