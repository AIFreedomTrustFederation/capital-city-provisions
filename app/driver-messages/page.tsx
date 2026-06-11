import AccessGate from '../../components/AccessGate';
import DriverMessageCenter from '../../components/DriverMessageCenter';

export const metadata={title:'Driver Messages | Capital City Provisions',description:'Driver customer message workspace.'};

export default function DriverMessagesPage(){return <AccessGate role="driver"><main className="site page-flow ops-shell"><section className="page-hero poster-frame ops-hero"><div><p className="eyebrow">Driver Messages</p><h1>Customer route messages.</h1><p className="lead">Prepare customer updates from the driver workspace.</p><div className="actions"><a href="#driver-message-center">Open Messages</a><a href="/driver-appointments">Appointments</a><a href="/field-sales">Field Sales</a></div></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions driver messages"/></section><DriverMessageCenter/></main></AccessGate>}
