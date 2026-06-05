export const metadata={
  title:'Contact | Capital City Provisions',
  description:'Contact Capital City Provisions for freezer boxes, delivery routes, wholesale accounts, sales, orders, and support.'
};

const contacts=[
  {label:'Orders',email:'orders@capitalcityprovisions.com',text:'Existing or upcoming freezer-box orders.'},
  {label:'Sales',email:'sales@capitalcityprovisions.com',text:'New household boxes, catalog questions, and route planning.'},
  {label:'Wholesale',email:'wholesale@capitalcityprovisions.com',text:'Restaurants, caterers, events, churches, lodges, and food trucks.'},
  {label:'Support',email:'support@capitalcityprovisions.com',text:'Delivery follow-up, route timing, and customer help.'},
  {label:'General',email:'info@capitalcityprovisions.com',text:'Partnerships, producer relationships, and general questions.'}
];

export default function ContactPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">Contact</p><h1>Reach the right department.</h1><p className="lead">Tell us whether you need a freezer box, route check, wholesale account, or support with an existing order.</p><div className="actions"><a href="mailto:sales@capitalcityprovisions.com">Email Sales</a><a href="/delivery-map">Check Route Map</a></div></div><img src="/images/freezer-family.png" alt="Capital City Provisions contact"/></section>
  <section className="section"><p className="eyebrow">Departments</p><h2>Send the right note the first time.</h2><div className="contact-grid">{contacts.map(c=><article key={c.label}><h3>{c.label}</h3><p>{c.text}</p><a href={`mailto:${c.email}`}>{c.email}</a></article>)}</div></section>
  <section className="cta poster-frame final-cta"><p className="eyebrow">Faster Help</p><h2>Include your ZIP code and freezer goal.</h2><p>For the fastest answer, include your delivery ZIP, household size, preferred proteins, and whether this is household or wholesale.</p><div className="actions"><a href="/freezer-boxes">Compare Boxes</a><a href="/wholesale">Wholesale Accounts</a></div></section>
</main>}
