export const metadata={title:'SMS Terms | Capital City Provisions, LLC',description:'SMS and messaging terms for Capital City Provisions, LLC.'};

const items=[
  ['Messaging Purpose','Messages may relate to delivery area checks, order coordination, customer support, appointment reminders, promotions, route updates, and follow-up requested by the customer.'],
  ['Consent','By providing a phone number, customers may authorize Capital City Provisions or approved service providers to contact them about their inquiry, order, delivery, or account.'],
  ['Opt Out','Customers may request to stop marketing messages. Transactional or service-related messages may still be sent when needed to complete support, delivery, or account requests.'],
  ['Carrier Terms','Message frequency may vary. Message and data rates may apply depending on the customer carrier and mobile plan.']
];

export default function SmsTermsPage(){return <main className="site page-flow">
  <section className="page-hero"><div><p className="eyebrow">Legal</p><h1>SMS Terms</h1><p className="lead">These terms explain how Capital City Provisions, LLC may use text messaging for service, support, delivery coordination, and customer follow-up.</p><div className="actions"><a href="/contact">Contact Support</a><a href="/privacy">Privacy Policy</a></div></div></section>
  <section className="section"><div className="section-heading"><p className="eyebrow">Messaging</p><h2>Helpful updates without confusion.</h2></div><div className="detail-box-grid">{items.map(([title,text])=><article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>
</main>}
