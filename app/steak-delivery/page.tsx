export const metadata={
  title:'Steak Delivery | Capital City Provisions',
  description:'Steak delivery for Sacramento-area households with ribeye, filet, New York strip, sirloin, bundles, and stocked-home planning.'
};

const cuts=[
  {name:'Ribeye',text:'Rich marbling and big steakhouse energy for nights that deserve a centerpiece.'},
  {name:'Filet',text:'Tender, lean, and polished for special dinners or clean high-protein meals.'},
  {name:'New York Strip',text:'Bold beef flavor with the structure steak lovers come back for.'},
  {name:'Sirloin',text:'Everyday versatility for family meals, prep days, and value-driven boxes.'}
];

const bundle=['Cut mix by budget','Surf-and-turf options when available','Steak night allocation for the month','Delivery follow-up after ZIP check'];

export default function SteakDeliveryPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">Steak Delivery</p><h1>Steak-night energy, stocked at home.</h1><p className="lead">Ribeye, filet, New York strip, sirloin, and bundle options planned around your ZIP and monthly budget.</p><div className="actions"><a href="/#quick-route">Check Delivery</a><a href="/catalog">View Catalog</a></div></div><img src="/images/category-beef.svg" alt="Steak delivery"/></section>
  <section className="section"><p className="eyebrow">Cuts</p><h2>The classics, ready when you are.</h2><div className="catalog-grid">{cuts.map(cut=><article key={cut.name}><img src="/images/category-beef.svg" alt={`${cut.name} steak`}/><h3>{cut.name}</h3><p>{cut.text}</p><a href="/#quick-route">Check Availability</a></article>)}</div></section>
  <section className="section route-section"><div><p className="eyebrow">Bundles</p><h2>Build around taste, budget, and timing.</h2><p className="lead">Tell us the cuts you want most, then let the concierge connect that request to your area and follow-up details.</p></div><div className="route-list">{bundle.map(item=><article key={item}><h3>{item}</h3><p>Simple inputs, better steak planning.</p></article>)}</div></section>
  <section className="cta poster-frame final-cta"><p className="eyebrow">Reserve</p><h2>Check your ZIP and request the cuts you want.</h2><p>Share preferred steaks, budget, and timing so sales can follow up with a useful plan.</p><div className="actions"><a href="/#quick-route">Check ZIP</a><a href="/contact">Contact Sales</a></div></section>
</main>}