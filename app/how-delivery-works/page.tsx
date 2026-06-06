export const metadata={
  title:'How Delivery Works | Capital City Provisions',
  description:'See how Capital City Provisions checks your ZIP, confirms availability, and coordinates local delivery for stocked-home orders.'
};

const steps=[
  {title:'Enter your ZIP',text:'Start with the area so we can show whether delivery is active, filling, opening, or waitlisted.'},
  {title:'Pick your direction',text:'Choose the box size, cuts, budget, and household rhythm that make sense for your kitchen.'},
  {title:'Get confirmed',text:'A clear follow-up locks in timing, product fit, and the details needed before pack-out.'},
  {title:'Stock the week',text:'Receive useful portions that turn into dinners, backups, prep meals, and peace of mind.'}
];

const promises=[
  'Availability is checked before expectations are set.',
  'Active areas receive the fastest follow-up.',
  'Waitlisted ZIPs help open the next delivery cluster.',
  'Phone details make timing updates easier.'
];

const routeDays=[
  {area:'Fair Oaks / Carmichael',zips:'95628 / 95608',day:'Tuesday',status:'Adding nearby orders'},
  {area:'Roseville',zips:'95661 / 95678',day:'Wednesday',status:'Confirmed'},
  {area:'Rocklin / Lincoln',zips:'95765 / 95677 / 95648',day:'Thursday',status:'Nearly full'},
  {area:'Folsom / Orangevale',zips:'95630 / 95662',day:'Friday',status:'Opening soon'}
];

export default function HowDeliveryWorksPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">How Delivery Works</p><h1>Check the area. Build the plan. Get stocked.</h1><p className="lead">The process starts with your ZIP so the recommendation matches real local availability.</p><div className="actions"><a href="/#quick-route">Check ZIP</a><a href="/freezer-boxes">Build My Box</a></div></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions delivery planning"/></section>
  <section className="section"><p className="eyebrow">Process</p><h2>Clear steps, no mystery window.</h2><div className="step-row">{steps.map((step,index)=><article key={step.title}><span>{index+1}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div></section>
  <section className="section route-section"><div><p className="eyebrow">Promise</p><h2>Simple expectations from the start.</h2><p className="lead">Customers should know whether to reserve, wait for follow-up, or join the next cluster before choosing a box.</p></div><div className="route-list">{promises.map(promise=><article key={promise}><h3>{promise}</h3><p>Designed to keep the next step obvious.</p></article>)}</div></section>
  <section className="section"><p className="eyebrow">Current Days</p><h2>Local delivery snapshots.</h2><div className="delivery-grid">{routeDays.map(route=><article key={route.area} className="marble"><h3>{route.area}</h3><p>{route.zips}</p><strong>{route.day}</strong><p>{route.status}</p></article>)}</div></section>
  <section className="cta poster-frame final-cta"><p className="eyebrow">Start Here</p><h2>Your ZIP unlocks the right recommendation.</h2><p>The concierge uses it to keep the plan grounded in real delivery availability.</p><div className="actions"><a href="/#quick-route">Check ZIP</a><a href="/contact">Ask About Delivery</a></div></section>
</main>}
