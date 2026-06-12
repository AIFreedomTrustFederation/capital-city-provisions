import DeliveryZoneCheck from '../../components/DeliveryZoneCheck';
import CustomerAccountJourney from '../../components/CustomerAccountJourney';
import CustomerServiceRating from '../../components/CustomerServiceRating';
import CustomerDepositIntent from '../../components/CustomerDepositIntent';
import PublicMobileStickyCTA from '../../components/PublicMobileStickyCTA';

export const metadata={
  title:'Customer Portal | Capital City Provisions',
  description:'Start a freezer box quote, check delivery fit, review next steps, and send service feedback.'
};

const portalSteps=[
  {title:'Start Quote',text:'Send your ZIP, freezer space, household size, budget, and favorite proteins.',href:'#customer-account-journey'},
  {title:'Delivery Fit',text:'Check the ZIP and grouped route fit before anything is final.',href:'#delivery-zone-check'},
  {title:'After Delivery',text:'Rate service, request recovery help, reorder, or join monthly restocks.',href:'#customer-rating'},
];

export default function CustomerPage(){
  return (
    <main className="site page-flow mvp-shell">
      <section className="section mvp-panel">
        <p className="mvp-eyebrow">Customer Portal</p>
        <h1 className="mvp-title">Your freezer box starts here.</h1>
        <p className="mvp-subtitle">Use this simple page to request a quote, check delivery fit, save your next step, and send feedback after service.</p>
        <div className="mvp-actions">
          <a className="mvp-button" href="#customer-account-journey">Request Quote</a>
          <a className="mvp-button-gold" href="#delivery-zone-check">Check ZIP</a>
          <a className="mvp-button-secondary" href="/pay">Deposit / Invoice</a>
          <a className="mvp-button-secondary" href="/giveaway">Enter Giveaway</a>
          <a className="mvp-button-secondary" href="/customer-concierge">Get Help Choosing</a>
        </div>
      </section>

      <section className="section mvp-grid-3">
        {portalSteps.map((step,index)=>(
          <article className="mvp-card" key={step.title}>
            <span className="mvp-number">{index+1}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
            <a className="mvp-link-pill" href={step.href}>Open</a>
          </article>
        ))}
      </section>

      <section className="section mvp-panel">
        <p className="mvp-eyebrow">Delivery Check</p>
        <h2 className="mvp-title">Check your ZIP first.</h2>
        <DeliveryZoneCheck/>
      </section>

      <CustomerAccountJourney/>

      <CustomerDepositIntent/>

      <section className="section mvp-panel">
        <p className="mvp-eyebrow">Service Feedback</p>
        <h2 className="mvp-title">After service, close the loop.</h2>
        <p className="mvp-subtitle">A good rating can trigger a reorder or testimonial follow-up. A poor rating creates a recovery case so the team can fix it.</p>
        <CustomerServiceRating/>
      </section>

      <section className="section mvp-panel">
        <p className="mvp-eyebrow">Need help?</p>
        <h2 className="mvp-title">Get help choosing.</h2>
        <p className="mvp-subtitle">Not sure what box fits? We can help with freezer size, household size, favorite cuts, delivery timing, and giveaway questions.</p>
        <div className="mvp-actions">
          <a className="mvp-button" href="/customer-concierge">Get Help Choosing</a>
          <a className="mvp-button-secondary" href="/contact">Contact Us</a>
          <a className="mvp-button-secondary" href="/">Back Home</a>
        </div>
      </section>

      <PublicMobileStickyCTA/>
    </main>
  );
}
