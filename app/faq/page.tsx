export const metadata={
  title:'FAQ | Capital City Provisions',
  description:'Answers about Capital City Provisions boxes, delivery availability, ZIP checks, waitlists, wholesale accounts, and follow-up.'
};

const faqs=[
  {q:'Why start with my ZIP?',a:'It keeps the recommendation grounded in real local availability instead of guessing.'},
  {q:'What happens after I enter it?',a:'Your ZIP is saved in your browser and carried into the concierge so you do not have to repeat yourself.'},
  {q:'What if my area is not active yet?',a:'You can join the next cluster. Nearby interest helps open cleaner delivery days.'},
  {q:'Which box should I choose?',a:'Starter, Family, Rancher, and Owner options scale by household size, storage space, and how much food you want ready.'},
  {q:'Do you work with wholesale buyers?',a:'Yes. Restaurants, food trucks, caterers, churches, lodges, and event teams can use the wholesale path.'},
  {q:'Can I get updates by text?',a:'The lead flow collects phone details so follow-up can be handled cleanly when the account is ready.'}
];

export default function FAQPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">FAQ</p><h1>Quick answers before you build a box.</h1><p className="lead">The essentials on availability, box options, waitlists, wholesale supply, and follow-up.</p><div className="actions"><a href="/#quick-route">Check ZIP</a><a href="/freezer-boxes">Compare Boxes</a></div></div><img src="/images/freezer-starter.png" alt="Capital City Provisions FAQ"/></section>
  <section className="section"><p className="eyebrow">Questions</p><h2>What most customers ask first.</h2><div className="route-list">{faqs.map(item=><article key={item.q} className="marble"><h3>{item.q}</h3><p>{item.a}</p></article>)}</div></section>
  <section className="cta poster-frame final-cta"><p className="eyebrow">Still Deciding?</p><h2>Start with the fastest signal.</h2><p>Your ZIP tells the concierge what kind of follow-up makes sense.</p><div className="actions"><a href="/#quick-route">Check ZIP</a><a href="/contact">Ask A Question</a></div></section>
</main>}