export const metadata={
  title:'Steak Delivery | Capital City Provisions',
  description:'Premium steak delivery for Sacramento-area households with ribeye, filet, New York strip, sirloin, bundles, and freezer-ready planning.'
};

const cuts=[
  {name:'Ribeye',text:'Rich marbling and steakhouse-style dinners for customers who want a premium centerpiece.'},
  {name:'Filet',text:'Tender, lean, special-occasion steaks for elevated freezer planning.'},
  {name:'New York Strip',text:'Balanced tenderness and bold beef flavor for recurring steak nights.'},
  {name:'Sirloin',text:'Versatile everyday steak value for families, meal prep, and mixed boxes.'}
];

const bundle=['Steak-night bundles by budget','Surf-and-turf add-ons when available','Family freezer steak allocation','Route-aware delivery follow-up'];

export default function SteakDeliveryPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">Steak Delivery</p><h1>Premium steaks delivered with a freezer plan.</h1><p className="lead">Build a steak box around ribeye, filet, New York strip, sirloin, and practical freezer portions for Sacramento-area route delivery.</p><div className="actions"><a href="/#quick-route">Check Steak Delivery</a><a href="/catalog">View Catalog</a></div></div><img src="/images/category-beef.svg" alt="Premium steak delivery"/></section>
  <section className="section"><p className="eyebrow">Premium Cuts</p><h2>Steaks customers recognize and ask for.</h2><div className="catalog-grid">{cuts.map(cut=><article key={cut.name}><img src="/images/category-beef.svg" alt={`${cut.name} steak delivery`}/><h3>{cut.name}</h3><p>{cut.text}</p><a href="/#quick-route">Check Availability</a></article>)}</div></section>
  <section className="section route-section"><div><p className="eyebrow">Bundle CTA</p><h2>Build a steak bundle before promising delivery.</h2><p className="lead">Steak demand is strongest when the customer can check delivery first, then request a bundle by cut preference and budget.</p></div><div className="route-list">{bundle.map(item=><article key={item}><h3>{item}</h3><p>Use the Box Concierge to capture cut preference, budget, phone, and ZIP.</p></article>)}</div></section>
  <section className="cta poster-frame final-cta"><p className="eyebrow">Reserve Steak Delivery</p><h2>Check your route and request a steak bundle.</h2><p>Tell us your ZIP, preferred cuts, and monthly freezer budget.</p><div className="actions"><a href="/#quick-route">Check My ZIP</a><a href="/contact">Contact Sales</a></div></section>
</main>}
