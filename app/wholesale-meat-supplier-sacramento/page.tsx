export const metadata={
  title:'Wholesale Meat Supplier Sacramento | Capital City Provisions',
  description:'Wholesale meat supplier for Sacramento restaurants, food trucks, caterers, lodges, churches, events, and recurring protein accounts.'
};

const accounts=['Restaurants','Food trucks','Caterers','Lodges','Churches','Events'];

export default function WholesaleMeatSupplierSacramentoPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">Wholesale Meat Supplier Sacramento</p><h1>Wholesale protein supply for Sacramento kitchens and events.</h1><p className="lead">Plan recurring beef, poultry, pork, seafood, and freezer-box volume with route-aware fulfillment.</p><div className="actions"><a href="/wholesale">Wholesale Accounts</a><a href="/contact">Request Pricing</a></div></div><img src="/images/freezer-owner.png" alt="Wholesale meat supplier Sacramento"/></section>
  <section className="section"><p className="eyebrow">Accounts</p><h2>Built for groups that feed people.</h2><div className="grid">{accounts.map(account=><article key={account}><h3>{account}</h3><p>Request recurring availability, delivery planning, and custom account pricing.</p></article>)}</div></section>
</main>}
