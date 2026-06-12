export const metadata={title:'Affiliate Suppliers | Capital City Provisions, LLC',description:'Supplier relationship information for Capital City Provisions, LLC.'};

const points=[
  ['Approved Network','Capital City Provisions may work with approved suppliers, wholesalers, processors, fulfillment partners, and local business affiliates to support customer demand.'],
  ['Quality Expectations','Supplier participation should support freezer-ready packaging, clear communication, dependable availability, and customer-safe handling practices.'],
  ['No Implied Ownership','Supplier, affiliate, or vendor participation does not create ownership, agency, employment, franchise, or endorsement unless agreed in writing.'],
  ['Business Intake','Potential suppliers can begin with a contact request describing products, coverage area, delivery capacity, pricing structure, and compliance readiness.']
];

export default function AffiliateSuppliersPage(){return <main className="site page-flow">
  <section className="page-hero"><div><p className="eyebrow">Business Network</p><h1>Affiliate Suppliers</h1><p className="lead">Capital City Provisions, LLC is building a practical supplier network for freezer-ready provisions, local route support, and stocked-home demand.</p><div className="actions"><a href="/vendor-intake">Start Vendor Intake</a><a href="/wholesale">Wholesale</a></div></div></section>
  <section className="section"><div className="section-heading"><p className="eyebrow">Supplier Trust</p><h2>Clear roles make stronger operations.</h2></div><div className="detail-box-grid">{points.map(([title,text])=><article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>
</main>}
