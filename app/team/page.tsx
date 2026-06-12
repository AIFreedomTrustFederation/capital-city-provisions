import AccessGate from '../../components/AccessGate';

export const metadata={
  title:'Team Gate | Capital City Provisions',
  description:'Internal team launchpad for Capital City Provisions.'
};

const links=[
  {title:'Owner Command',text:'Daily control room, customer operations, internal board, sales, delivery, closeout.',href:'/owner',kind:'primary'},
  {title:'Dev Status',text:'Dev-only AI status, route health, persistence mode, public language safety.',href:'/team/dev',kind:'gold'},
  {title:'Driver Portal',text:'Driver tasks, route execution, turn-ins, and delivery closeout.',href:'/driver',kind:'secondary'},
  {title:'Customer Preview',text:'Preview the customer quote, delivery, rating, and restock path.',href:'/customer',kind:'secondary'},
];

export default function TeamPage(){
  return (
    <AccessGate role="owner">
      <main className="site page-flow mvp-shell">
        <section className="section mvp-panel">
          <p className="mvp-eyebrow">Team Gate</p>
          <h1 className="mvp-title">Internal launchpad.</h1>
          <p className="mvp-subtitle">One protected place to open owner operations, dev diagnostics, driver execution, and customer preview flows.</p>
        </section>

        <section className="section mvp-grid-2">
          {links.map(link=>(
            <article className="mvp-card" key={link.href}>
              <h3>{link.title}</h3>
              <p>{link.text}</p>
              <a className={link.kind==='primary'?'mvp-button':link.kind==='gold'?'mvp-button-gold':'mvp-button-secondary'} href={link.href}>Open {link.title}</a>
            </article>
          ))}
        </section>
      </main>
    </AccessGate>
  );
}
