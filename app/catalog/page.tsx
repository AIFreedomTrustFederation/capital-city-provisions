export const metadata={
  title:'Meat Catalog | Capital City Provisions',
  description:'Explore ranch-direct beef, poultry, pork, seafood, bundles, and freezer-box solutions from Capital City Provisions.'
};

const categories=[
  {name:'Beef',image:'/images/category-beef.svg',text:'Steaks, roasts, ground beef, family staples, and premium cuts.'},
  {name:'Chicken',image:'/images/category-chicken.svg',text:'Practical poultry options for weekly meals and freezer restocks.'},
  {name:'Pork',image:'/images/category-pork.svg',text:'Ribs, chops, roasts, sausage-friendly planning, and family portions.'},
  {name:'Seafood',image:'/images/freezer-starter.png',text:'Surf-and-turf upgrades and special occasion freezer additions.'},
  {name:'Bundles',image:'/images/freezer-family.png',text:'Curated mixes for households that want variety without guesswork.'},
  {name:'Wholesale',image:'/images/freezer-owner.png',text:'Bulk sourcing for kitchens, events, churches, lodges, and caterers.'}
];

export default function CatalogPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">Catalog</p><h1>Premium proteins and freezer-box solutions.</h1><p className="lead">Browse the core categories customers use to build family freezer boxes, steakhouse nights, weekly meals, and wholesale accounts.</p><div className="actions"><a href="/freezer-boxes">Compare Freezer Boxes</a><a href="/wholesale">Wholesale Accounts</a></div></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions catalog"/></section>
  <section className="section"><p className="eyebrow">Categories</p><h2>Build a box around the proteins you actually use.</h2><div className="catalog-grid">{categories.map(item=><article key={item.name}><img src={item.image} alt={`${item.name} category`}/><h3>{item.name}</h3><p>{item.text}</p><a href={item.name==='Wholesale'?'/wholesale':'/contact'}>{item.name==='Wholesale'?'Apply For Wholesale':'Request Availability'}</a></article>)}</div></section>
  <section className="cta poster-frame final-cta"><p className="eyebrow">Availability</p><h2>Catalog planning starts with route and stock.</h2><p>Tell us your delivery area, freezer size, and preferred proteins so we can match the right product mix.</p><div className="actions"><a href="/delivery-map">Check Delivery Area</a><a href="/contact">Request Catalog Help</a></div></section>
</main>}
