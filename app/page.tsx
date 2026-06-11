import DeliveryZoneCheck from '../components/DeliveryZoneCheck';
import QuickRouteCapture from '../components/QuickRouteCapture';

const heroStats = [
  'USDA Prime & Choice Cuts',
  'Triple-Trimmed For Max Value',
  'Cryovac Packed For Freshness',
  'Free Delivery To Your Door',
  'First Order Gift & Freezer Giveaway'
];

const routeConfidence = [
  'ZIP checked before order',
  'No cold-call checkout pressure',
  'Giveaway entry stays free'
];

const droolGallery = [
  {
    title: 'Marbled Steakhouse Cuts',
    text: 'Ribeyes, strips, roasts, and freezer-ready beef selected to look as good as it eats.',
    image: '/images/ccp-marbled-cuts.svg'
  },
  {
    title: 'Hand-Trimmed Quality',
    text: 'A premium butcher-shop feel that makes every bundle look clean, generous, and high value.',
    image: '/images/ccp-butcher-trim.svg'
  },
  {
    title: 'Cryovac Packed Freshness',
    text: 'Freezer-ready portions that make the customer feel stocked before they ever check out.',
    image: '/images/ccp-cryovac-pack.svg'
  },
  {
    title: 'Backyard Steak Night',
    text: 'The lifestyle shot: family, fire, flavor, and the promise of better dinners at home.',
    image: '/images/ccp-backyard-steak-night.svg'
  },
  {
    title: 'Premium Delivery Experience',
    text: 'Capital City Provisions brings the freezer-fill experience straight to the customer.',
    image: '/images/ccp-premium-delivery.svg'
  }
];

const packages = [
  { name: 'Baby Freezer Package', fit: 'Couples & apartments', size: '5 cu ft', text: 'A compact first stock-up for smaller households that want premium meals ready.' },
  { name: 'Mama Freezer Package', fit: 'Small family rhythm', size: '7 cu ft', text: 'More variety for busy weeks, quick dinners, and fewer last-minute grocery runs.' },
  { name: 'Papa Freezer Package', fit: 'Family stock-up', size: '10 cu ft', text: 'A serious freezer fill with beef, chicken, pork, and seafood built around real meals.' },
  { name: 'Big Papa Package', fit: 'Food security level', size: '22 cu ft', text: 'The whole-cow alternative for households that want reserve, value, and quality.' }
];

const benefits = [
  { title: 'Premium Quality', text: 'Only USDA Prime and Choice style cuts, curated for family value and steakhouse flavor.' },
  { title: 'Frozen Fresh', text: 'Cryovac sealed and freezer-ready so every bundle feels organized from day one.' },
  { title: 'Bundle & Save', text: 'Curated boxes designed to give customers more meat, better planning, and less waste.' },
  { title: 'Feed What Matters', text: 'Real food, real quality, and enough freezer confidence to take pressure off dinner.' }
];

const routes = [
  { area: 'Rancho Cordova Hub', status: 'Active local delivery', day: 'Priority routing' },
  { area: 'Folsom / Fair Oaks / Carmichael', status: 'Core route', day: 'Grouped windows' },
  { area: 'Roseville / Granite Bay / Rocklin', status: 'North route', day: 'Grouped windows' },
  { area: 'Elk Grove / West Sac / Davis', status: 'South-West route', day: 'Opening windows' }
];

export default function Home() {
  return <main className="site ccp-steakhouse">
    <section className="steakhouse-promo">
      <strong>Launch Offer:</strong> First-time customers can claim a limited order gift. Freezer giveaway entry stays free.
    </section>

    <section className="steakhouse-hero">
      <div className="hero-overlay" />
      <div className="hero-content">
        <p className="brand-kicker">Capital City Provisions</p>
        <h1>Premium Beef. Delivered.</h1>
        <p className="hero-subhead">Triple-trimmed. Cryovac packed. Free delivery.</p>
        <p className="hero-copy">USDA Prime and Choice-style steaks, roasts, burgers, seafood, chicken, pork, and freezer bundles delivered straight to your door across the Sacramento area.</p>
        <div className="hero-actions">
          <a href="#delivery-zone-check">Check My ZIP</a>
          <a href="/freezer-boxes">Compare Packages</a>
        </div>
        <div className="route-confidence" aria-label="Route check confidence">
          {routeConfidence.map((item) => <span key={item}>{item}</span>)}
        </div>
        <QuickRouteCapture />
      </div>
      <div className="prime-badge" aria-label="USDA Prime badge"><span>USDA</span><strong>Prime</strong></div>
    </section>

    <section className="hero-benefit-bar" aria-label="Capital City Provisions benefits">
      {heroStats.map((item) => <article key={item}><span>*</span><strong>{item}</strong></article>)}
    </section>

    <DeliveryZoneCheck />

    <section className="drool-gallery" aria-label="Premium food photography gallery">
      {droolGallery.map((item) => <article key={item.title}>
        <img src={item.image} alt={item.title} />
        <div><h2>{item.title}</h2><p>{item.text}</p></div>
      </article>)}
    </section>

    <section className="quality-strip">
      {benefits.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}
    </section>

    <section className="freezer-section" id="boxes">
      <div className="section-heading steakhouse-heading">
        <p className="brand-kicker">Freezer Packages</p>
        <h2>Fill the freezer. Feed the family. Skip the warehouse trip.</h2>
        <p>Every package is built around one promise: less stress, better meals, and premium proteins ready when your household needs them.</p>
      </div>
      <div className="package-grid">
        {packages.map((box) => <article key={box.name}>
          <p>{box.fit}</p>
          <h3>{box.name}</h3>
          <strong>{box.size}</strong>
          <span>{box.text}</span>
          <a href="/freezer-boxes">View Details</a>
        </article>)}
      </div>
    </section>

    <section className="route-section steakhouse-route" id="delivery">
      <div>
        <p className="brand-kicker">Delivery Areas</p>
        <h2>Know the route before you order.</h2>
        <p className="lead">Check your ZIP first so the delivery expectation is clear before you choose a package.</p>
        <div className="hero-actions"><a href="#delivery-zone-check">Check ZIP</a><a href="/delivery-map">See Full Delivery Map</a><a href="/contact">Ask About My Area</a></div>
      </div>
      <div className="route-list">{routes.map((route) => <article key={route.area}><h3>{route.area}</h3><p>{route.status}</p><strong>{route.day}</strong></article>)}</div>
    </section>

    <section className="steakhouse-final-cta">
      <p className="brand-kicker">Ready To Fill Your Freezer?</p>
      <h2>Build your box in minutes.</h2>
      <p>Start with your ZIP, household size, and budget. We will help match the right freezer package.</p>
      <div className="hero-actions"><a href="#delivery-zone-check">Check My ZIP</a><a href="/giveaway">Enter Giveaway Free</a><a href="/freezer-boxes">View Packages</a></div>
    </section>
  </main>;
}