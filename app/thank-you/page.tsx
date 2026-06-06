import CustomerConfirmation from '../../components/CustomerConfirmation';

export const metadata={
  title:'Request Saved | Capital City Provisions',
  description:'Your Capital City Provisions stocked-home request is saved. Review next steps, continue your box, and enter the giveaway free.'
};

const next=[
  {title:'We check the route.',text:'Your ZIP tells us whether the area is confirmed, nearly full, building, or waitlist.'},
  {title:'We shape the box.',text:'Household size, proteins, budget, and timing guide the first stocked-home recommendation.'},
  {title:'We confirm before pack-out.',text:'Delivery timing, substitutions, and any premium cut limits are clarified before the route is packed.'},
  {title:'You stay in control.',text:'You can continue, edit, export, or clear saved details from this device.'}
];
const promos=[
  {title:'Cheesecake thank-you gift',text:'A qualifying first stocked-home order reserved within the stated window may receive a cheesecake while supplies last.'},
  {title:'Free giveaway entry',text:'Giveaway entry is free. No purchase is necessary, and buying does not improve odds.'},
  {title:'Clear follow-up',text:'Name, contact, ZIP, route, plan interest, budget, and timing help us avoid repeated questions.'}
];
const emailSubject='Subject: Your Capital City Provisions request is saved';
const emailBody='Thanks for checking your route with Capital City Provisions. We saved your ZIP, stocked-home interest, and follow-up details so the next step is clear. Cheesecake order bonuses are separate from giveaway entry. Giveaway entry is free; no purchase is necessary and purchase does not improve odds.';

export default function ThankYouPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">Request Saved</p><h1>Your stocked-home plan is ready to continue.</h1><p className="lead">We saved the useful pieces: route, box interest, budget, and follow-up details. Nothing needs to pop up again unless you open it.</p><div className="actions"><a href="#saved-confirmation">Review Saved Plan</a><a href="/giveaway">Enter Giveaway Free</a><a href="/how-delivery-works">How Delivery Works</a></div></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions confirmation"/></section>
  <CustomerConfirmation/>
  <section className="section route-section"><div><p className="eyebrow">What Happens Next</p><h2>Simple, local, and route-aware.</h2><p className="lead">The next step is based on your ZIP and the kind of box you want, not a generic checkout script.</p></div><div className="route-list">{next.map(item=><article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>
  <section className="section route-section"><div><p className="eyebrow">Offers And Giveaway</p><h2>Separated clearly.</h2><p className="lead">Order bonuses can reward fast follow-through. Giveaway entry stays free and separate.</p></div><div className="route-list">{promos.map(item=><article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>
  <section className="section"><p className="eyebrow">Follow-Up Language</p><h2>Ready for the first message.</h2><div className="route-list"><article><h3>{emailSubject}</h3><p>{emailBody}</p></article></div><div className="actions"><a href="/official-rules">Official Rules</a><a href="/contact">Contact Sales</a></div></section>
</main>}
