import QuickRouteCapture from '../components/QuickRouteCapture';
import MeatSlideshow from '../components/MeatSlideshow';
import PublicMobileStickyCTA from '../components/PublicMobileStickyCTA';

const offerCards=[
  {title:'Family Freezer Boxes',href:'/freezer-boxes',kicker:'Home Stock-Up',text:'Compare Baby, Mama, Papa, Big Mama, and Big Papa freezer packages by household size and freezer space.'},
  {title:'Premium Steak Packages',href:'/steak-delivery',kicker:'Steak Lovers',text:'Ribeye, filet, New York strip, sirloin, and grill-night boxes for customers who want beef first.'},
  {title:'Monthly Restock Club',href:'/monthly-restock',kicker:'Recurring Buyers',text:'Keep the freezer ready with a practical restock rhythm built around your home and route.'},
  {title:'Wholesale / Bulk Orders',href:'/wholesale',kicker:'Business & Events',text:'Supply support for restaurants, food trucks, churches, lodges, caterers, events, and group buyers.'},
  {title:'Freezer Giveaway',href:'/giveaway',kicker:'Promotion',text:'Enter the giveaway separately. No purchase necessary, and buying does not improve odds.'},
  {title:'How Delivery Works',href:'/how-delivery-works',kicker:'Start Here',text:'See how ZIP checks, grouped delivery routes, follow-up, and freezer-box planning connect.'}
];

const trustPoints=['Free local delivery routing','Cryovac freezer-ready packing','Triple-trimmed value focus','ZIP checked before promises'];
const steps=['See the food','Choose your path','Check delivery','Build the right box'];

export default function Home(){return <main className="site page-flow ccp-home-refresh">
  <section className="promo-ribbon"><strong>Launch Offer:</strong> Premium freezer meats, local route planning, and a free giveaway entry path that stays separate from purchase.</section>

  <section className="landing-hero poster-frame">
    <div className="hero-copy">
      <p className="eyebrow">Capital City Provisions</p>
      <h1>Premium freezer meats delivered locally.</h1>
      <p className="lead">Stock your home with steakhouse-style beef, practical family proteins, and freezer-ready boxes without turning the homepage into a long intake form.</p>
      <div className="actions"><a href="/freezer-boxes">View Freezer Boxes</a><a href="/catalog">View Catalog</a><a href="#quick-route">Check ZIP</a></div>
      <div className="promo-grid">{trustPoints.map(point=><span key={point}>{point}</span>)}</div>
    </div>
    <div className="landing-art"><MeatSlideshow/></div>
  </section>

  <section className="section">
    <div className="section-heading compact"><p className="eyebrow">Choose Your Path</p><h2>One homepage. Focused offer pages.</h2><p className="lead">The homepage now works like a simple advertisement hub. Customers see the food, understand the promise, then choose the page that matches their buying intent.</p></div>
    <div className="grid">{offerCards.map(card=><article key={card.title}><p className="eyebrow">{card.kicker}</p><h3>{card.title}</h3><p>{card.text}</p><a href={card.href}>Open Page</a></article>)}</div>
  </section>

  <section className="section route-section">
    <div><p className="eyebrow">Simple Flow</p><h2>Make them hungry first. Collect details second.</h2><p className="lead">Detailed forms now belong on the focused offer and contact paths. The homepage should sell the appetite, the convenience, and the clear next step.</p></div>
    <div className="route-list">{steps.map((step,index)=><article key={step}><span className="badge">Step {index+1}</span><h3>{step}</h3><p>{index===0?'The slideshow creates the first crave moment.':index===1?'Cards route families, steak buyers, restock customers, wholesale buyers, and giveaway entrants.':index===2?'The current ZIP logic stays connected through the existing quick route capture.':'The global concierge and contact paths keep lead capture wired to the current app.'}</p></article>)}</div>
  </section>

  <section className="section" id="delivery-start">
    <div className="section-heading compact"><p className="eyebrow">Delivery Check</p><h2>One quick ZIP check, not repeated forms.</h2><p className="lead">This keeps the landing page connected to the existing route capture, local storage, lead API, and customer concierge flow.</p></div>
    <QuickRouteCapture/>
  </section>

  <section className="cta poster-frame final-cta"><p className="eyebrow">Ready</p><h2>Start with the page that fits the customer.</h2><p>Family boxes, steak packages, restock club, wholesale, giveaway, and delivery education now live on their own focused pages.</p><div className="actions"><a href="/freezer-boxes">Shop Freezer Boxes</a><a href="/steak-delivery">Steak Packages</a><a href="/contact">Ask For Help</a></div></section>

  <PublicMobileStickyCTA />
</main>}
