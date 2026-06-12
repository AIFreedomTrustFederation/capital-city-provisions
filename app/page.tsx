import QuickRouteCapture from '../components/QuickRouteCapture';
import PublicMobileStickyCTA from '../components/PublicMobileStickyCTA';
import HeroMeatSlideshow from '../components/HeroMeatSlideshow';

const pageLinks=[
  {label:'Meat Boxes',href:'/freezer-boxes',text:'Compare family freezer boxes, premium assortments, and bulk stock-up options.'},
  {label:'Restock Club',href:'/food-security-freezer-boxes',text:'Build a recurring freezer plan so the house stays stocked without warehouse runs.'},
  {label:'How Delivery Works',href:'/how-delivery-works',text:'Check your ZIP, confirm your order, and receive grouped local delivery.'},
  {label:'Current Offer',href:'/giveaway',text:'Review the current launch offer and customer entry details.'},
  {label:'View Menu',href:'/menu',text:'See current steak-box options, freezer packs, and QR-ready menu graphics.'},
  {label:'Contact',href:'/contact',text:'Ask sales, support, wholesale, delivery, or customer service questions.'}
];

const benefits=[
  ['Triple Trimmed','Premium cuts prepared to impress.'],
  ['Cryovac Packed','Fresh-sealed for freezer-ready storage.'],
  ['Free Delivery','Convenient local delivery direct to your door.'],
  ['Family Freezer Ready','Bulk value with luxury presentation.']
];

export default function Home(){return <main className="site ccp-steakhouse">
  <section className="steakhouse-promo"><strong>Launch Offer:</strong> Premium beef boxes, freezer-ready packaging, and local delivery built for stocked homes.</section>

  <section className="steakhouse-hero" id="top">
    <div className="hero-overlay" />
    <div className="hero-content">
      <p className="brand-kicker">Capital City Provisions</p>
      <h1>Steakhouse beef delivered like a luxury service.</h1>
      <p className="hero-subhead">Triple-trimmed. Cryovac packed. Free local delivery.</p>
      <p className="hero-copy">Fill your freezer with premium proteins without the warehouse run. Start with your ZIP, then choose the box, delivery path, or support page that fits your home.</p>
      <div className="hero-actions"><a href="#quick-route">Check My ZIP</a><a href="/freezer-boxes">View Meat Boxes</a><a href="/menu">View Menu</a></div>
      <div className="route-confidence" aria-label="Customer confidence"><span>ZIP checked first</span><span>Simple order path</span><span>Local delivery</span></div>
      <QuickRouteCapture />
    </div>
    <HeroMeatSlideshow />
    <div className="prime-badge" aria-label="Premium badge"><span>Premium</span><strong>Beef</strong></div>
  </section>

  <section className="hero-benefit-bar luxury-badges" aria-label="Benefits">{benefits.map(([title,text])=><article key={title}><span>✦</span><div><strong>{title}</strong><small>{text}</small></div></article>)}</section>

  <section className="freezer-section" id="home-paths">
    <div className="section-heading steakhouse-heading"><p className="brand-kicker">Choose Your Next Step</p><h2>One premium doorway. Clear paths.</h2><p>The homepage now stays simple: luxury advertising up front, then clean links to the deeper pages instead of repeated forms and duplicate sales blocks.</p></div>
    <div className="package-grid">{pageLinks.map(item=><article key={item.label}><p>Capital City Provisions</p><h3>{item.label}</h3><span>{item.text}</span><a href={item.href}>{item.label}</a></article>)}</div>
  </section>

  <section className="steakhouse-final-cta"><p className="brand-kicker">Ready?</p><h2>Start with your ZIP.</h2><p>That is the cleanest first step. From there, choose a package, request help, or review the current offer.</p><div className="hero-actions"><a href="#quick-route">Check My ZIP</a><a href="/freezer-boxes">View Boxes</a><a href="/customer-concierge">Get Help Choosing</a></div></section>
  <PublicMobileStickyCTA zipHref="#quick-route" quoteHref="/customer-concierge" />
</main>}
