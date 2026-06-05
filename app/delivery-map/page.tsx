export const metadata={
  title:'Delivery Areas | Capital City Provisions',
  description:'Check Capital City Provisions delivery route status for Roseville, Rocklin, Lincoln, Fair Oaks, Carmichael, Folsom, and Orangevale.'
};

const zones=[
  {name:'Fair Oaks / Carmichael',day:'Tuesday',fill:'70%',status:'Collecting nearby orders',eta:'5-10 days',zips:'95628 / 95608'},
  {name:'Roseville',day:'Wednesday',fill:'100%',status:'Confirmed route',eta:'This week',zips:'95661 / 95678'},
  {name:'Rocklin / Lincoln',day:'Thursday',fill:'80%',status:'Almost full',eta:'3-5 days',zips:'95765 / 95677 / 95648'},
  {name:'Folsom / Orangevale',day:'Friday',fill:'45%',status:'Building route',eta:'7-10 days',zips:'95630 / 95662'}
];
const rules=['Routes run when truck fill and inventory support dependable delivery.','Customers near active routes may be grouped together for better timing.','Delivery promises should follow confirmed stock, route capacity, and customer confirmation.'];

export default function DeliveryMap(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">Customer Route Map</p><h1>Delivery areas and route status.</h1><p className="lead">See which routes are confirmed, almost full, or still collecting nearby orders before reserving a freezer box.</p><div className="actions"><a href="/freezer-boxes">Reserve Freezer Box</a><a href="/contact">Ask About My ZIP</a></div></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions delivery route"/></section>
  <section className="section"><p className="eyebrow">Route Status</p><h2>Customer delivery promise.</h2><div className="delivery-grid">{zones.map(z=><article key={z.name} className="marble"><h3>{z.name}</h3><p>{z.zips}</p><p>{z.day}</p><div className="progress"><span style={{width:z.fill}}></span></div><p>Route fill: {z.fill}</p><p>{z.status}</p><strong>ETA: {z.eta}</strong></article>)}</div></section>
  <section className="section route-section"><div><p className="eyebrow">Route Logic</p><h2>Realistic delivery beats overpromising.</h2><p className="lead">Capital City Provisions uses route grouping so customers receive practical ETAs and the business protects product quality.</p></div><div className="route-list">{rules.map(rule=><article key={rule}><h3>{rule}</h3><p>Built into the delivery promise.</p></article>)}</div></section>
</main>}
