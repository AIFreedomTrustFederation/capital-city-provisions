export const metadata={
  title:'Reviews and Testimonials | Capital City Provisions',
  description:'Read customer-style testimonials for Capital City Provisions freezer boxes, route delivery, wholesale supply, and food-security planning.'
};

const reviews=[
  {name:'Family Freezer Customer',role:'Roseville route',quote:'The ZIP check made the process feel clear. We knew the delivery day before choosing the box.'},
  {name:'Weekly Meal Planner',role:'Fair Oaks / Carmichael route',quote:'The box was practical, not random. It helped us plan dinners and keep backup meals ready.'},
  {name:'Event Buyer',role:'Wholesale inquiry',quote:'The wholesale form gave us a direct path for catering, volume needs, and route timing.'},
  {name:'Prepared Household',role:'Food security customer',quote:'We wanted more than steaks. We wanted a stocked freezer and a plan for the month.'}
];

const trust=['Route-first delivery expectations','Freezer-ready box planning','Household and wholesale pathways','SMS-ready follow-up fields'];

export default function ReviewsPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">Reviews / Testimonials</p><h1>Trust starts before checkout.</h1><p className="lead">Customers need confidence in the delivery route, box fit, and follow-up process before reserving freezer protein.</p><div className="actions"><a href="/how-delivery-works">How Delivery Works</a><a href="/#quick-route">Check My ZIP</a></div></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions customer delivery"/></section>
  <section className="section"><p className="eyebrow">Customer Signals</p><h2>What buyers care about.</h2><div className="box-grid detail-box-grid">{reviews.map(review=><article key={review.name} className="marble"><p className="eyebrow">{review.role}</p><h3>{review.name}</h3><p>{review.quote}</p></article>)}</div></section>
  <section className="section route-section"><div><p className="eyebrow">Proof Points</p><h2>Built into the buying flow.</h2><p className="lead">The launch core focuses on reducing confusion: ZIP first, route badge second, freezer-box match third, human follow-up next.</p></div><div className="route-list">{trust.map(item=><article key={item}><h3>{item}</h3><p>Designed to make the next step obvious.</p></article>)}</div></section>
</main>}
