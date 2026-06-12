export const metadata={
  title:'Food Security Freezer Boxes | Capital City Provisions',
  description:'Stocked-home planning, emergency meal support, monthly provisioning, and practical protein boxes for Sacramento-area households.'
};

const needs=[
  {title:'Families',text:'Keep useful protein on hand for school nights, work weeks, and the nights nobody wants to shop.'},
  {title:'Backup Meals',text:'Build a reliable reserve for schedule crunches, tighter weeks, and unexpected guests.'},
  {title:'Monthly Planning',text:'Set a simple cadence around budget, household size, and the cuts you actually cook.'},
  {title:'Space Strategy',text:'Match the order to available storage so the box is organized, useful, and easy to work through.'}
];

export default function FoodSecurityFreezerBoxesPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">Food Security</p><h1>Stocked-home planning without the panic.</h1><p className="lead">A practical way to keep real meals available for busy weeks, emergencies, and long-range household planning.</p><div className="actions"><a href="/family-freezer-boxes">View Boxes</a><a href="/#quick-route">Check ZIP</a></div></div><img src="/images/freezer-rancher.png" alt="Stocked-home planning box"/></section>
  <section className="section"><p className="eyebrow">Home Reserve</p><h2>Everyday meals and backup options in one system.</h2><div className="delivery-grid">{needs.map(need=><article key={need.title} className="marble"><h3>{need.title}</h3><p>{need.text}</p></article>)}</div></section>
  <section className="cta poster-frame final-cta"><p className="eyebrow">Plan Ahead</p><h2>Start with ZIP, household size, and budget.</h2><p>The concierge captures the essentials so follow-up can be specific instead of generic.</p><div className="actions"><a href="/#quick-route">Check ZIP</a><a href="/freezer-boxes">Compare Boxes</a></div></section>
</main>}