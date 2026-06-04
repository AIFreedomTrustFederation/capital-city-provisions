const products = ['Prime beef bundles', 'Family freezer boxes', 'Poultry provisions', 'Pork selections', 'Seafood boxes', 'Bulk family packs'];

export default function Home() {
  return (
    <main className="site">
      <section className="hero">
        <p className="eyebrow">Capital City Provisions</p>
        <h1>Premium ranch quality, modern convenience, and practical food security.</h1>
        <p className="lead">A hybrid provisioning company combining trusted American farm sourcing, luxury butcher-style presentation, and freezer-ready food solutions for families, businesses, and communities.</p>
        <div className="actions">
          <a href="#order">Reserve a Freezer Box</a>
          <a href="#products">View Provisions</a>
        </div>
      </section>
      <section id="products" className="section">
        <p className="eyebrow">What We Supply</p>
        <h2>Curated meats and provisions for everyday meals, special gatherings, and long-term household readiness.</h2>
        <div className="grid">
          {products.map((item) => <article key={item}><h3>{item}</h3><p>Premium sourcing, practical portions, dependable planning, and direct-to-customer convenience.</p></article>)}
        </div>
      </section>
      <section className="section split">
        <div><p className="eyebrow">The Mission</p><h2>Not just delivery. Provisioning with purpose.</h2></div>
        <p>Capital City Provisions is being built as a premium food distribution brand that can serve household subscriptions, local delivery routes, community resilience, event needs, and future wholesale relationships without losing its farm-to-table trust.</p>
      </section>
      <section className="section split">
        <div><p className="eyebrow">Brand Promise</p><h2>Ranch trust. Steakhouse polish. Freezer-box practicality.</h2></div>
        <p>The goal is simple: make high-quality food feel accessible, reliable, and worth gathering around while giving customers a stronger way to stock their homes.</p>
      </section>
      <section id="order" className="cta">
        <h2>Reserve your first freezer box.</h2>
        <p>Online ordering, subscriptions, and delivery scheduling are being prepared. Early customers can request availability, product options, and launch updates.</p>
        <a href="mailto:hello@capitalcityprovisions.com">Contact Us</a>
      </section>
    </main>
  );
}
