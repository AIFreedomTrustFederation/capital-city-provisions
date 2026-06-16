import PublicMobileStickyCTA from '../../components/PublicMobileStickyCTA';

export const metadata={
  title:'Get Help Choosing | Capital City Provisions',
  description:'Customer help for freezer boxes, delivery routes, bonuses, and giveaway clarity.'
};

const steps=[
  ['Tell us your ZIP','We check whether your area fits a current or upcoming delivery route.'],
  ['Share your freezer space','A small upright, garage freezer, or deep freezer changes which box makes sense.'],
  ['Pick your eating style','Steaks, ground beef, chicken, pork, family dinners, meal prep, or mixed stock-up plans.'],
  ['Confirm the next step','Request a quote, compare boxes, or ask support before anything is final.']
];

export default function CustomerConciergePage(){return <main className="site page-flow">
  <section className="page-hero"><div><p className="eyebrow">Customer Concierge</p><h1>Not sure what box fits?</h1><p className="lead">Use the concierge path to choose the right freezer box, delivery route, and stock-up plan without pressure.</p><div className="actions"><a href="/customer#customer-account-journey">Request Quote</a><a href="/customer#delivery-zone-check">Check ZIP</a><a href="/freezer-boxes">View Boxes</a></div></div></section>
  <section className="section"><div className="section-heading"><p className="eyebrow">How It Works</p><h2>Simple help before anything is final.</h2><p className="lead">Start with the basics. We will help match your home, freezer space, and delivery area to a practical box.</p></div><div className="detail-box-grid">{steps.map(([title,text])=><article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>
  <section className="cta final-cta"><p className="eyebrow">Ready?</p><h2>Start with your ZIP or request a quote.</h2><p>Capital City Provisions keeps the buying path clear so you can stock the house with confidence.</p><div className="actions"><a href="/customer#delivery-zone-check">Check ZIP</a><a href="/contact">Contact Support</a></div></section>
  <PublicMobileStickyCTA zipHref="/customer#delivery-zone-check" quoteHref="/customer#customer-account-journey" />
</main>}
