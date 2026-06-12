import QuickRouteCapture from '../components/QuickRouteCapture';
import PublicMobileStickyCTA from '../components/PublicMobileStickyCTA';
import HeroMeatSlideshow from '../components/HeroMeatSlideshow';

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
      <p className="hero-copy">Start with your ZIP, then jump to the page that matches what you need: menu, boxes, delivery, giveaway, or support.</p>
      <div className="hero-actions"><a href="/menu">View Menu</a><a href="#quick-route">Check ZIP</a><a href="/freezer-boxes">See Boxes</a><a href="/giveaway">Giveaway</a></div>
      <div className="route-confidence" aria-label="Customer confidence"><span>ZIP checked first</span><span>No pressure checkout</span><span>Giveaway stays free</span></div>
      <QuickRouteCapture />
    </div>
    <HeroMeatSlideshow />
    <div className="prime-badge" aria-label="Premium badge"><span>USDA</span><strong>Choice</strong></div>
  </section>

  <section className="hero-benefit-bar" aria-label="Benefits"><article><span>*</span><strong>Triple-trimmed value</strong></article><article><span>*</span><strong>Cryovac freezer-ready</strong></article><article><span>*</span><strong>Grouped local delivery</strong></article></section>

  <section className="freezer-section" id="home-paths">
    <div className="section-heading steakhouse-heading"><p className="brand-kicker">Choose Your Next Step</p><h2>One homepage. Clear paths.</h2><p>Use the homepage as the doorway. The details live on the pages built for each customer need.</p></div>
    <div className="package-grid">{pageLinks.map(item=><article key={item.label}><p>Capital City Provisions</p><h3>{item.label}</h3><span>{item.text}</span><a href={item.href}>{item.label}</a></article>)}</div>
  </section>

  <section className="steakhouse-final-cta"><p className="brand-kicker">Ready?</p><h2>Start with your ZIP.</h2><p>That is the cleanest first step. From there, choose a package, request help, or enter the giveaway.</p><div className="hero-actions"><a href="#quick-route">Check My ZIP</a><a href="/menu">View Menu</a><a href="/customer-concierge">Get Help Choosing</a></div></section>
  <PublicMobileStickyCTA zipHref="#quick-route" quoteHref="/customer-concierge" />
</main>}