export const metadata={title:'Route Partnerships | Capital City Provisions, LLC',description:'Route partnership information for Capital City Provisions, LLC delivery coordination.'};

const routeInfo=[
  ['Grouped Delivery Logic','Route partnerships may support grouped local delivery, service area planning, pickup points, event routes, and customer communication.'],
  ['Local Efficiency','Better routing can reduce missed appointments, improve customer expectations, and help stocked-home deliveries feel more dependable.'],
  ['Partner Roles','Route partners may include drivers, local businesses, fulfillment support, community contacts, or service providers approved for specific route needs.'],
  ['Written Confirmation','A conversation, link, form submission, or referral does not create a partnership unless Capital City Provisions, LLC confirms the arrangement in writing.']
];

export default function RoutePartnershipsPage(){return <main className="site page-flow">
  <section className="page-hero"><div><p className="eyebrow">Delivery Network</p><h1>Route Partnerships</h1><p className="lead">Capital City Provisions, LLC is designed around clearer delivery areas, grouped local routes, and practical support for customers who want stocked-home planning.</p><div className="actions"><a href="/delivery-map">View Delivery Areas</a><a href="/drivers">Driver Network</a></div></div></section>
  <section className="section"><div className="section-heading"><p className="eyebrow">Route Support</p><h2>Better routes build better trust.</h2></div><div className="detail-box-grid">{routeInfo.map(([title,text])=><article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>
</main>}
