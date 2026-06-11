import AccessGate from '../../components/AccessGate';

export const metadata={title:'AI Memory | Capital City Provisions',description:'Persistent AI conversation memory ledger for internal operations.'};

type PageProps={searchParams?:Promise<{role?:string}>};

export default async function AiMemoryPage({searchParams}:PageProps){
  const params=await searchParams;
  const role=params?.role==='driver'?'driver':'owner';
  return <AccessGate role={role}><main className="site page-flow ops-shell"><section className="page-hero poster-frame ops-hero"><div><p className="eyebrow">AI Memory</p><h1>Persistent command threads.</h1><p className="lead">Conversation sessions are stored by role, subject, and operational context through the AI memory API.</p><div className="actions"><a href={`/api/ai-memory?role=${role}`}>Open Memory API</a><a href="/internal-access">Internal Gate</a><a href="/owner">Owner Command</a><a href="/driver">Driver Route</a></div></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions AI memory"/></section><section className="section"><p className="eyebrow">Status</p><h2>Memory layer is installed.</h2><p>The API route creates the conversation tables when Postgres is available and stores sessions/messages for the unified AI command front end.</p></section></main></AccessGate>
}
