export const metadata={title:'Terms of Service | Capital City Provisions, LLC',description:'Website and service terms for Capital City Provisions, LLC.'};

const terms=[
  ['Website Use','The website is provided for customer information, order interest, delivery coordination, business inquiries, and support. Users agree not to misuse forms, scrape content, copy brand assets, or interfere with website operations.'],
  ['Orders and Availability','Product availability, package contents, delivery timing, pricing, promotions, and service areas may change. Order requests are not final until confirmed by Capital City Provisions, LLC or an authorized representative.'],
  ['Payments and Promotions','Payments, deposits, discounts, giveaways, and special offers are subject to posted terms, availability, and verification. Promotional language does not guarantee approval, delivery, inventory, or prize eligibility.'],
  ['Partner Operations','Approved suppliers, drivers, vendors, affiliates, contractors, and service providers may support operations. Unless stated in writing, they are not owners, agents, franchises, or legal representatives of Capital City Provisions, LLC.']
];

export default function TermsPage(){return <main className="site page-flow">
  <section className="page-hero"><div><p className="eyebrow">Legal</p><h1>Terms of Service</h1><p className="lead">These terms help customers, suppliers, drivers, and partners understand how Capital City Provisions, LLC presents information, coordinates service, and protects its brand.</p><div className="actions"><a href="/contact">Ask a Question</a><a href="/privacy">Privacy Policy</a></div></div></section>
  <section className="section"><div className="section-heading"><p className="eyebrow">Operating Terms</p><h2>Simple rules for a clear service path.</h2></div><div className="detail-box-grid">{terms.map(([title,text])=><article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section>
  <section className="cta final-cta"><p className="eyebrow">Rights Reserved</p><h2>Capital City Provisions, LLC protects its brand and systems.</h2><p>Website copy, graphics, workflows, route concepts, promotions, and brand assets may not be copied, resold, redistributed, or used without permission.</p></section>
</main>}
