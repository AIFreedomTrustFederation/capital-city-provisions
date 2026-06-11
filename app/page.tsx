import DeliveryZoneCheck from '../components/DeliveryZoneCheck';
import QuickRouteCapture from '../components/QuickRouteCapture';

const packages=[
  {name:'Baby Freezer Package',fit:'Couples & small freezers',size:'5 cu ft',text:'A simple first stock-up for smaller households.'},
  {name:'Mama Freezer Package',fit:'Small families',size:'7 cu ft',text:'More variety for busy weekly meals.'},
  {name:'Papa Freezer Package',fit:'Family stock-up',size:'10 cu ft',text:'A deeper freezer fill for regular home cooking.'},
  {name:'Big Papa Package',fit:'Food security reserve',size:'22 cu ft',text:'A serious stocked-home reserve for larger households.'}
];

const steps=[
  {title:'Check your ZIP',text:'Make sure your area fits an active or grouped delivery route.'},
  {title:'Pick a package',text:'Choose by household size, freezer space, and how often you cook at home.'},
  {title:'Get follow-up',text:'The team confirms timing, package fit, and delivery details before anything is final.'}
];

export default function Home(){return <main className="site ccp-steakhouse">
  <section className="steakhouse-promo"><strong>Launch Offer:</strong> First-time stocked-home customers may qualify for a limited order gift. Giveaway entry stays free.</section>

  <section className="steakhouse-hero">
    <div className="hero-overlay" />
    <div className="hero-content">
      <p className="brand-kicker">Capital City Provisions</p>
      <h1>Fill your freezer without the warehouse run.</h1>
      <p className="hero-subhead">Premium proteins. Cryovac packed. Free local delivery.</p>
      <p className="hero-copy">Start with your ZIP, household size, and favorite cuts. We help match the right freezer package before you commit.</p>
      <div className="hero-actions"><a href="#delivery-zone-check">Check ZIP</a><a href="/customer-concierge">Ask Concierge</a><a href="/freezer-boxes">See Boxes</a></div>
      <div className="route-confidence" aria-label="Customer confidence"><span>ZIP checked first</span><span>No pressure checkout</span><span>Giveaway stays free</span></div>
      <QuickRouteCapture />
    </div>
    <div className="prime-badge" aria-label="Premium badge"><span>USDA</span><strong>Choice</strong></div>
  </section>

  <section className="hero-benefit-bar" aria-label="Benefits"><article><span>*</span><strong>Triple-trimmed value</strong></article><article><span>*</span><strong>Cryovac freezer-ready</strong></article><article><span>*</span><strong>Grouped local delivery</strong></article></section>

  <DeliveryZoneCheck />

  <section className="quality-strip">
    {steps.map(step=><article key={step.title}><h3>{step.title}</h3><p>{step.text}</p></article>)}
  </section>

  <section className="freezer-section" id="boxes">
    <div className="section-heading steakhouse-heading"><p className="brand-kicker">Freezer Packages</p><h2>Choose the package that fits your home.</h2><p>Not sure? Use the concierge or start with a ZIP check. Keep it simple.</p></div>
    <div className="package-grid">{packages.map(box=><article key={box.name}><p>{box.fit}</p><h3>{box.name}</h3><strong>{box.size}</strong><span>{box.text}</span><a href="/freezer-boxes">Compare</a></article>)}</div>
  </section>

  <section className="route-section steakhouse-route" id="delivery"><div><p className="brand-kicker">Need help choosing?</p><h2>Ask the concierge before you decide.</h2><p className="lead">The customer concierge can help with box size, delivery basics, steak value, family meals, wholesale, and giveaway rules.</p><div className="hero-actions"><a href="/customer-concierge">Ask Concierge</a><a href="#delivery-zone-check">Check ZIP</a><a href="/contact">Contact Us</a></div></div><div className="route-list"><article><h3>Local route first</h3><p>Delivery timing depends on ZIP and grouped windows.</p><strong>Start with ZIP</strong></article><article><h3>Free giveaway entry</h3><p>No purchase necessary. Buying does not improve odds.</p><strong><a href="/giveaway">Enter free</a></strong></article></div></section>

  <section className="steakhouse-final-cta"><p className="brand-kicker">Ready?</p><h2>Start with your ZIP.</h2><p>That is the cleanest first step. From there, choose a package or ask the concierge.</p><div className="hero-actions"><a href="#delivery-zone-check">Check My ZIP</a><a href="/customer-concierge">Ask Concierge</a><a href="/freezer-boxes">View Boxes</a></div></section>
</main>}
