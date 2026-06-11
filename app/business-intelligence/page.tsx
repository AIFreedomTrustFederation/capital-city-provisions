import AccessGate from '../../components/AccessGate';
import OperatorBrainPanel from '../../components/OperatorBrainPanel';

export const metadata={title:'Business Intelligence | Capital City Provisions',description:'Owner-only operating intelligence for ZIP demand, route focus, inventory risk, sales priorities, and next actions.'};

export default function BusinessIntelligencePage(){return <AccessGate role="owner"><main className="site page-flow ops-shell"><section className="page-hero poster-frame ops-hero"><div><p className="eyebrow">Owner intelligence</p><h1>Business Intelligence.</h1><p className="lead">See what the business should do first from live demand, route, inventory, and sales signals.</p><div className="actions"><a href="#operator-brain">View Recommendations</a><a href="/owner">Owner Command</a></div></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions business intelligence"/></section><OperatorBrainPanel/></main></AccessGate>}
