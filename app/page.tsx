import DeliveryZoneCheck from '../components/DeliveryZoneCheck';
import QuickRouteCapture from '../components/QuickRouteCapture';
import CustomerAccountJourney from '../components/CustomerAccountJourney';
import PublicMobileStickyCTA from '../components/PublicMobileStickyCTA';
import MVPFlowStrip from '../components/MVPFlowStrip';

const pageLinks=[
  {label:'View Menu',href:'/menu',text:'See the current steak-box menu and QR-ready menu graphics.'},
  {label:'See Boxes',href:'/freezer-boxes',text:'Compare Baby Freezer through Big Papa package options.'},
  {label:'How It Works',href:'/how-delivery-works',text:'Understand ZIP checks, route grouping, confirmation, and delivery.'},
  {label:'Delivery',href:'/delivery-map',text:'Review delivery areas and local route direction.'},
  {label:'Giveaway',href:'/giveaway',text:'Enter free. No purchase necessary. Buying does not improve odds.'},
  {label:'Contact',href:'/contact',text:'Ask sales, support, wholesale, or general questions.'}
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
      <div className="hero-actions"><a href="/menu">View Menu</a><a href="#delivery-zone-check">Check ZIP</a><a href="#customer-account-journey">Start Quote</a><a href="/customer">Customer Portal</a><a href="/pay">Deposit</a><a href="/freezer-boxes">See Boxes</a></div>
      <div className="route-confidence" aria-label="Customer confidence"><span>ZIP checked first</span><span>No pressure checkout</span><span>Giveaway stays free</span></div>
      <QuickRouteCapture />
    </div>
    <div className="prime-badge" aria-label="Premium badge"><span>USDA</span><strong>Choice</strong></div>
  </section>

  <section className="hero-benefit-bar" aria-label="Benefits"><article><span>*</span><strong>Triple-trimmed value</strong></article><article><span>*</span><strong>Cryovac freezer-ready</strong></article><article><span>*</span><strong>Grouped local delivery</strong></article></section>

  <MVPFlowStrip />

  <section className="freezer-section" id="home-paths">
    <div className="section-heading steakhouse-heading"><p className="brand-kicker">Choose Your Next Step</p><h2>Simple homepage. Focused pages.</h2><p>The homepage keeps the AI-connected customer flow intact while sending details to the right page instead of repeating everything here.</p></div>
    <div className="package-grid">{pageLinks.map(item=><article key={item.label}><p>Capital City Provisions</p><h3>{item.label}</h3><span>{item.text}</span><a href={item.href}>{item.label}</a></article>)}</div>
  </section>

  <DeliveryZoneCheck />
  <CustomerAccountJourney />

  <section className="route-section steakhouse-route" id="delivery"><div><p className="brand-kicker">Need help choosing?</p><h2>Get help choosing before you decide.</h2><p className="lead">Our customer team can help with box size, delivery basics, steak value, family meals, wholesale, and giveaway rules.</p><div className="hero-actions"><a href="/menu">View Menu</a><a href="/customer-concierge">Get Help Choosing</a><a href="#delivery-zone-check">Check ZIP</a><a href="/reviews">Reviews</a><a href="/contact">Contact Us</a></div></div><div className="route-list"><article><h3>Local route first</h3><p>Delivery timing depends on ZIP and grouped windows.</p><strong>Start with ZIP</strong></article><article><h3>Free giveaway entry</h3><p>No purchase necessary. Buying does not improve odds.</p><strong><a href="/giveaway">Enter free</a></strong></article></div></section>

  <section className="steakhouse-final-cta"><p className="brand-kicker">Ready?</p><h2>Start with your ZIP.</h2><p>That is the cleanest first step. From there, choose a package, request a quote, or get help choosing.</p><div className="hero-actions"><a href="/menu">View Steak Menu</a><a href="#delivery-zone-check">Check My ZIP</a><a href="/customer-concierge">Get Help Choosing</a><a href="/pay">Deposit / Invoice</a><a href="/reviews">Reviews</a><a href="/freezer-boxes">View Boxes</a></div></section>
  <PublicMobileStickyCTA />
</main>}