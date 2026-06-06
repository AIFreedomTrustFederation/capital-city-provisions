export const metadata={
  title:'Thank You | Capital City Provisions',
  description:'Your Capital City Provisions route and freezer-box request was received. See what happens next and continue planning your box.'
};

const next=['We review your ZIP and route status.','We match the request to freezer-box size, protein preference, and budget.','If you shared a phone number, your lead is ready for SMS follow-up.','Confirmed and nearly full routes get priority follow-up.'];
const email=['Subject: Your Capital City Provisions route request','Thanks for checking your delivery route with Capital City Provisions. We received your ZIP, freezer-box interest, and preferred follow-up details. Our team will review route status, product fit, and delivery timing before confirming next steps.'];

export default function ThankYouPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">Request Received</p><h1>Your freezer-box request is in.</h1><p className="lead">We will use your delivery ZIP, route status, and box preferences to plan the next follow-up.</p><div className="actions"><a href="/family-freezer-boxes">Continue Box Planning</a><a href="/how-delivery-works">How Delivery Works</a></div></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions confirmation"/></section>
  <section className="section route-section"><div><p className="eyebrow">What Happens Next</p><h2>Route first, box second, follow-up third.</h2><p className="lead">This confirmation page gives customers a clear handoff after submitting a route or box request.</p></div><div className="route-list">{next.map(item=><article key={item}><h3>{item}</h3><p>Designed to reduce confusion after lead capture.</p></article>)}</div></section>
  <section className="section"><p className="eyebrow">Thank-You Email Language</p><h2>Ready for automation.</h2><div className="route-list">{email.map(line=><article key={line}><h3>{line}</h3><p>Use this language for the first email or SMS-adjacent follow-up workflow.</p></article>)}</div></section>
</main>}
