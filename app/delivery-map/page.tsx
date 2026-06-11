import DeliveryZoneCheck from '../../components/DeliveryZoneCheck';

export const metadata={
  title:'Delivery Areas | Capital City Provisions',
  description:'Check Capital City Provisions delivery availability for Rancho Cordova, Sacramento, Folsom, Roseville, Rocklin, Elk Grove, Davis, and nearby one-hour ZIPs.'
};

const zones=[
  {name:'Rancho Cordova Hub',day:'Priority routing',fill:'90%',status:'Active local delivery',eta:'Fastest grouped window',zips:'95670 / 95742 / 95827'},
  {name:'Folsom / Fair Oaks / Carmichael',day:'Core route',fill:'70%',status:'Adding nearby orders',eta:'5-10 days',zips:'95630 / 95628 / 95608'},
  {name:'Roseville / Granite Bay / Rocklin',day:'North route',fill:'80%',status:'Group route recommended',eta:'3-7 days',zips:'95661 / 95746 / 95765'},
  {name:'Elk Grove / West Sac / Davis',day:'South-West route',fill:'55%',status:'Opening grouped windows',eta:'7-10 days',zips:'95624 / 95691 / 95616'}
];
const rules=['Timing follows inventory and area demand.','Nearby orders help unlock better delivery days.','Confirmation happens before product is packed.'];

export default function DeliveryMap(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">Delivery Areas</p><h1>See where we are moving next.</h1><p className="lead">Check active and upcoming areas before you build a box, request steaks, or ask about wholesale supply.</p><div className="actions"><a href="#delivery-zone-check">Check My ZIP</a><a href="/freezer-boxes">Build My Box</a><a href="/contact">Ask About My ZIP</a></div></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions delivery area"/></section>
  <DeliveryZoneCheck/>
  <section className="section"><p className="eyebrow">Area Status</p><h2>Local availability at a glance.</h2><div className="delivery-grid">{zones.map(z=><article key={z.name} className="marble"><h3>{z.name}</h3><p>{z.zips}</p><p>{z.day}</p><div className="progress"><span style={{width:z.fill}}></span></div><p>Fill: {z.fill}</p><p>{z.status}</p><strong>ETA: {z.eta}</strong></article>)}</div></section>
  <section className="section route-section"><div><p className="eyebrow">How We Think</p><h2>Better timing beats guesswork.</h2><p className="lead">The goal is to protect quality, communicate clearly, and group demand in a way that makes delivery worth doing right.</p></div><div className="route-list">{rules.map(rule=><article key={rule}><h3>{rule}</h3><p>A cleaner promise for customers and the delivery team.</p></article>)}</div></section>
</main>}
