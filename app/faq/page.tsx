export const metadata={
  title:'FAQ | Capital City Provisions',
  description:'Answers to common questions about Capital City Provisions freezer boxes, Sacramento-area delivery routes, ZIP checks, waitlists, and wholesale accounts.'
};

const faqs=[
  {q:'Do I need to check my ZIP first?',a:'Yes. The ZIP check helps show whether your area is confirmed, almost full, building, or waitlisted before you choose a freezer box.'},
  {q:'What happens after I enter my ZIP?',a:'Your ZIP is saved in your browser and carried into the Box Concierge so the lead flow starts with your delivery area already known.'},
  {q:'What if my ZIP is not on an active route?',a:'You can join the waitlist. Nearby ZIPs are grouped together so a practical route can be built without overpromising.'},
  {q:'What are the freezer box options?',a:'Starter Box, Family Box, Rancher Box, and Owner Box cover smaller homes, family restocks, large freezers, and bulk provisioning.'},
  {q:'Do you support wholesale accounts?',a:'Yes. Restaurants, food trucks, caterers, lodges, churches, events, and recurring community accounts can use the wholesale path.'},
  {q:'Will you text delivery updates?',a:'The lead form collects SMS-ready phone fields so delivery follow-up can be handled by text when the account is ready for it.'}
];

export default function FAQPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">FAQ</p><h1>Answers before you reserve.</h1><p className="lead">Common questions about ZIP checks, route days, freezer boxes, waitlists, wholesale supply, and delivery follow-up.</p><div className="actions"><a href="/#quick-route">Check My ZIP</a><a href="/freezer-boxes">Compare Boxes</a></div></div><img src="/images/freezer-starter.png" alt="Capital City Provisions freezer box FAQ"/></section>
  <section className="section"><p className="eyebrow">Questions</p><h2>Delivery and freezer-box basics.</h2><div className="route-list">{faqs.map(item=><article key={item.q} className="marble"><h3>{item.q}</h3><p>{item.a}</p></article>)}</div></section>
  <section className="cta poster-frame final-cta"><p className="eyebrow">Still Deciding?</p><h2>Start with the ZIP check.</h2><p>It is the fastest way to understand route status before choosing a box.</p><div className="actions"><a href="/#quick-route">Check My ZIP</a><a href="/contact">Ask A Question</a></div></section>
</main>}
