import QuickRouteCapture from '../../components/QuickRouteCapture';
import PublicMobileStickyCTA from '../../components/PublicMobileStickyCTA';
import styles from './PremiumMeatsHome.module.css';

export const metadata = {
  title: 'Premium Meats Delivered | Capital City Provisions',
  description: 'A premium black-and-gold Capital City Provisions homepage concept with ZIP check, menu paths, freezer boxes, delivery guidance, and customer concierge support.'
};

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

const premiumPaths=[
  ['View Menu','/menu','Browse steaks, chicken, seafood, prepared favorites, and freezer-ready proteins.'],
  ['Shop Freezer Boxes','/freezer-boxes','Choose a freezer stock-up box for family dinners, grilling, and monthly planning.'],
  ['How Delivery Works','/how-delivery-works','See route review, local coordination, and what to expect before delivery day.'],
  ['Customer Concierge','/customer-concierge','Get guided help choosing the right cuts, box size, and delivery path.'],
  ['Launch Offer','/giveaway','See current giveaway and launch offer details with clear no-purchase-required rules.'],
  ['Reviews','/reviews','Read customer proof and confidence builders before ordering.']
];

const promises=[
  ['♡','100% Satisfaction Guarantee'],
  ['♕','Sourced From Trusted Partners'],
  ['🚚','Safe, Secure & On Time Delivery'],
  ['🤝','Supporting Local & Family Owned']
];

export default function PremiumMeatsHome(){
  return <main className={styles.page}>
    <section className={styles.hero} id="top">
      <div className={`${styles.heartbeat} ${styles.heartbeatLeft}`} aria-hidden="true" />
      <div className={`${styles.heartbeat} ${styles.heartbeatRight}`} aria-hidden="true" />
      <div className={styles.steak} aria-hidden="true"><span>🥩</span></div>
      <div className={styles.border} aria-hidden="true" />

      <div className={styles.heroContent}>
        <p className={styles.kicker}><span />CCP DBA<span /></p>
        <h1><span>Premium Meats.</span><strong>Delivered.</strong></h1>
        <p className={styles.subhead}>Hand trimmed. Flash frozen. Cryovaced for optimal freshness.</p>
        <div className={styles.actions}>
          <a href="/menu">Order Now</a>
          <a href="/menu">View Menu</a>
          <a href="#quick-route">Check ZIP</a>
        </div>
      </div>

      <section className={styles.benefits} aria-label="Capital City Provisions benefits">
        {benefitCards.map(([icon,title,text])=><article key={title}><div>{icon}</div><h2>{title}</h2><p>{text}</p></article>)}
      </section>

      <section className={styles.categories} aria-label="Shop by category">
        <p className={styles.sectionTitle}><span />Shop By Category<span /></p>
        <div className={styles.categoryRow}>
          {categories.map(([title,text,icon,href])=><article key={title}><div className={styles.categoryImage}>{icon}</div><h2>{title}</h2><p>{text}</p><a href={href}>Shop Now</a></article>)}
        </div>
      </section>

      <section className={styles.routePanel} id="quick-route" aria-label="Quick route check">
        <div>
          <p className={styles.kickerSmall}>Start Here</p>
          <h2>Check your ZIP before choosing a box.</h2>
          <p>Keep the premium look, but preserve the working customer flow from the main homepage: ZIP first, route review, box guidance, and concierge follow-up.</p>
        </div>
        <QuickRouteCapture />
      </section>

      <section className={styles.paths} aria-label="Best current homepage paths">
        {premiumPaths.map(([label,href,text])=><article key={label}><p>Capital City Provisions</p><h2>{label}</h2><span>{text}</span><a href={href}>{label}</a></article>)}
      </section>

      <section className={styles.promise}>
        <div className={styles.promiseCopy}><h2>Our Promise</h2><p>We source the finest meats and freeze them at peak freshness. Every order is packed with care and delivered with pride.</p><a href="/about">Learn More</a></div>
        <div className={styles.promiseList}>{promises.map(([icon,text])=><div key={text}><span>{icon}</span><strong>{text}</strong></div>)}</div>
      </section>

      <div className={styles.watermark} aria-hidden="true">Capital City<br/><span>Provisions</span></div>
    </section>

    <section className={styles.bottomStrip} aria-label="Quality highlights">
      {benefitCards.map(([icon,title,text])=><article key={title}><span>{icon}</span><div><strong>{title}</strong><small>{text}</small></div></article>)}
    </section>
    <PublicMobileStickyCTA zipHref="#quick-route" quoteHref="/customer-concierge" />
  </main>;
}
