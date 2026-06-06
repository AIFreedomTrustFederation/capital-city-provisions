export const metadata={
  title:'Delivery Areas | Capital City Provisions',
  description:'Check Capital City Provisions delivery availability for Roseville, Rocklin, Lincoln, Fair Oaks, Carmichael, Folsom, and Orangevale.'
};

const zones=[
  {name:'Fair Oaks / Carmichael',day:'Tuesday',fill:'70%',status:'Adding nearby orders',eta:'5-10 days',zips:'95628 / 95608'},
  {name:'Roseville',day:'Wednesday',fill:'100%',status:'Confirmed',eta:'This week',zips:'95661 / 95678'},
  {name:'Rocklin / Lincoln',day:'Thursday',fill:'80%',status:'Nearly full',eta:'3-5 days',zips:'95765 / 95677 / 95648'},
  {name:'Folsom / Orangevale',day:'Friday',fill:'45%',status:'Opening soon',eta:'7-10 days',zips:'95630 / 95662'}
];
const rules=['Timing follows inventory and area demand.','Nearby orders help unlock better delivery days.','Confirmation happens before product is packed.'];

export default function DeliveryMap(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">Delivery Areas</p><h1>See where we are moving next.</h1><p className="lead">Check active and upcoming areas before you build a box, request steaks, or ask about wholesale supply.</p><div className="actions"><a href="/freezer-boxes">Build My Box</a><a href="/contact">Ask About My ZIP</a></div></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions delivery area"/></section>
  <section className="section"><p className="eyebrow">Area Status</p><h2>Local availability at a glance.</h2><div className="delivery-grid">{zones.map(z=><article key={z.name} className="marble"><h3>{z.name}</h3><p>{z.zips}</p><p>{z.day}</p><div className="progress"><span style={{width:z.fill}}></span></div><p>Fill: {z.fill}</p><p>{z.status}</p><strong>ETA: {z.eta}</strong></article>)}</div></section>
  <section className="section route-section"><div><p className="eyebrow">How We Think</p><h2>Better timing beats guesswork.</h2><p className="lead">The goal is to protect quality, communicate clearly, and group demand in a way that makes delivery worth doing right.</p></div><div className="route-list">{rules.map(rule=><article key={rule}><h3>{rule}</h3><p>A cleaner promise for customers and the delivery team.</p></article>)}</div></section>
</main>}
