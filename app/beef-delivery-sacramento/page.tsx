export const metadata={
  title:'Beef Delivery Sacramento | Capital City Provisions',
  description:'Sacramento-area beef delivery with steaks, ground beef, roasts, family freezer boxes, and route-based delivery planning.'
};

const beef=['Ribeye and steakhouse cuts','Filet and special-occasion steaks','New York strip and sirloin','Ground beef, roasts, and family staples'];

export default function BeefDeliverySacramentoPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">Beef Delivery Sacramento</p><h1>Premium beef for stocked Sacramento freezers.</h1><p className="lead">Request beef-focused freezer planning with steaks, everyday staples, route status, and delivery follow-up.</p><div className="actions"><a href="/steak-delivery">Steak Delivery</a><a href="/#quick-route">Check Beef Delivery</a></div></div><img src="/images/category-beef.svg" alt="Beef delivery Sacramento"/></section>
  <section className="section"><p className="eyebrow">Beef Options</p><h2>Steaks and everyday freezer staples.</h2><div className="catalog-grid">{beef.map(item=><article key={item}><img src="/images/category-beef.svg" alt={item}/><h3>{item}</h3><p>Ask about current availability and box fit during route follow-up.</p><a href="/#quick-route">Check Route</a></article>)}</div></section>
</main>}
