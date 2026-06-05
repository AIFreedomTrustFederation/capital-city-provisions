import QuickRouteCapture from '../components/QuickRouteCapture';

const trust=[
  {title:'Ranch Direct',text:'Premium proteins sourced from trusted American producers.'},
  {title:'Freezer Ready',text:'Curated boxes built for real households and long-term stocking.'},
  {title:'Route Delivery',text:'Grouped local routes keep delivery practical, reliable, and fresh.'},
  {title:'Wholesale Capable',text:'Recurring provisioning for restaurants, caterers, churches, and events.'}
];

const boxes=[
  {name:'Starter Box',fit:'Small household',size:'7 cu ft',text:'A focused freezer restock for individuals, couples, or first-time customers.',image:'/images/freezer-starter.png'},
  {name:'Family Box',fit:'Family restock',size:'15 cu ft',text:'Balanced beef, poultry, pork, and flexible cuts for weekly meals.',image:'/images/freezer-family.png'},
  {name:'Rancher Box',fit:'Large freezer',size:'20 cu ft',text:'Bigger portions and deeper stocking for serious home provision planning.',image:'/images/freezer-rancher.png'},
  {name:'Owner Box',fit:'Bulk partner',size:'30 cu ft',text:'Maximum capacity for large families, events, and partner accounts.',image:'/images/freezer-owner.png'}
];

const proteins=[
  {name:'Beef',image:'/images/category-beef.svg'},
  {name:'Chicken',image:'/images/category-chicken.svg'},
  {name:'Pork',image:'/images/category-pork.svg'}
];

const routes=[
  {area:'Roseville',status:'Confirmed route',day:'Wednesday'},
  {area:'Rocklin / Lincoln',status:'Almost full',day:'Thursday'},
  {area:'Fair Oaks / Carmichael',status:'Collecting nearby orders',day:'Tuesday'},
  {area:'Folsom / Orangevale',status:'Building route',day:'Friday'}
];

const steps=['Choose a freezer box','Check your route','Reserve your delivery','Stock your freezer'];

export default function Home(){return <main className="site landing-page">
  <section className="landing-hero poster-frame">
    <div className="hero-copy">
      <p className="badge">Sacramento-area freezer box delivery</p>
      <p className="eyebrow">Capital City Provisions</p>
      <h1>Premium Meat Delivery & Freezer Boxes</h1>
      <p className="lead">Ranch-direct beef, poultry, pork, seafood, and family freezer boxes delivered with care across local delivery routes.</p>
      <div className="actions hero-actions"><a href="/freezer-boxes">Reserve Freezer Box</a><a href="#quick-route">Check My Route</a></div>
      <QuickRouteCapture />
      <div className="hero-stats" aria-label="Service highlights">
        <span><strong>4</strong> freezer box sizes</span>
        <span><strong>4</strong> local routes</span>
        <span><strong>Bulk</strong> wholesale support</span>
      </div>
    </div>
    <div className="hero-art landing-art">
      <img src="/images/capital-city-hero.png" alt="Capital City Provisions premium freezer box delivery"/>
      <p>Modern quality. Traditional values.</p>
    </div>
  </section>

  <section className="trust-strip landing-trust">{trust.map((item)=><article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</section>

  <section className="section landing-section" id="boxes">
    <div className="section-heading">
      <p className="eyebrow">Freezer Boxes</p>
      <h2>Pick the box that fits your household.</h2>
      <p className="lead">Every box is positioned around practical freezer confidence: the right amount of premium protein, ready when your family needs it.</p>
    </div>
    <div className="box-grid">{boxes.map((box)=><article key={box.name} className="marble box-card">
      <img src={box.image} alt={`${box.name} freezer provisioning option`}/>
      <div className="box-card-copy"><p className="eyebrow">{box.fit}</p><h3>{box.name}</h3><p className="box-size">{box.size}</p><p>{box.text}</p><a href="/freezer-boxes">View Details</a></div>
    </article>)}</div>
  </section>

  <section className="section how-section">
    <div className="section-heading compact"><p className="eyebrow">How It Works</p><h2>Simple enough for dinner. Strong enough for preparedness.</h2></div>
    <div className="step-row">{steps.map((step,index)=><article key={step}><span>{index+1}</span><h3>{step}</h3></article>)}</div>
  </section>

  <section className="section route-section" id="delivery">
    <div className="route-copy"><p className="eyebrow">Delivery Areas</p><h2>Route-based delivery keeps promises realistic.</h2><p className="lead">Customers can see whether a route is confirmed, almost full, or still collecting nearby orders before reserving a box.</p><div className="actions"><a href="/delivery-map">See Delivery Map</a><a href="/contact">Ask About My Area</a></div></div>
    <div className="route-list">{routes.map((route)=><article key={route.area}><h3>{route.area}</h3><p>{route.status}</p><strong>{route.day}</strong></article>)}</div>
  </section>

  <section className="section protein-section">
    <div className="section-heading compact"><p className="eyebrow">Premium Proteins</p><h2>Core cuts for families and partners.</h2></div>
    <div className="protein-row">{proteins.map((protein)=><article key={protein.name}><img src={protein.image} alt={`${protein.name} category`}/><h3>{protein.name}</h3><a href="/catalog">View Catalog</a></article>)}</div>
  </section>

  <section className="section wholesale-panel">
    <div><p className="eyebrow">Wholesale</p><h2>Provision serious kitchens, churches, caterers, lodges, food trucks, and events.</h2><p className="lead">Recurring accounts can request pricing, availability, delivery planning, and bulk freezer support.</p></div>
    <a href="/wholesale">Apply For Wholesale</a>
  </section>

  <section className="cta poster-frame final-cta"><p className="eyebrow">Find Your Box</p><h2>Start with a route check and a freezer plan.</h2><p>Use the Box Concierge or reserve a freezer box to get matched with the right delivery route.</p><div className="actions"><a href="/freezer-boxes">Reserve Freezer Box</a><a href="#quick-route">Check My Route</a></div></section>
</main>}
