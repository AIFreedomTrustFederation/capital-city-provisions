export const metadata={
  title:'How Delivery Works | Capital City Provisions',
  description:'See how Capital City Provisions checks your ZIP, confirms availability, and coordinates local delivery for stocked-home orders.'
};

const steps=[
  {title:'Enter your ZIP',text:'Start with your area so the team can match your request to active, filling, opening, or waitlisted delivery coverage.'},
  {title:'Pick your direction',text:'Choose the box size, steak focus, household rhythm, and freezer space that make sense for your kitchen.'},
  {title:'Get confirmed',text:'A clear follow-up confirms timing, product fit, route availability, and the details needed before pack-out.'},
  {title:'Stock the week',text:'Receive freezer-ready proteins that turn into grill nights, weeknight dinners, meal prep, backups, and peace of mind.'}
];

const promises=[
  'ZIP checked before expectations are set.',
  'Active areas receive the fastest follow-up.',
  'Grouped routes help keep local delivery practical.',
  'Waitlisted ZIPs help open the next delivery cluster.',
  'Phone details make delivery timing easier.',
  'Nothing is treated as final until the plan is confirmed.'
];

const routeDays=[
  {area:'Fair Oaks / Carmichael',zips:'95628 / 95608',day:'Tuesday',status:'Adding nearby orders'},
  {area:'Roseville',zips:'95661 / 95678',day:'Wednesday',status:'Confirmed'},
  {area:'Rocklin / Lincoln',zips:'95765 / 95677 / 95648',day:'Thursday',status:'Nearly full'},
  {area:'Folsom / Orangevale',zips:'95630 / 95662',day:'Friday',status:'Opening soon'}
];

const confidence=[
  {title:'No mystery window',text:'The process starts with delivery reality, not pressure.'},
  {title:'No random box',text:'The package should match how your household actually eats.'},
  {title:'No overpromising',text:'Timing, route fit, and product fit are confirmed before final order expectations.'}
];

export default function HowDeliveryWorksPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">How Delivery Works</p><h1>Check the area. Build the plan. Get stocked.</h1><p className="lead">Capital City Provisions is built around a simple promise: confirm the route first, match the right freezer box second, and make the delivery feel clean, clear, and worth getting excited about.</p><div className="actions"><a href="/#delivery-zone-check">Check ZIP</a><a href="/freezer-boxes">Build My Box</a><a href="/menu">View Menu</a></div></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions delivery planning"/></section>

  <section className="section route-section"><div><p className="eyebrow">The Big Idea</p><h2>Premium protein delivery should feel simple.</h2><p className="lead">You should not have to guess whether your area is covered, whether a box fits your freezer, or what happens after you request help. The flow is designed to make the next step obvious.</p></div><div className="route-list">{confidence.map(item=><article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>

  <section className="section"><p className="eyebrow">Process</p><h2>Four steps from hungry to stocked.</h2><div className="step-row">{steps.map((step,index)=><article key={step.title}><span>{index+1}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div></section>

  <section className="section route-section"><div><p className="eyebrow">Delivery Promise</p><h2>Clear expectations from the start.</h2><p className="lead">Every customer path should answer one question: what is the cleanest next step for this ZIP, this household, and this freezer?</p></div><div className="route-list">{promises.map(promise=><article key={promise}><h3>{promise}</h3><p>Designed to protect the customer experience and keep the process moving.</p></article>)}</div></section>

  <section className="section"><p className="eyebrow">Current Days</p><h2>Local delivery snapshots.</h2><p className="lead">Route timing can shift as nearby orders group together, but these snapshots show how local delivery planning is organized.</p><div className="delivery-grid">{routeDays.map(route=><article key={route.area} className="marble"><h3>{route.area}</h3><p>{route.zips}</p><strong>{route.day}</strong><p>{route.status}</p></article>)}</div></section>

  <section className="cta poster-frame final-cta"><p className="eyebrow">Start Here</p><h2>Your ZIP unlocks the right recommendation.</h2><p>The concierge uses it to keep the plan grounded in real delivery availability, freezer space, and household needs.</p><div className="actions"><a href="/#delivery-zone-check">Check ZIP</a><a href="/freezer-boxes">See Boxes</a><a href="/contact">Ask About Delivery</a></div></section>
</main>}