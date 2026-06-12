import DeliveryZoneCheck from '../../components/DeliveryZoneCheck';

export const metadata={
  title:'Monthly Restock Club | Capital City Provisions',
  description:'Recurring freezer restock planning for Sacramento-area households that want premium proteins, route-aware delivery, and less grocery-store scrambling.'
};

const rhythms=[
  {title:'Light Restock',fit:'Couples, small freezers, and lighter cooking weeks',text:'A practical refill for core proteins without overfilling the freezer.'},
  {title:'Family Restock',fit:'Busy households cooking at home most weeks',text:'Balanced beef, chicken, pork, and flexible meal staples sized around the family rhythm.'},
  {title:'Steak-Forward Restock',fit:'Grill nights and premium beef buyers',text:'A beef-first restock path for customers who want steaks, burger, roasts, and steakhouse-style variety.'},
  {title:'Reserve Restock',fit:'Large families and food-security planners',text:'A deeper recurring plan for customers who want a serious stocked-home buffer.'}
];

const reasons=['Cuts planned around how the household actually cooks','Delivery timing stays tied to ZIP and grouped route availability','Budget and freezer space can be adjusted before each restock','Customers can move between family, steak, and reserve priorities'];

export default function MonthlyRestockPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">Monthly Restock Club</p><h1>Keep the freezer ready without starting over every month.</h1><p className="lead">A simple recurring restock path for families, steak buyers, and prepared households that want useful proteins planned around route timing, budget, and freezer space.</p><div className="actions"><a href="#delivery-zone-check">Check ZIP</a><a href="/contact">Request Restock Plan</a></div></div><img src="/images/freezer-family.png" alt="Monthly freezer restock planning"/></section>
  <DeliveryZoneCheck/>
  <section className="section"><p className="eyebrow">Restock Options</p><h2>Choose the rhythm before choosing every cut.</h2><div className="grid">{rhythms.map(item=><article key={item.title}><p className="eyebrow">{item.fit}</p><h3>{item.title}</h3><p>{item.text}</p><a href="/contact">Request This Plan</a></article>)}</div></section>
  <section className="section route-section"><div><p className="eyebrow">Why It Works</p><h2>Restock planning beats emergency grocery runs.</h2><p className="lead">The goal is not random bulk. The goal is a freezer that keeps producing real meals your household actually wants to cook.</p></div><div className="route-list">{reasons.map(reason=><article key={reason}><h3>{reason}</h3><p>Confirmed before the next restock is treated as final.</p></article>)}</div></section>
  <section className="cta poster-frame final-cta"><p className="eyebrow">Start</p><h2>Begin with your ZIP and household rhythm.</h2><p>From there, Capital City Provisions can match the right restock level, cuts, delivery timing, and follow-up.</p><div className="actions"><a href="#delivery-zone-check">Check Delivery</a><a href="/freezer-boxes">Compare Freezer Boxes</a></div></section>
</main>}
