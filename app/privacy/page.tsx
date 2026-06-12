export const metadata={title:'Privacy Policy | Capital City Provisions, LLC',description:'Privacy practices for Capital City Provisions, LLC customer, delivery, and support information.'};

const items=[
  ['Information We Collect','We may collect contact details, delivery area information, order preferences, support messages, payment status references, and website interaction data needed to operate customer service and delivery coordination.'],
  ['How We Use Information','Information is used to respond to inquiries, check service areas, coordinate orders, support customers, improve the website, manage partner operations, and protect Capital City Provisions, LLC.'],
  ['Sharing','We may share limited information with approved suppliers, delivery partners, payment processors, customer support tools, and service providers only as needed to operate the business.'],
  ['Customer Choices','Customers may request updates to contact information, ask support questions, or request removal from marketing communications by contacting Capital City Provisions.']
];

export default function PrivacyPage(){return <main className="site page-flow">
  <section className="page-hero"><div><p className="eyebrow">Legal</p><h1>Privacy Policy</h1><p className="lead">Capital City Provisions, LLC respects customer trust. This page explains how information may be collected and used for ordering, support, delivery coordination, and business operations.</p><div className="actions"><a href="/contact">Contact Support</a><a href="/terms">Terms of Service</a></div></div></section>
  <section className="section"><div className="section-heading"><p className="eyebrow">Customer Data</p><h2>Clear use. Practical protection.</h2><p className="lead">This policy is intended to summarize common privacy practices for the website and customer service process.</p></div><div className="detail-box-grid">{items.map(([title,text])=><article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>
  <section className="cta final-cta"><p className="eyebrow">Notice</p><h2>Policy updates may occur.</h2><p>Capital City Provisions, LLC may update this policy as systems, services, suppliers, delivery processes, or legal requirements change.</p></section>
</main>}
