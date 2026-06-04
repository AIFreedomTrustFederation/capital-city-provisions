const products = ['Beef bundles', 'Freezer boxes', 'Poultry', 'Pork', 'Seafood', 'Family packs'];

export default function Home() {
  return (
    <main className="site">
      <section className="hero">
        <p className="eyebrow">Capital City Provisions</p>
        <h1>Premium provisions from trusted American producers to your table.</h1>
        <p className="lead">Farm-sourced meats, seafood, poultry, and curated freezer-box solutions for households, businesses, and communities.</p>
        <div className="actions">
          <a href="#order">Start an Order</a>
          <a href="#products">View Products</a>
        </div>
      </section>
      <section id="products" className="section">
        <p className="eyebrow">What We Supply</p>
        <h2>Quality food provisioning built for modern families and local resilience.</h2>
        <div className="grid">
          {products.map((item) => <article key={item}><h3>{item}</h3><p>Dependable sourcing, practical portions, and direct-to-customer convenience.</p></article>)}
        </div>
      </section>
      <section className="section split">
        <div><p className="eyebrow">The Mission</p><h2>Not just delivery. Provisioning.</h2></div>
        <p>Capital City Provisions is being built as a premium food distribution brand that can serve families, subscriptions, local delivery routes, community needs, and future wholesale relationships.</p>
      </section>
      <section id="order" className="cta">
        <h2>Reserve your first freezer box.</h2>
        <p>Online ordering, subscriptions, and delivery scheduling are being prepared.</p>
        <a href="mailto:aifreedomtrust@gmail.com">Contact Us</a>
      </section>
    </main>
  );
}
