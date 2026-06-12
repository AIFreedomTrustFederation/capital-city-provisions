import RoleAIWorkspace from '../../components/RoleAIWorkspace';
import { customerSnapshot } from '../../lib/ops-memory';
import PublicMobileStickyCTA from '../../components/PublicMobileStickyCTA';

export const metadata={
  title:'Get Help Choosing | Capital City Provisions',
  description:'Customer help for freezer boxes, delivery routes, bonuses, and giveaway clarity.'
};

export default function CustomerConciergePage(){
  return (
    <main className="mvp-shell">
      <section className="site page-flow">
        <section className="section mvp-panel">
          <p className="mvp-eyebrow">Get Help Choosing</p>
          <h1 className="mvp-title">Not sure what box fits?</h1>
          <p className="mvp-subtitle">Tell us your ZIP, household size, freezer space, favorite cuts, and delivery questions. Keep it simple before anything is final.</p>
          <div className="mvp-actions">
            <a className="mvp-button" href="/customer#customer-account-journey">Request Quote</a>
            <a className="mvp-button-gold" href="/customer#delivery-zone-check">Check ZIP</a>
            <a className="mvp-button-secondary" href="/freezer-boxes">View Boxes</a>
          </div>
        </section>
      </section>
      <RoleAIWorkspace role="customer" title="CCP Concierge" subtitle="Let CCP help match your freezer box, ZIP route, and delivery plan before anything is final." memory={customerSnapshot('95661')}/>
      <PublicMobileStickyCTA/>
    </main>
  );
}
