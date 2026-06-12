export const metadata={title:'Refund and Replacement Policy | Capital City Provisions, LLC',description:'Refund, replacement, and customer support policy for Capital City Provisions, LLC.'};

const policies=[
  ['Customer Support First','Customers should contact support as soon as possible if an order appears incorrect, damaged, delayed, missing, or otherwise not as expected.'],
  ['Perishable Goods','Because food products are perishable, refunds and replacements may depend on timing, condition, documentation, delivery status, and whether the product can be reasonably verified.'],
  ['Replacement Review','Capital City Provisions may review photos, delivery notes, route records, supplier information, and customer communication before approving a replacement, credit, or refund.'],
  ['No Unauthorized Disposal Claims','Customers should preserve relevant packaging, labels, photos, and details when reporting an issue so support can review the concern accurately.']
];

export default function RefundPolicyPage(){return <main className="site page-flow">
  <section className="page-hero"><div><p className="eyebrow">Customer Care</p><h1>Refund and Replacement Policy</h1><p className="lead">Capital City Provisions, LLC wants customer issues handled clearly, quickly, and fairly while respecting the realities of freezer-ready food delivery.</p><div className="actions"><a href="/contact">Contact Support</a><a href="/how-delivery-works">How Delivery Works</a></div></div></section>
  <section className="section"><div className="section-heading"><p className="eyebrow">Support Review</p><h2>Food delivery issues need fast communication.</h2></div><div className="detail-box-grid">{policies.map(([title,text])=><article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>
  <section className="cta final-cta"><p className="eyebrow">Need Help?</p><h2>Start with support.</h2><p>Send your name, order details, delivery area, photos if available, and a short explanation so the team can review the issue.</p><div className="actions"><a href="/contact">Open Support</a></div></section>
</main>}
