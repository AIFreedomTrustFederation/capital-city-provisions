export const metadata={
  title:'Contact | Capital City Provisions',
  description:'Contact Capital City Provisions for stocked-home boxes, delivery availability, wholesale accounts, sales, orders, and support.'
};

const contacts=[
  {label:'Orders',email:'orders@capitalcityprovisions.com',text:'Questions about an existing or upcoming order.'},
  {label:'Sales',email:'sales@capitalcityprovisions.com',text:'New boxes, steak requests, catalog questions, and ZIP checks.'},
  {label:'Wholesale',email:'wholesale@capitalcityprovisions.com',text:'Restaurants, caterers, events, churches, lodges, and food trucks.'},
  {label:'Support',email:'support@capitalcityprovisions.com',text:'Delivery timing, follow-up, and customer help.'},
  {label:'General',email:'info@capitalcityprovisions.com',text:'Partnerships, producer relationships, and general questions.'}
];

export default function ContactPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">Contact</p><h1>Get to the right person faster.</h1><p className="lead">Tell us what you need: home stock-up, steak request, delivery area, wholesale account, or help with an order.</p><div className="actions"><a href="mailto:sales@capitalcityprovisions.com">Email Sales</a><a href="/delivery-map">Check Delivery</a></div></div><img src="/images/launch-consultation-support.webp" alt="Capital City Provisions contact"/></section>
  <section className="section"><p className="eyebrow">Departments</p><h2>Send the useful details once.</h2><div className="contact-grid">{contacts.map(c=><article key={c.label}><h3>{c.label}</h3><p>{c.text}</p><a href={`mailto:${c.email}`}>{c.email}</a></article>)}</div></section>
  <section className="cta poster-frame final-cta"><p className="eyebrow">Faster Help</p><h2>Include ZIP, household size, and what you want stocked.</h2><p>For wholesale, include volume, timing, and product needs so the first reply can be specific.</p><div className="actions"><a href="/freezer-boxes">Compare Boxes</a><a href="/wholesale">Wholesale Accounts</a></div></section>
</main>}
