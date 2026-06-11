import AccessGate from '../../components/AccessGate';
import ProfileSetupMini from '../../components/ProfileSetupMini';

export const metadata={title:'Driver Profile | Capital City Provisions',description:'Driver profile workspace.'};

export default function DriverProfilePage(){return <AccessGate role="driver"><main className="site page-flow ops-shell"><section className="page-hero poster-frame ops-hero"><div><p className="eyebrow">Driver Profile</p><h1>Driver profile setup.</h1><p className="lead">Save the profile used by Driver AI.</p><div className="actions"><a href="#profile-setup">Setup Profile</a><a href="/driver-messages">Messages</a></div></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions driver profile"/></section><ProfileSetupMini/></main></AccessGate>}
