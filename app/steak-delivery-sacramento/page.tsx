export const metadata={
  title:'Steak Delivery Sacramento | Capital City Provisions',
  description:'Steak delivery in Sacramento with ribeye, filet, New York strip, sirloin, bundles, and freezer-ready delivery planning.'
};

const cuts=['Ribeye','Filet','New York Strip','Sirloin'];

export default function SteakDeliverySacramentoPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">Steak Delivery Sacramento</p><h1>Sacramento steak delivery starts with route fit.</h1><p className="lead">Request premium steak delivery with preferred cuts, freezer budget, and ZIP-based delivery planning.</p><div className="actions"><a href="/steak-delivery">View Steak Page</a><a href="/#quick-route">Check My ZIP</a></div></div><img src="/images/category-beef.svg" alt="Steak delivery Sacramento"/></section>
  <section className="section"><p className="eyebrow">Cuts</p><h2>Build a steak box by preference.</h2><div className="delivery-grid">{cuts.map(cut=><article key={cut} className="marble"><h3>{cut}</h3><p>Request this cut in your steak bundle follow-up.</p></article>)}</div></section>
</main>}
