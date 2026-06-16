import QuickRouteCapture from '../components/QuickRouteCapture';
import PublicMobileStickyCTA from '../components/PublicMobileStickyCTA';
import HeroMeatSlideshow from '../components/HeroMeatSlideshow';

const pageLinks=[
  {label:'Shop Boxes',href:'/freezer-boxes',text:'Choose a freezer box for family dinners, weekend grilling, or a full monthly stock-up.'},
  {label:'Family Stock-Up',href:'/food-security-freezer-boxes',text:'Build a simple restock plan around the meals your household already loves.'},
  {label:'How Delivery Works',href:'/how-delivery-works',text:'Check your area, pick your box, and get clear follow-up before delivery day.'},
  {label:'Launch Offer',href:'/giveaway',text:'See the current freezer giveaway and the easiest way to enter.'},
  {label:'Menu',href:'/menu',text:'Browse steaks, seafood, chicken, freezer packs, and seasonal favorites.'},
  {label:'Talk To Us',href:'/contact',text:'Ask for help choosing a box, checking delivery, or planning a larger order.'}
];

const benefits=[
  ['Hand-Trimmed Cuts','Steaks and everyday proteins selected for real home cooking.'],
  ['Freezer-Ready Packs','Sealed portions that stack cleanly and cook when you need them.'],
  ['Local Delivery','We check your area first so the next step is clear.'],
  ['Family Stock-Up','Choose a box that fits your freezer, budget, and week.']
];

export default function Home(){return <main className="site ccp-steakhouse">
  <section className="steakhouse-promo"><strong>Now launching:</strong> Premium freezer boxes with local delivery and personal box help.</section>

  <section className="steakhouse-hero" id="top">
    <div className="hero-overlay" />
    <div className="hero-content">
      <p className="brand-kicker">Capital City Provisions</p>
      <h1>Premium freezer boxes delivered with care.</h1>
      <p className="hero-subhead">Premium cuts. Freezer-ready packs. Local delivery.</p>
      <p className="hero-copy">Build a box around the meals your family actually cooks. Start with your ZIP and we will guide you to the right size, cuts, and next delivery window.</p>
      <div className="hero-actions"><a href="#quick-route">Check My ZIP</a><a href="/freezer-boxes">View Meat Boxes</a><a href="/menu">View Menu</a></div>
      <div className="route-confidence" aria-label="Customer confidence"><span>ZIP first</span><span>Box guidance</span><span>Local delivery</span></div>
      <QuickRouteCapture />
    </div>
    <HeroMeatSlideshow />
    <div className="prime-badge" aria-label="Premium badge"><span>Premium</span><strong>Beef</strong></div>
  </section>

  <section className="hero-benefit-bar luxury-badges" aria-label="Benefits">{benefits.map(([title,text])=><article key={title}><span className="benefit-mark" aria-hidden="true" /><div><strong>{title}</strong><small>{text}</small></div></article>)}</section>

  <section className="freezer-section" id="home-paths">
    <div className="section-heading steakhouse-heading"><p className="brand-kicker">Shop By Need</p><h2>Find the right freezer box.</h2><p>Choose a starting point and we will keep the next step simple: ZIP, box fit, and follow-up before anything is final.</p></div>
    <div className="package-grid">{pageLinks.map(item=><article key={item.label}><p>Capital City Provisions</p><h3>{item.label}</h3><span>{item.text}</span><a href={item.href}>{item.label}</a></article>)}</div>
  </section>

  <section className="steakhouse-final-cta"><p className="brand-kicker">Ready?</p><h2>Start with your ZIP.</h2><p>Tell us where you are and what you like to cook. We will help match the box, cuts, and delivery path.</p><div className="hero-actions"><a href="#quick-route">Check My ZIP</a><a href="/freezer-boxes">View Boxes</a><a href="/customer-concierge">Get Help Choosing</a></div></section>
  <PublicMobileStickyCTA zipHref="#quick-route" quoteHref="/customer-concierge" />
</main>}
