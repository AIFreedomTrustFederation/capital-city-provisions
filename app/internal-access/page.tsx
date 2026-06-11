import AccessGate from '../../components/AccessGate';
import InternalOpsHub from '../../components/InternalOpsHub';

export const metadata={title:'Internal Access | Capital City Provisions',description:'Secure access for Capital City Provisions driver and owner workspaces.'};

type PageProps={searchParams?:Promise<{role?:string}>};

export default async function InternalAccessPage({searchParams}:PageProps){
  const params=await searchParams;
  const role=params?.role==='driver'?'driver':'owner';
  return <AccessGate role={role}><main className="site page-flow ops-shell"><section className="page-hero poster-frame ops-hero"><div><p className="eyebrow">Internal Gate</p><h1>{role==='owner'?'Owner command front door.':'Driver workday front door.'}</h1><p className="lead">Pick the engine you need without hunting through separate internal pages.</p><div className="actions"><a href="/internal-access?role=owner">Owner View</a><a href="/internal-access?role=driver">Driver View</a></div></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions internal operations"/></section><InternalOpsHub role={role}/></main></AccessGate>;
}
