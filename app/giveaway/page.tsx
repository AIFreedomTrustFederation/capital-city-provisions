import GiveawayEntry from '../../components/GiveawayEntry';

export const metadata={
  title:'Freezer Giveaway | Capital City Provisions',
  description:'Enter the Capital City Provisions freezer giveaway. No purchase necessary and purchase does not improve odds.'
};

const details=[
  ['No purchase necessary','Enter with your contact details and delivery ZIP. Buying does not improve your odds.'],
  ['$1,800+ prize value','The featured prize is planned as a freezer packed with premium proteins and family-ready meals. Final prize details are governed by the official rules.'],
  ['Local route friendly','We use ZIP codes to understand delivery coverage and plan grouped routes.'],
  ['Separate from order bonuses','The cheesecake thank-you gift is a limited order offer, not a giveaway requirement.'],
  ['Winner follow-up','The selected winner will be contacted using the details submitted on the entry form.']
];

const prize=['Premium steaks','Chicken and family staples','Pork favorites','Shrimp, lobster, crab, and seafood selections','Ready-to-plan family meals'];

export default function GiveawayPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">Freezer Giveaway</p><h1>Win a freezer full of food.</h1><p className="lead">Imagine opening the garage and seeing a brand-new freezer packed with premium steaks, chicken, pork, seafood, and family meals ready to cook. No purchase necessary. Purchase does not improve odds.</p><div className="actions"><a href="#entry">Enter Free</a><a href="/official-rules">Official Rules</a></div></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions freezer giveaway"/></section>
  <section className="section"><p className="eyebrow">Prize Vision</p><h2>A stocked freezer with real dinner power.</h2><div className="route-list">{prize.map(item=><article key={item}><h3>{item}</h3><p>Premium food chosen to make the freezer feel useful from day one.</p></article>)}</div></section>
  <section className="section route-section"><div><p className="eyebrow">Clean Offer</p><h2>Useful urgency, no tricks.</h2><p className="lead">The freezer giveaway is free to enter. The 48-hour cheesecake thank-you gift is a separate limited-time bonus for qualifying first freezer-box orders placed after a route check, while supplies last.</p></div><div className="route-list">{details.map(([title,copy])=><article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
  <section className="section" id="entry"><GiveawayEntry/></section>
  <section className="section"><p className="eyebrow">Hot Off The Grill</p><h2>A live event hook people remember.</h2><p className="lead">For special events, the first guests may be offered a fresh steak slider made right in front of them: thin-sliced steak, grilled onions, warm Hawaiian roll, hot off the flat top.</p></section>
  <section className="section"><p className="eyebrow">Order Bonus</p><h2>Want the cheesecake offer too?</h2><p className="lead">Check your ZIP, reserve a qualifying first freezer box within 48 hours, and ask sales to apply the cheesecake thank-you gift. One per household, route and inventory permitting.</p><div className="actions"><a href="/#quick-route">Check My Route</a><a href="/family-freezer-boxes">Compare Boxes</a></div></section>
</main>}