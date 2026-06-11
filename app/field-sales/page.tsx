import AccessGate from '../../components/AccessGate';
import FieldSalesKnockMode from '../../components/FieldSalesKnockMode';

export const metadata={title:'Field Sales | Capital City Provisions',description:'Driver and field-rep door-to-door sales capture for ZIP-aware freezer-box leads.'};

export default function FieldSalesPage(){return <AccessGate role="driver"><main className="site page-flow ops-shell"><section className="page-hero poster-frame ops-hero"><div><p className="eyebrow">Field Sales</p><h1>Knock doors, capture real demand, protect the route promise.</h1><p className="lead">Every cold door-to-door contact is classified by ZIP, status, estimated value, and follow-up need before it enters the live sales queue.</p><div className="actions"><a href="#field-sales-knock">Start Knock Capture</a><a href="/driver">Driver Route</a><a href="/service-area-intelligence">ZIP Map</a></div></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions field sales"/></section><FieldSalesKnockMode/></main></AccessGate>}
