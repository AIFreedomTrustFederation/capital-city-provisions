import QuickRouteCapture from '../components/QuickRouteCapture';

const trust=[
  {title:'Steakhouse Quality At Home',text:'Premium beef, chicken, pork, seafood, and staples selected for flavor, consistency, and real family meals.'},
  {title:'Freezer-Fill Convenience',text:'Skip the bulk-store homework. We help plan the stock-up, route the delivery, and make dinner easier.'},
  {title:'ZIP-Aware Delivery',text:'Start with your ZIP so the route, delivery expectation, and next step are clear before you choose a package.'},
  {title:'Food Security Made Simple',text:'A stocked freezer means fewer emergency grocery trips and more confidence when life gets loud.'}
];

const boxes=[
  {name:'Baby Freezer Package',fit:'Couples and apartments',size:'5 cu ft',text:'A compact first stock-up for smaller households that still want quality food ready.',image:'/images/freezer-starter.png'},
  {name:'Mama Freezer Package',fit:'Small family rhythm',size:'7 cu ft',text:'More variety for busy weeks, quick dinners, and fewer last-minute grocery runs.',image:'/images/freezer-family.png'},
  {name:'Papa Freezer Package',fit:'Family stock-up',size:'10 cu ft',text:'A strong freezer fill with beef, chicken, pork, and seafood built around real meals.',image:'/images/freezer-rancher.png'},
  {name:'Big Papa Package',fit:'Serious food security',size:'22 cu ft',text:'The whole-cow alternative for households that want serious reserve and serious quality.',image:'/images/freezer-owner.png'}
];

const proteins=[
  {name:'Premium Beef',image:'/images/category-beef.svg'},
  {name:'Family Chicken',image:'/images/category-chicken.svg'},
  {name:'Pork & Ribs',image:'/images/category-pork.svg'}
];

const routes=[
  {area:'Roseville',status:'Confirmed',day:'Wednesday'},
  {area:'Rocklin / Lincoln',status:'Nearly full',day:'Thursday'},
  {area:'Fair Oaks / Carmichael',status:'Adding nearby orders',day:'Tuesday'},
  {area:'Folsom / Orangevale',status:'Opening soon',day:'Friday'}
];

const steps=['Enter your ZIP','Tell us your household','Choose your freezer level','Get delivery confirmation'];
const costcoTest=['No warehouse trip','No line waiting','No breaking down bulk packs','No wrapping and labeling portions','No freezer guessing'];
const restockClub=['Monthly refill reminders','Holiday specials','Member discounts','Referral rewards','Seasonal meat and seafood offers'];
const promos=['First 100 customers get a free steak slider','Chance to win a free freezer','Free delivery route check','Custom package recommendation'];

