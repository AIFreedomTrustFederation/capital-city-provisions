export const metadata={title:'Driver Network | Capital City Provisions, LLC',description:'Driver and delivery partner information for Capital City Provisions, LLC.'};

const driverInfo=[
  ['Route Support','Drivers may support grouped delivery routes, appointment windows, customer communication, proof of delivery, and route notes.'],
  ['Professional Standards','Delivery partners should represent the brand with punctuality, clean communication, safe handling practices, and customer respect.'],
  ['Independent Roles','Driver participation does not imply employment, ownership, agency, or franchise status unless expressly agreed in writing by Capital City Provisions, LLC.'],
  ['Operational Fit','Driver intake may consider service area, vehicle readiness, availability, communication reliability, and ability to follow delivery instructions.']
];

export default function DriversPage(){return <main className="site page-flow">
  <section className="page-hero"><div><p className="eyebrow">Delivery Network</p><h1>Driver Network</h1><p className="lead">Capital City Provisions, LLC coordinates delivery support around clear routes, customer communication, and dependable local service.</p><div className="actions"><a href="/route-partnerships">Route Partnerships</a><a href="/contact">Contact Operations</a></div></div></section>
  <section className="section"><div className="section-heading"><p className="eyebrow">Driver Standards</p><h2>Reliable delivery is part of the brand.</h2></div><div className="detail-box-grid">{driverInfo.map(([title,text])=><article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>
</main>}
