import AccessGate from '../../components/AccessGate';
import ProfileSetupMini from '../../components/ProfileSetupMini';

export const metadata={title:'Owner Setup | Capital City Provisions',description:'Owner setup workspace.'};

export default function OwnerSetupPage(){return <AccessGate role="owner"><main className="site page-flow ops-shell"><section className="page-hero poster-frame ops-hero"><div><p className="eyebrow">Owner Setup</p><h1>Prepare the control room.</h1><p className="lead">Save the owner profile before using the command center.</p><div className="actions"><a href="#profile-setup">Setup Profile</a><a href="/owner">Owner Command</a></div></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions owner setup"/></section><ProfileSetupMini/></main></AccessGate>}
