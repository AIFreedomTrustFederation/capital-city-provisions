import AccessGate from '../../components/AccessGate';
import DriverSetupAI from '../../components/DriverSetupAI';

export const metadata={title:'Driver Setup | Capital City Provisions',description:'Driver setup workspace for route communication preferences.'};

export default function DriverSetupPage(){return <AccessGate role="driver"><main className="site page-flow ops-shell"><section className="page-hero poster-frame ops-hero"><div><p className="eyebrow">Driver Setup</p><h1>Prepare the driver workspace.</h1><p className="lead">Confirm driver identity and customer-message routing before route work begins.</p><div className="actions"><a href="#driver-setup-ai">Setup AI</a><a href="/driver-messages">Messages</a><a href="/driver-appointments">Appointments</a></div></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions driver setup"/></section><DriverSetupAI/></main></AccessGate>}
