export const metadata={
  title:'Reviews and Testimonials | Capital City Provisions',
  description:'Customer-style testimonials for Capital City Provisions stocked-home boxes, delivery clarity, wholesale supply, and planning support.'
};

const reviews=[
  {name:'Family Stock-Up Customer',role:'Roseville',quote:'The process felt clear from the start. We knew the area status before picking a box.'},
  {name:'Weekly Meal Planner',role:'Fair Oaks / Carmichael',quote:'It was practical, not random. The mix made dinners easier and gave us backup options.'},
  {name:'Event Buyer',role:'Wholesale inquiry',quote:'The form pointed us straight to volume, timing, and product questions that matter.'},
  {name:'Prepared Household',role:'Food security customer',quote:'We wanted a calmer month, not just more meat. The plan made that feel possible.'}
];

const trust=['Availability before commitment','Cuts planned around real use','Paths for homes and wholesale buyers','Follow-up details ready for text or email'];

export default function ReviewsPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">Reviews</p><h1>Confidence starts before checkout.</h1><p className="lead">Customers want to know the plan makes sense: the area, the box, the timing, and the follow-up.</p><div className="actions"><a href="/how-delivery-works">How It Works</a><a href="/#quick-route">Check ZIP</a></div></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions customer experience"/></section>
  <section className="section"><p className="eyebrow">Customer Signals</p><h2>What buyers care about.</h2><div className="box-grid detail-box-grid">{reviews.map(review=><article key={review.name} className="marble"><p className="eyebrow">{review.role}</p><h3>{review.name}</h3><p>{review.quote}</p></article>)}</div></section>
  <section className="section route-section"><div><p className="eyebrow">Proof Points</p><h2>The experience is built to reduce friction.</h2><p className="lead">ZIP first, plan second, human follow-up next. That keeps the customer journey clean and useful.</p></div><div className="route-list">{trust.map(item=><article key={item}><h3>{item}</h3><p>Small details that make the next step easier.</p></article>)}</div></section>
</main>}
