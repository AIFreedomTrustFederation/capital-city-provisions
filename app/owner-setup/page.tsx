import AccessGate from '../../components/AccessGate';
import OwnerSetupAI from '../../components/OwnerSetupAI';

export const metadata={title:'Owner Setup | Capital City Provisions',description:'Owner setup workspace for department routing and command center preferences.'};

export default function OwnerSetupPage(){return <AccessGate role="owner"><main className="site page-flow ops-shell"><section className="page-hero poster-frame ops-hero"><div><p className="eyebrow">Owner Setup</p><h1>Prepare the control room.</h1><p className="lead">Confirm owner identity, department routing, and backup handling before using Owner AI.</p><div className="actions"><a href="#owner-setup-ai">Setup AI</a><a href="/owner">Owner Command</a><a href="/billing">Billing</a></div></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions owner setup"/></section><OwnerSetupAI/></main></AccessGate>}
