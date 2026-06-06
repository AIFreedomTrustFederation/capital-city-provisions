import AccessGate from '../../components/AccessGate';
import DriverSalesRouteMode from '../../components/DriverSalesRouteMode';
import { driverSnapshot } from '../../lib/ops-memory';

export const metadata={title:'Driver Sales Route | Capital City Provisions',description:'Protected driver sales-route mode for delivery stops, on-site selling, queued route opportunities, and AI-assisted customer scripts.'};

export default function DriverSalesPage(){
  const memory=driverSnapshot('Marco');
  return <AccessGate role="driver">
    <main className="site page-flow ops-shell">
      <section className="page-hero poster-frame ops-hero">
        <div>
          <p className="eyebrow">Driver sales mode</p>
          <h1>Delivery board meets field sales queue.</h1>
          <p className="lead">Built for drivers who are completing stops, capturing nearby demand, reserving the next freezer box, and feeding smarter route growth back to the team.</p>
          <div className="actions"><a href="#sales-route-mode">Open Sales Route</a><a href="/driver">Back To Driver Ops</a></div>
        </div>
        <img src="/images/capital-city-hero.png" alt="Capital City Provisions sales route mode"/>
      </section>
      <DriverSalesRouteMode memory={memory}/>
    </main>
  </AccessGate>
}
