const boxes=['Family Freezer Box','Premium Steakhouse Box','Surf And Turf Box','Ranch Reserve Box'];
const meats=['Prime Beef','Chicken','Seafood','Pork','Bundles'];
const trust=['Ranch Direct','Hand Trimmed','Portion Controlled','Delivered With A Heartbeat'];
const partners=['Restaurants','Churches','Lodges','Food Trucks','Caterers','Community Events'];
const engine=[
 {title:'Customer Delivery Map',href:'/delivery-map',text:'Check route status, fill percentage, service area, and delivery estimates.'},
 {title:'Driver Manifest',href:'/driver',text:'View daily route stops, load weight, delivery order, and checklist.'},
 {title:'Dispatch Engine',href:'/ops',text:'Manage inventory reservations, truck fill, route priority, and dispatch readiness.'},
 {title:'Owner Reports',href:'/reports',text:'Track revenue, route performance, inventory health, and conversion metrics.'}
];

export default function Home(){return <main className="site">
<section className="hero poster-frame hero-grid"><div className="hero-copy"><p className="badge">Premium Meat Delivery • Freezer Boxes • Wholesale</p><p className="eyebrow">Capital City Provisions</p><h1>Premium ranch direct meat delivery.</h1><p className="lead">Hand Trimmed • Cut With Care • Portion Controlled</p><p className="lead heartbeat">Delivered With A Heartbeat</p><div className="actions"><a href="/freezer-boxes">Reserve Freezer Box</a><a href="/delivery-map">Check Delivery Area</a></div></div><div className="hero-art"><img src="/images/capital-city-hero.png" alt="Capital City Provisions premium steak delivery poster"/></div></section>
<section className="trust-strip">{trust.map((item)=><article key={item}><h3>{item}</h3><p>Premium quality, practical portions, and dependable delivery planning.</p></article>)}</section>
<section className="section"><p className="eyebrow">Choose Your Box</p><h2>Freezer boxes built for families, serious cooks, and long-term household readiness.</h2><div className="grid">{boxes.map((box)=><article key={box} className="marble"><h3>{box}</h3><p>Curated provisions with premium sourcing, polished presentation, and repeat-order potential.</p><a href="/freezer-boxes">View Details</a></article>)}</div></section>
<section className="section"><p className="eyebrow">Delivery Intelligence</p><h2>Customer, driver, dispatch, and owner tools connected to one operating engine.</h2><div className="grid">{engine.map((item)=><article key={item.title} className="marble"><h3>{item.title}</h3><p>{item.text}</p><a href={item.href}>Open</a></article>)}</div></section>
<section className="section"><p className="eyebrow">Premium Ranch Direct Meats</p><h2>Everything customers expect from a premium provisioning company.</h2><div className="product-row">{meats.map((item)=><article key={item}><h3>{item}</h3><p>Shop {item.toLowerCase()} selections, bundles, and freezer-ready portions.</p></article>)}</div></section>
<section className="section split"><div><p className="eyebrow">Why It Works</p><h2>Not grocery delivery. Not meal kits. Provisioning.</h2></div><p>The same brand can serve families, serious home cooks, restaurants, churches, lodges, food trucks, events, and wholesale buyers without losing its premium ranch-direct identity.</p></section>
<section className="section"><p className="eyebrow">Wholesale & Community Accounts</p><h2>Built for recurring relationships, not one-time orders.</h2><div className="grid">{partners.map((p)=><article key={p}><h3>{p}</h3><p>Request pricing, availability, recurring delivery planning, and account support.</p></article>)}</div></section>
<section className="cta poster-frame"><p className="eyebrow">Founder Pitch</p><h2>A premium food brand with subscription, delivery, and wholesale upside.</h2><p>Start with freezer boxes and direct orders, then expand into routes, subscriptions, and wholesale accounts.</p><div className="actions"><a href="/delivery-map">Check Delivery Map</a><a href="/ops">Open Dispatch Engine</a></div></section>
</main>}