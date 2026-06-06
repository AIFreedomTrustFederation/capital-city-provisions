import AccessGate from '../../components/AccessGate';
import DriverSalesRouteMode from '../../components/DriverSalesRouteMode';
import { driverSnapshot } from '../../lib/ops-memory';

export const metadata={title:'Driver Sales Route | Capital City Provisions',description:'Mobile-only protected driver sales-route mode for delivery stops, on-site selling, queued route opportunities, and AI-assisted customer scripts.'};

export default function DriverSalesPage(){
  const memory=driverSnapshot('Marco');
  return <AccessGate role="driver">
    <main className="site page-flow ops-shell driver-sales-page">
      <section className="page-hero poster-frame ops-hero sales-mobile-hero">
        <div>
          <p className="eyebrow">Mobile driver sales mode</p>
          <h1>Delivery board meets field sales queue.</h1>
          <p className="lead">Built for phones in the field: complete stops, capture nearby demand, reserve the next freezer box, and feed smarter route growth back to the team.</p>
          <div className="actions"><a href="#sales-route-mode">Open Sales Route</a><a href="/driver">Back To Driver Ops</a></div>
        </div>
        <img src="/images/capital-city-hero.png" alt="Capital City Provisions sales route mode"/>
      </section>
      <section className="section sales-desktop-lock poster-frame">
        <div>
          <p className="eyebrow">Phone-only tool</p>
          <h1>Open Sales Route Mode on a driver phone.</h1>
          <p className="lead">This workflow is intentionally mobile-only because it is made for active deliveries, quick route decisions, navigation, and one-handed sale queueing in the field.</p>
          <div className="actions"><a href="/driver">Back To Driver Ops</a></div>
        </div>
      </section>
      <DriverSalesRouteMode memory={memory}/>
      <style>{`@media(min-width:781px){.sales-mobile-hero{display:none!important}}@media(max-width:780px){.sales-desktop-lock{display:none!important}}`}</style>
    </main>
  </AccessGate>
}
