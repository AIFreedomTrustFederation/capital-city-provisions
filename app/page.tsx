const trust=[
 {title:'Ranch Direct',text:'No middlemen. Just honest meat.'},
 {title:'Always Frozen',text:'Flash frozen for maximum freshness.'},
 {title:'Delivered With A Heartbeat',text:'From our ranch route to your door.'},
 {title:'Premium Quality',text:'The highest standard in every cut.'}
];
const boxes=[
 {name:'Starter Box',size:'7 cu ft',text:'Perfect for individuals or small families.'},
 {name:'Family Box',size:'15 cu ft',text:'Great for families who love quality meat.'},
 {name:'Rancher Box',size:'20 cu ft',text:'Ideal for serious meat lovers and homesteads.'},
 {name:'Owner Box',size:'30 cu ft',text:'Maximum storage for big families or partners.'}
];
const meats=['Beef','Pork','Chicken','Lamb','Bundles'];

export default function Home(){return <main className="site mock-home">
<section className="mock-hero"><div className="mock-poster"><img src="/images/capital-city-hero.png" alt="Capital City Provisions poster"/></div><div className="mock-copy"><p className="eyebrow">Capital City Provisions</p><h1>Premium Ranch Direct Meat Delivery</h1><p className="script">Delivered With A Heartbeat</p><div className="actions"><a href="/freezer-boxes">Reserve Freezer Box</a><a href="/wholesale">Wholesale Accounts</a></div></div></section>
<section className="trust-strip mock-trust">{trust.map((item)=><article key={item.title}><div className="mock-icon">◇</div><h3>{item.title}</h3><p>{item.text}</p></article>)}</section>
<section className="section mock-section"><p className="eyebrow">Our Freezer Boxes</p><h2>Freezer boxes built for families, partners, and long-term household readiness.</h2><div className="grid mock-box-grid">{boxes.map((box)=><article key={box.name} className="marble mock-product-card"><div className="freezer-visual"><div className="freezer-lid"></div><div className="freezer-body"><span>CCP</span></div></div><h3>{box.name}</h3><p className="box-size">({box.size})</p><p>{box.text}</p><a href="/freezer-boxes">View Details</a></article>)}</div><div className="actions center"><a href="/freezer-boxes">Compare All Boxes</a></div></section>
<section className="section mock-section"><p className="eyebrow">Premium Ranch Direct Meats</p><h2>Premium proteins for freezer stocking, family meals, and wholesale partners.</h2><div className="product-row meat-row">{meats.map((item)=><article key={item} className="meat-card"><div className="meat-visual"></div><h3>{item}</h3><p>Shop {item}</p></article>)}</div><div className="actions center"><a href="/catalog">View All Products</a></div></section>
<section className="section wholesale-panel"><div><p className="eyebrow">Partner With Capital City Provisions</p><h2>Wholesale accounts available for restaurants, retailers, bulk buyers, and community partners.</h2></div><ul><li>Premium ranch direct meats</li><li>Competitive wholesale pricing</li><li>Reliable delivery and consistent supply</li><li>Built on trust, quality, and partnership</li></ul><a href="/wholesale">Apply For Wholesale</a></section>
<section className="cta poster-frame mock-footer-cta"><p className="eyebrow">Capital City Provisions</p><h2>Freezer boxes. Premium meats. Wholesale routes.</h2><p>Public pages stay beautiful. Operations, driver, reports, inventory, and dispatch engines remain connected behind the scenes.</p><div className="actions"><a href="/delivery-map">Delivery Map</a><a href="/ops">Operations</a></div></section>
</main>}