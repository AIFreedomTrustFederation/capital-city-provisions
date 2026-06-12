export const metadata={title:'Vendor Intake | Capital City Provisions, LLC',description:'Vendor intake information for Capital City Provisions, LLC suppliers and partners.'};

const intake=[
  ['What to Send','Business name, contact person, service area, product or service category, capacity, delivery or pickup options, pricing model, and available business documentation.'],
  ['Who Should Apply','Meat suppliers, wholesale partners, packaging partners, delivery providers, catering partners, service providers, and local business affiliates.'],
  ['Review Process','Capital City Provisions may review fit, service area, capacity, quality expectations, communication reliability, and customer impact before any relationship begins.'],
  ['Written Terms Required','No supplier, vendor, affiliate, driver, or partner relationship is created without written confirmation from Capital City Provisions, LLC.']
];

export default function VendorIntakePage(){return <main className="site page-flow">
  <section className="page-hero"><div><p className="eyebrow">Business Intake</p><h1>Vendor Intake</h1><p className="lead">Use this page to understand what Capital City Provisions, LLC needs before reviewing a supplier, vendor, affiliate, driver, or service partner relationship.</p><div className="actions"><a href="/contact">Submit Inquiry</a><a href="/affiliate-suppliers">Supplier Info</a></div></div></section>
  <section className="section"><div className="section-heading"><p className="eyebrow">Review Checklist</p><h2>Start organized. Stay protected.</h2></div><div className="detail-box-grid">{intake.map(([title,text])=><article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>
</main>}
