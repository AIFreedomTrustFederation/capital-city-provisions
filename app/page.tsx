import QuickRouteCapture from '../components/QuickRouteCapture';

const trust=[
  {title:'Curated American Cuts',text:'Beef, poultry, pork, seafood, and staples selected for consistency, flavor, and everyday usefulness.'},
  {title:'Portioned With Purpose',text:'Clean, practical cuts built around real dinners, flexible meal prep, and a calmer weekly routine.'},
  {title:'Smart Local Delivery',text:'ZIP-aware routing keeps timing clear and helps protect quality from pack-out to doorstep.'},
  {title:'Stocked-Home Confidence',text:'Plans for families, events, and partners who want the next meal handled before life gets loud.'}
];

const boxes=[
  {name:'Starter Box',fit:'Small household',size:'7 cu ft',text:'A tight, high-utility restock for first orders, couples, and simple weeknight cooking.',image:'/images/freezer-starter.png'},
  {name:'Family Box',fit:'Family rhythm',size:'15 cu ft',text:'Balanced cuts for dinners, lunches, backup meals, and fewer last-minute store runs.',image:'/images/freezer-family.png'},
  {name:'Rancher Box',fit:'Deep stock',size:'20 cu ft',text:'More volume, more variety, and a stronger home reserve for serious planners.',image:'/images/freezer-rancher.png'},
  {name:'Owner Box',fit:'Bulk partner',size:'30 cu ft',text:'Large-format provisioning for big households, events, and commercial buyers.',image:'/images/freezer-owner.png'}
];

const proteins=[
  {name:'Beef',image:'/images/category-beef.svg'},
  {name:'Chicken',image:'/images/category-chicken.svg'},
  {name:'Pork',image:'/images/category-pork.svg'}
];

const routes=[
  {area:'Roseville',status:'Confirmed',day:'Wednesday'},
  {area:'Rocklin / Lincoln',status:'Nearly full',day:'Thursday'},
  {area:'Fair Oaks / Carmichael',status:'Adding nearby orders',day:'Tuesday'},
  {area:'Folsom / Orangevale',status:'Opening soon',day:'Friday'}
];

const steps=['Pick your plan','Check your ZIP','Reserve your spot','Fill the week'];

export default function Home(){return <main className="site landing-page">
  <section className="landing-hero poster-frame premium-orbit">
    <div className="hero-copy">
      <p className="badge">Sacramento-area protein delivery</p>
      <p className="eyebrow">Capital City Provisions</p>
      <h1><span className="gold-text">Stock Better.</span><br/>Eat Ready.</h1>
      <p className="lead">Curated beef, chicken, pork, seafood, and home-stock plans delivered through clear local routes with real follow-up.</p>
      <p className="heartbeat-line">Hand Trimmed • Smart Portions • Delivery Ready</p>
      <div className="actions hero-actions"><a href="/freezer-boxes">Build My Box</a><a href="#quick-route">Check ZIP</a></div>
      <QuickRouteCapture />
      <div className="hero-stats" aria-label="Service highlights">
        <span><strong>4</strong> box sizes</span>
        <span><strong>Local</strong> delivery</span>
        <span><strong>Bulk</strong> accounts</span>
      </div>
    </div>
    <div className="hero-art landing-art">
      <img src="/images/capital-city-hero.png" alt="Capital City Provisions stocked-home delivery"/>
      <p>Modern quality. Traditional values.</p>
    </div>
  </section>

  <section className="trust-strip landing-trust">{trust.map((item)=><article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</section>

  <section className="section landing-section" id="boxes">
    <div className="section-heading">
      <p className="eyebrow">Home Stock Plans</p>
      <h2>A better way to keep dinner ready.</h2>
      <p className="lead">Choose the level that fits your household, budget, and cooking style. The goal is simple: more good meals on hand, less guessing.</p>
    </div>
    <div className="box-grid">{boxes.map((box)=><article key={box.name} className="marble box-card">
      <img src={box.image} alt={`${box.name} home stock option`}/>
      <div className="box-card-copy"><p className="eyebrow">{box.fit}</p><h3>{box.name}</h3><p className="box-size">{box.size}</p><p>{box.text}</p><a href="/freezer-boxes">View Details</a></div>
    </article>)}</div>
  </section>

  <section className="section how-section">
    <div className="section-heading compact"><p className="eyebrow">How It Works</p><h2>Fast to start. Built to be dependable.</h2></div>
    <div className="step-row">{steps.map((step,index)=><article key={step}><span>{index+1}</span><h3>{step}</h3></article>)}</div>
  </section>

  <section className="section route-section" id="delivery">
    <div className="route-copy"><p className="eyebrow">Delivery Areas</p><h2>Know the route before you order.</h2><p className="lead">Check your ZIP first so the delivery expectation is clear before you choose a plan.</p><div className="actions"><a href="/delivery-map">See Delivery Areas</a><a href="/contact">Ask About My Area</a></div></div>
    <div className="route-list">{routes.map((route)=><article key={route.area}><h3>{route.area}</h3><p>{route.status}</p><strong>{route.day}</strong></article>)}</div>
  </section>

  <section className="section protein-section">
    <div className="section-heading compact"><p className="eyebrow">Core Proteins</p><h2>Real cuts for real kitchens.</h2></div>
    <div className="protein-row">{proteins.map((protein)=><article key={protein.name}><img src={protein.image} alt={`${protein.name} category`}/><h3>{protein.name}</h3><a href="/catalog">View Catalog</a></article>)}</div>
  </section>

  <section className="section wholesale-panel">
    <div><p className="eyebrow">Wholesale</p><h2>Supply for kitchens that move volume.</h2><p className="lead">Recurring meat, seafood, poultry, and pork support for restaurants, events, churches, food trucks, lodges, and caterers.</p></div>
    <a href="/wholesale">Apply For Wholesale</a>
  </section>

  <section className="cta poster-frame final-cta"><p className="eyebrow">Start Here</p><h2>Check your ZIP, then build the right box.</h2><p>The concierge saves your ZIP and helps match the plan to your household.</p><div className="actions"><a href="/freezer-boxes">Build My Box</a><a href="#quick-route">Check ZIP</a></div></section>
</main>}