export const metadata={title:'Accessibility | Capital City Provisions, LLC',description:'Accessibility statement for Capital City Provisions, LLC.'};

const commitments=[
  ['Readable Pages','Public pages should use clear structure, readable contrast, descriptive links, and mobile-friendly layouts.'],
  ['Keyboard and Screen Reader Support','Navigation, buttons, forms, and accordions should remain usable with accessible labels and semantic markup where practical.'],
  ['Continuous Improvement','Accessibility is an ongoing process. Capital City Provisions may update content, components, forms, and workflows as issues are identified.'],
  ['Feedback Welcome','Customers who experience difficulty using the site can contact support and describe the page, device, and issue so it can be reviewed.']
];

export default function AccessibilityPage(){return <main className="site page-flow">
  <section className="page-hero"><div><p className="eyebrow">Accessibility</p><h1>Accessible service matters.</h1><p className="lead">Capital City Provisions, LLC aims to keep customer information, ordering paths, and support pages practical and usable across devices.</p><div className="actions"><a href="/contact">Report an Issue</a><a href="/customer-concierge">Open Concierge</a></div></div></section>
  <section className="section"><div className="section-heading"><p className="eyebrow">Commitment</p><h2>Cleaner pages help every customer.</h2></div><div className="detail-box-grid">{commitments.map(([title,text])=><article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>
</main>}
