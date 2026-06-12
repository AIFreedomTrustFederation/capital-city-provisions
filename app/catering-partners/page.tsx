export const metadata={title:'Catering Partners | Capital City Provisions, LLC',description:'Catering and event partner information for Capital City Provisions, LLC.'};

const partnerInfo=[
  ['Events and Group Needs','Capital City Provisions can help route inquiries for families, gatherings, kitchens, churches, crews, and community events that need stocked protein planning.'],
  ['Partner Support','Catering partners may support prepared service, event planning, pickup coordination, delivery assistance, or customer referrals depending on availability and agreement.'],
  ['Brand Clarity','Catering partner participation does not create ownership, employment, agency, franchise, or endorsement unless expressly stated in writing.'],
  ['Start the Conversation','Prospective partners should share service area, food handling capacity, event types, scheduling limits, and contact information.']
];

export default function CateringPartnersPage(){return <main className="site page-flow">
  <section className="page-hero"><div><p className="eyebrow">Business Network</p><h1>Catering Partners</h1><p className="lead">Capital City Provisions, LLC supports a premium stocked-home and event-ready brand that can connect with trusted catering and preparation partners.</p><div className="actions"><a href="/contact">Partner Inquiry</a><a href="/customer-concierge">Customer Concierge</a></div></div></section>
  <section className="section"><div className="section-heading"><p className="eyebrow">Partnership Path</p><h2>Event support without customer confusion.</h2></div><div className="detail-box-grid">{partnerInfo.map(([title,text])=><article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>
</main>}
