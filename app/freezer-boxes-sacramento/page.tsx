export const metadata={
  title:'Freezer Boxes Sacramento | Capital City Provisions',
  description:'Sacramento freezer boxes for families, monthly provisioning, emergency meals, and premium protein delivery by local route.'
};

const reasons=['Starter, Family, Rancher, and Premium Owner box paths','Built around household size and freezer space','Route-first delivery expectations','Monthly provisioning and food-security planning'];

export default function FreezerBoxesSacramentoPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">Freezer Boxes Sacramento</p><h1>Freezer boxes for Sacramento-area families.</h1><p className="lead">Build a freezer box around your ZIP, family size, protein preferences, and monthly budget.</p><div className="actions"><a href="/family-freezer-boxes">Compare Family Boxes</a><a href="/#quick-route">Check My Route</a></div></div><img src="/images/freezer-family.png" alt="Freezer boxes Sacramento"/></section>
  <section className="section"><p className="eyebrow">Why It Works</p><h2>Freezer stocking without guesswork.</h2><div className="route-list">{reasons.map(reason=><article key={reason} className="marble"><h3>{reason}</h3><p>Designed for practical Sacramento-area delivery and follow-up.</p></article>)}</div></section>
</main>}