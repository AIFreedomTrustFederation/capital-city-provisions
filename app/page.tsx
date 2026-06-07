import QuickRouteCapture from '../components/QuickRouteCapture';

const trust=[
  {title:'Restaurant-Quality Proteins',text:'Premium beef, chicken, pork, seafood, and staples selected for consistency, flavor, and everyday usefulness.'},
  {title:'Family-Sized Savings',text:'Freezer packages built around real dinners, flexible meal prep, and fewer last-minute grocery runs.'},
  {title:'Smart Local Delivery',text:'ZIP-aware routing keeps timing clear and helps protect quality from pack-out to doorstep.'},
  {title:'Stocked-Home Confidence',text:'Plans for families, events, and partners who want the next meal handled before life gets loud.'}
];

const boxes=[
  {name:'Baby Freezer Package',fit:'Couples and apartments',size:'5 cu ft',text:'A compact first stock-up for smaller households that still want quality food ready.',image:'/images/freezer-starter.png'},
  {name:'Mama Freezer Package',fit:'Small family rhythm',size:'7 cu ft',text:'More variety for busy weeks, quick dinners, and fewer last-minute grocery runs.',image:'/images/freezer-family.png'},
  {name:'Papa Freezer Package',fit:'Family stock-up',size:'10 cu ft',text:'A strong freezer fill with beef, chicken, pork, and seafood built around real meals.',image:'/images/freezer-rancher.png'},
  {name:'Big Papa Package',fit:'Serious food security',size:'22 cu ft',text:'The whole-cow alternative for households that want serious reserve and serious quality.',image:'/images/freezer-owner.png'}
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

const steps=['Pick your plan','Check your ZIP','Reserve your spot','Fill the freezer'];
const costcoTest=['Drive to the store','Wait in line','Break down bulk packs','Wrap and label portions','Pack the freezer yourself'];
const restockClub=['Monthly refill reminders','Holiday specials','Member discounts','Referral rewards','Seasonal meat and seafood offers'];

export default function Home(){return <main className="site landing-page">
  <section className="landing-hero poster-frame premium-orbit">
    <div className="hero-copy">
      <p className="badge">Sacramento-area protein delivery</p>
      <p className="eyebrow">Capital City Provisions</p>
      <h1><span className="gold-text">Fill Your Freezer.</span><br/>Feed Your Family.</h1>
      <p className="lead">Premium beef, chicken, pork, seafood, and freezer packages delivered directly to your door. Restaurant-quality proteins, family-sized savings, delivered with a heartbeat.</p>
      <p className="heartbeat-line">Hand Trimmed - Smart Portions - Delivery Ready</p>
      <div className="actions hero-actions"><a href="/giveaway">Enter Freezer Giveaway</a><a href="/freezer-boxes">View Freezer Packages</a></div>
      <QuickRouteCapture />
      <div className="hero-stats" aria-label="Service highlights">
        <span><strong>5</strong> freezer sizes</span>
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
      <p className="eyebrow">Freezer Packages</p>
      <h2>A better way to keep dinner ready.</h2>
      <p className="lead">Choose the level that fits your household, freezer space, budget, and cooking style. The goal is simple: more good meals on hand, less guessing.</p>
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

  <section className="section route-section">
    <div><p className="eyebrow">The Costco Test</p><h2>Skip the bulk-buy homework.</h2><p className="lead">You can spend the day shopping, trimming, wrapping, labeling, and organizing, or you can open the door and let Capital City Provisions bring a smarter stock-up to you.</p><div className="actions"><a href="/how-delivery-works">How Delivery Works</a><a href="/#quick-route">Check ZIP</a></div></div>
    <div className="route-list">{costcoTest.map(item=><article key={item}><h3>{item}</h3><p>We help remove this step from your week.</p></article>)}</div>
  </section>

  <section className="section route-section" id="delivery">
    <div className="route-copy"><p className="eyebrow">Delivery Areas</p><h2>Know the route before you order.</h2><p className="lead">Check your ZIP first so the delivery expectation is clear before you choose a plan.</p><div className="actions"><a href="/delivery-map">See Delivery Areas</a><a href="/contact">Ask About My Area</a></div></div>
    <div className="route-list">{routes.map((route)=><article key={route.area}><h3>{route.area}</h3><p>{route.status}</p><strong>{route.day}</strong></article>)}</div>
  </section>

  <section className="section protein-section">
    <div className="section-heading compact"><p className="eyebrow">Core Proteins</p><h2>Real cuts for real kitchens.</h2></div>
    <div className="protein-row">{proteins.map((protein)=><article key={protein.name}><img src={protein.image} alt={`${protein.name} category`}/><h3>{protein.name}</h3><a href="/catalog">View Catalog</a></article>)}</div>
  </section>

  <section className="section route-section">
    <div><p className="eyebrow">Restock Club</p><h2>Keep the freezer full after the first delivery.</h2><p className="lead">Once your freezer is stocked, we help keep it that way with reminders, seasonal offers, holiday packs, and practical refill planning.</p><div className="actions"><a href="/contact">Join Restock Club</a><a href="/food-security-freezer-boxes">Plan Food Security</a></div></div>
    <div className="route-list">{restockClub.map(item=><article key={item}><h3>{item}</h3><p>Designed for households that want good food ready without starting from zero every month.</p></article>)}</div>
  </section>

  <section className="section wholesale-panel">
    <div><p className="eyebrow">Wholesale</p><h2>Supply for kitchens that move volume.</h2><p className="lead">Recurring meat, seafood, poultry, and pork support for restaurants, events, churches, food trucks, lodges, and caterers.</p></div>
    <a href="/wholesale">Apply For Wholesale</a>
  </section>

  <section className="cta poster-frame final-cta"><p className="eyebrow">Ready To Fill Your Freezer?</p><h2>Premium proteins. Home delivery. Family-sized savings.</h2><p>Capital City Provisions brings the food, fills the freezer, and helps keep your household fed.</p><div className="actions"><a href="/giveaway">Enter Giveaway Free</a><a href="/freezer-boxes">View Packages</a><a href="#quick-route">Check ZIP</a></div></section>
</main>}
