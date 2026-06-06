export const metadata={
  title:'Food Security Freezer Boxes | Capital City Provisions',
  description:'Freezer stocking, emergency meal planning, monthly provisioning, and family food security boxes for Sacramento-area households.'
};

const needs=[
  {title:'Families',text:'Build a dependable protein reserve around weekly dinners, school nights, and fewer emergency grocery trips.'},
  {title:'Emergency Meals',text:'Keep freezer-ready proteins available for power weeks, tight schedules, and household backup planning.'},
  {title:'Monthly Provisioning',text:'Plan a recurring freezer cadence by budget, route, family size, and preferred proteins.'},
  {title:'Freezer Planning',text:'Match the box size to freezer capacity so the order is useful, organized, and realistic.'}
];

export default function FoodSecurityFreezerBoxesPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">Food Security</p><h1>Freezer stocking for families who plan ahead.</h1><p className="lead">Capital City Provisions helps households turn premium protein delivery into a practical food-security plan.</p><div className="actions"><a href="/family-freezer-boxes">View Freezer Boxes</a><a href="/#quick-route">Check My Route</a></div></div><img src="/images/freezer-rancher.png" alt="Food security freezer box"/></section>
  <section className="section"><p className="eyebrow">Freezer Stocking</p><h2>Everyday meals and backup meals in one plan.</h2><div className="delivery-grid">{needs.map(need=><article key={need.title} className="marble"><h3>{need.title}</h3><p>{need.text}</p></article>)}</div></section>
  <section className="cta poster-frame final-cta"><p className="eyebrow">Start Planning</p><h2>Use your ZIP and household size first.</h2><p>The Box Concierge captures route, family size, protein preferences, phone, and monthly budget for follow-up.</p><div className="actions"><a href="/#quick-route">Check My ZIP</a><a href="/freezer-boxes">Compare Boxes</a></div></section>
</main>}
