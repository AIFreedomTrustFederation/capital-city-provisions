export const metadata={
  title:'How Delivery Works | Capital City Provisions',
  description:'Learn how Capital City Provisions checks your ZIP, groups delivery routes, confirms freezer-box orders, and delivers premium proteins across Sacramento-area routes.'
};

const steps=[
  {title:'Check your ZIP',text:'Start with your delivery ZIP so we can see whether your area is confirmed, almost full, building, or waitlisted.'},
  {title:'Build your box',text:'Choose a freezer plan around household size, favorite proteins, budget, and how long you want your freezer stocked.'},
  {title:'Confirm the route',text:'We group nearby orders into practical delivery days so product quality, timing, and customer expectations stay aligned.'},
  {title:'Stock your freezer',text:'Your order is prepared for freezer-ready meals, emergency food security, and fewer last-minute grocery runs.'}
];

const promises=[
  'Route status comes before a hard delivery promise.',
  'Confirmed routes get the fastest follow-up.',
  'Waitlist ZIPs are grouped with nearby demand.',
  'Phone numbers are used for delivery-ready SMS follow-up.'
];

const routeDays=[
  {area:'Fair Oaks / Carmichael',zips:'95628 / 95608',day:'Tuesday',status:'Collecting nearby orders'},
  {area:'Roseville',zips:'95661 / 95678',day:'Wednesday',status:'Confirmed route'},
  {area:'Rocklin / Lincoln',zips:'95765 / 95677 / 95648',day:'Thursday',status:'Almost full'},
  {area:'Folsom / Orangevale',zips:'95630 / 95662',day:'Friday',status:'Building route'}
];

export default function HowDeliveryWorksPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">How Delivery Works</p><h1>Route-first freezer delivery.</h1><p className="lead">Capital City Provisions starts with your ZIP, then matches your box to a practical Sacramento-area delivery route.</p><div className="actions"><a href="/#quick-route">Check My ZIP</a><a href="/freezer-boxes">Build My Box</a></div></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions delivery route planning"/></section>
  <section className="section"><p className="eyebrow">The Process</p><h2>Clear steps before the truck rolls.</h2><div className="step-row">{steps.map((step,index)=><article key={step.title}><span>{index+1}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div></section>
  <section className="section route-section"><div><p className="eyebrow">Delivery Promise</p><h2>No mystery delivery windows.</h2><p className="lead">The ZIP check helps customers know whether to reserve now, expect a fast follow-up, or join the route waitlist while nearby orders are grouped.</p></div><div className="route-list">{promises.map(promise=><article key={promise}><h3>{promise}</h3><p>Built into the customer lead flow.</p></article>)}</div></section>
  <section className="section"><p className="eyebrow">Current Route Days</p><h2>Sacramento-area delivery planning.</h2><div className="delivery-grid">{routeDays.map(route=><article key={route.area} className="marble"><h3>{route.area}</h3><p>{route.zips}</p><strong>{route.day}</strong><p>{route.status}</p></article>)}</div></section>
  <section className="cta poster-frame final-cta"><p className="eyebrow">Start Here</p><h2>Check the route, then build the box.</h2><p>Your saved ZIP will carry into the Box Concierge so the lead flow starts with the delivery area already known.</p><div className="actions"><a href="/#quick-route">Check My ZIP</a><a href="/contact">Ask About Delivery</a></div></section>
</main>}
