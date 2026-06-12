import AccessGate from '../../components/AccessGate';

export const metadata={
  title:'Team Gate | Capital City Provisions',
  description:'Internal team access for Capital City Provisions.'
};

export default function TeamPage(){
  return (
    <AccessGate role="owner">
      <main className="site page-flow">
        <section className="section">
          <p className="eyebrow">Team Gate</p>
          <h1>Internal team tools.</h1>
          <p>Use the owner access code to open protected diagnostics and operations tools.</p>
          <div className="actions">
            <a href="/team/dev">Dev Only AI Status Board</a>
            <a href="/owner">Owner Command Center</a>
            <a href="/driver">Driver Portal</a>
          </div>
        </section>
      </main>
    </AccessGate>
  );
}
