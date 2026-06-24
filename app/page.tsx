import PublicMobileStickyCTA from '../components/PublicMobileStickyCTA';

const benefitCards=[
  ['🚚','Free Delivery','Fast. Reliable. Direct to you.'],
  ['🔪','Hand Trimmed','By experts. For quality.'],
  ['❄️','Flash Frozen','Locks in freshness.'],
  ['🫙','Cryovaced','Sealed tight. Built right.']
];

const categories=[
  ['Steaks','Premium cuts','🥩','/menu'],
  ['Chicken','Fresh & tender','🍗','/menu'],
  ['Bundles','Best value','📦','/freezer-boxes'],
  ['Seafood','Wild & farm raised','🐟','/menu'],
  ['Prepared','Ready to enjoy','🍽️','/menu']
];

const promises=[
  ['♡','100% Satisfaction Guarantee'],
  ['♕','Sourced From Trusted Partners'],
  ['🚚','Safe, Secure & On Time Delivery'],
  ['🤝','Supporting Local & Family Owned']
];

export default function Home(){return <main className="site ccp-steakhouse homepage-mockup">
  <section className="mockup-hero" id="top">
    <div className="heartbeat-line heartbeat-left" aria-hidden="true" />
    <div className="heartbeat-line heartbeat-right" aria-hidden="true" />
    <div className="mockup-steak" aria-hidden="true"><span>🥩</span></div>
    <div className="mockup-border" aria-hidden="true" />

    <div className="mockup-hero-content">
      <p className="mockup-kicker"><span />CCP DBA<span /></p>
      <h1><span>Premium Meats.</span><strong>Delivered.</strong></h1>
      <p className="mockup-subhead">Hand trimmed. Flash frozen. Cryovaced for optimal freshness.</p>
      <div className="mockup-actions"><a href="/menu">Order Now</a><a href="/menu">View Menu</a></div>
    </div>

    <section className="mockup-benefits" aria-label="Capital City Provisions benefits">
      {benefitCards.map(([icon,title,text])=><article key={title}><div>{icon}</div><h2>{title}</h2><p>{text}</p></article>)}
    </section>

    <section className="mockup-categories" aria-label="Shop by category">
      <p className="mockup-section-title"><span />Shop By Category<span /></p>
      <div className="category-row">
        {categories.map(([title,text,icon,href])=><article key={title}><div className="category-image">{icon}</div><h2>{title}</h2><p>{text}</p><a href={href}>Shop Now</a></article>)}
      </div>
    </section>

    <section className="mockup-promise" id="quick-route">
      <div className="promise-copy"><h2>Our Promise</h2><p>We source the finest meats and freeze them at peak freshness. Every order is packed with care and delivered with pride.</p><a href="/about">Learn More</a></div>
      <div className="promise-list">{promises.map(([icon,text])=><div key={text}><span>{icon}</span><strong>{text}</strong></div>)}</div>
    </section>

    <div className="mockup-watermark" aria-hidden="true">Capital City<br/><span>Provisions</span></div>
  </section>

  <section className="mockup-bottom-strip" aria-label="Quality highlights">
    {benefitCards.map(([icon,title,text])=><article key={title}><span>{icon}</span><div><strong>{title}</strong><small>{text}</small></div></article>)}
  </section>
  <PublicMobileStickyCTA zipHref="#quick-route" quoteHref="/customer-concierge" />
</main>}