export default function Home(){return <main className="site landing-page ccp-home-refresh">
  <section className="promo-ribbon"><strong>Launch Offer:</strong> First 100 customers get a free steak slider + a chance to win a freezer. No purchase necessary for giveaway entry.</section>

  <section className="landing-hero poster-frame premium-orbit">
    <div className="hero-copy">
      <p className="badge">Sacramento-area protein delivery</p>
      <p className="eyebrow">Capital City Provisions</p>
      <h1>Never Wonder What Is For Dinner Again.</h1>
      <p className="lead">Premium beef, chicken, pork, seafood, and family freezer packages delivered to your door. Stock the freezer once and feed your household for weeks.</p>
      <p className="heartbeat-line">Steakhouse Quality - Family Portions - Delivery Ready</p>
      <div className="actions hero-actions"><a href="#quick-route">Build My Box</a><a href="/giveaway">Enter Freezer Giveaway</a></div>
      <QuickRouteCapture />
      <div className="promo-grid" aria-label="Launch promotions">{promos.map(item=><span key={item}>{item}</span>)}</div>
    </div>
    <div className="hero-art landing-art">
      <img src="/images/capital-city-hero.png" alt="Capital City Provisions freezer box delivery"/>
      <p>Modern quality. Traditional values.</p>
    </div>
  </section>

  <section className="trust-strip landing-trust">{trust.map((item)=><article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</section>

  <section className="section landing-section" id="boxes">
    <div className="section-heading">
      <p className="eyebrow">Freezer Packages</p>
      <h2>Pick the package that makes your household feel stocked.</h2>
      <p className="lead">Every package is built around a simple promise: less stress, better meals, and premium proteins ready when your family needs them.</p>
    </div>
    <div className="box-grid">{boxes.map((box)=><article key={box.name} className="marble box-card">
      <img src={box.image} alt={`${box.name} freezer package`}/>
      <div className="box-card-copy"><p className="eyebrow">{box.fit}</p><h3>{box.name}</h3><p className="box-size">{box.size}</p><p>{box.text}</p><a href="/freezer-boxes">View Details</a></div>
    </article>)}</div>
  </section>

  <section className="section protein-section">
    <div className="section-heading compact"><p className="eyebrow">What You Get</p><h2>Food people actually crave.</h2><p className="lead">The homepage should make customers hungry first. Then the concierge makes ordering simple.</p></div>
    <div className="protein-row">{proteins.map((protein)=><article key={protein.name}><img src={protein.image} alt={`${protein.name} category`}/><h3>{protein.name}</h3><a href="/catalog">View Catalog</a></article>)}</div>
  </section>

  <section className="section how-section">
    <div className="section-heading compact"><p className="eyebrow">AI Box Concierge</p><h2>Three answers and we can point you to the right box.</h2></div>
    <div className="step-row">{steps.map((step,index)=><article key={step}><span>{index+1}</span><h3>{step}</h3></article>)}</div>
  </section>

  <section className="section route-section">
    <div><p className="eyebrow">The Costco Test</p><h2>Skip the bulk-buy homework.</h2><p className="lead">You can spend the day shopping, trimming, wrapping, labeling, and organizing, or you can let Capital City Provisions bring a smarter stock-up to you.</p><div className="actions"><a href="#quick-route">Build My Box</a><a href="/how-delivery-works">How Delivery Works</a></div></div>
    <div className="route-list">{costcoTest.map(item=><article key={item}><h3>{item}</h3><p>We help remove this step from your week.</p></article>)}</div>
  </section>

  <section className="section route-section" id="delivery">
    <div className="route-copy"><p className="eyebrow">Delivery Areas</p><h2>Know the route before you order.</h2><p className="lead">Check your ZIP first so the delivery expectation is clear before you choose a package.</p><div className="actions"><a href="#quick-route">Check ZIP</a><a href="/contact">Ask About My Area</a></div></div>
    <div className="route-list">{routes.map((route)=><article key={route.area}><h3>{route.area}</h3><p>{route.status}</p><strong>{route.day}</strong></article>)}</div>
  </section>

  <section className="section route-section">
    <div><p className="eyebrow">Restock Club</p><h2>Keep the freezer full after the first delivery.</h2><p className="lead">Once your freezer is stocked, we help keep it that way with reminders, seasonal offers, holiday packs, and practical refill planning.</p><div className="actions"><a href="/contact">Join Restock Club</a><a href="/food-security-freezer-boxes">Plan Food Security</a></div></div>
    <div className="route-list">{restockClub.map(item=><article key={item}><h3>{item}</h3><p>Designed for households that want good food ready without starting from zero every month.</p></article>)}</div>
  </section>

  <section className="section wholesale-panel">
    <div><p className="eyebrow">Wholesale</p><h2>Supply for kitchens that move volume.</h2><p className="lead">Recurring meat, seafood, poultry, and pork support for restaurants, events, churches, food trucks, lodges, and caterers.</p></div>
    <a href="/wholesale">Apply For Wholesale</a>
  </section>

  <section className="cta poster-frame final-cta"><p className="eyebrow">Ready To Fill Your Freezer?</p><h2>Build your box in minutes.</h2><p>Start with your ZIP, household size, and budget. We will help match the right freezer package.</p><div className="actions"><a href="#quick-route">Build My Box</a><a href="/giveaway">Enter Giveaway Free</a><a href="/freezer-boxes">View Packages</a></div></section>
</main>}
