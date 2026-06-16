import PublicMobileStickyCTA from '../../components/PublicMobileStickyCTA';

export const metadata={
  title:'Route Concierge | Capital City Provisions',
  description:'Capital City Provisions route concierge for delivery planning, freezer boxes, bonuses, and giveaway separation.'
};

const steps=[
  ['Start with ZIP','We check whether your area fits a current or upcoming delivery route before you choose a freezer box.'],
  ['Match the box','Household size, freezer space, budget, and favorite proteins help narrow the best stock-up plan.'],
  ['Keep offers clear','Giveaway entry stays free. Order bonuses are separate and do not improve giveaway odds.'],
  ['Confirm next step','Request a quote, ask support, or compare boxes when you are ready.']
];

const questions=[
  ['Do you deliver to my ZIP?','Use the ZIP check first. If your area is active, we will show the route path. If not, you can join the launch list.'],
  ['Which box should I start with?','Smaller homes often start with an entry box. Families and deeper freezers usually compare mixed protein or steak-forward plans.'],
  ['Is this a checkout?','No. This launch path is for availability, quotes, support, and follow-up before final confirmation.'],
  ['Is the giveaway free?','Yes. No purchase is necessary, and purchase does not improve odds.']
];

export default function RouteConciergePage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">Route Concierge</p><h1>Check your delivery route before you pick a box.</h1><p className="lead">Use this guide to understand delivery fit, freezer-box options, launch bonuses, and free giveaway entry before you submit a request.</p><div className="actions"><a href="/#quick-route">Check ZIP</a><a href="/customer-concierge">Get Help Choosing</a><a href="/freezer-boxes">View Boxes</a></div></div><img src="/images/launch-local-delivery.webp" alt="Capital City Provisions route concierge"/></section>
  <section className="section"><div className="section-heading"><p className="eyebrow">Guided Path</p><h2>Simple help without pressure.</h2><p className="lead">The cleanest first step is route fit. From there, we help match the right freezer plan and follow-up path.</p></div><div className="detail-box-grid">{steps.map(([title,copy])=><article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
  <section className="section"><div className="section-heading"><p className="eyebrow">Quick Answers</p><h2>What customers ask first.</h2></div><div className="route-list">{questions.map(([title,copy])=><article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
  <section className="cta final-cta"><p className="eyebrow">Ready?</p><h2>Start with ZIP, then choose the next step.</h2><p>Capital City Provisions is launching as a local availability and quote path first. Final delivery details are confirmed before any order is locked in.</p><div className="actions"><a href="/#quick-route">Check ZIP</a><a href="/contact">Contact Support</a></div></section>
  <PublicMobileStickyCTA zipHref="/#quick-route" quoteHref="/customer-concierge" />
</main>}
