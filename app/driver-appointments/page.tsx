import AccessGate from '../../components/AccessGate';
import DriverAppointmentsWithMessages from '../../components/DriverAppointmentsWithMessages';

export const metadata={title:'Driver Appointments | Capital City Provisions',description:'Driver view for Capital City Provisions delivery appointments.'};

export default function DriverAppointmentsPage(){return <AccessGate role="driver"><main className="site page-flow ops-shell"><section className="page-hero poster-frame ops-hero"><div><p className="eyebrow">Driver Appointments</p><h1>Confirmed delivery windows.</h1><p className="lead">Review scheduled customers and prepare route updates.</p><div className="actions"><a href="#driver-appointments">View Appointments</a><a href="/driver">Driver Route</a><a href="/field-sales">Field Sales</a></div></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions driver appointments"/></section><DriverAppointmentsWithMessages/></main></AccessGate>}
