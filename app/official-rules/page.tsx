export const metadata={
  title:'Official Rules | Capital City Provisions Freezer Giveaway',
  description:'Official rules for the Capital City Provisions freezer giveaway. No purchase necessary.'
};

const rules=[
  ['Sponsor','Capital City Provisions, LLC is the sponsor of this promotion.'],
  ['No Purchase Necessary','No purchase or payment is necessary to enter or win. A purchase does not increase the chances of winning.'],
  ['Eligibility','Open to legal residents in the Capital City Provisions service area who are 18 years of age or older at the time of entry. Void where prohibited.'],
  ['Entry Period','The giveaway begins June 6, 2026 and ends July 31, 2026 at 11:59 PM Pacific Time.'],
  ['How To Enter','Submit the free entry form on the giveaway page with your name, email, phone if desired, and delivery ZIP code. Limit one entry per person and household unless the sponsor publishes a different entry limit.'],
  ['Prize','One selected entrant will receive a freezer-stocking meat prize from Capital City Provisions with an approximate retail value up to $1,000. Prize contents depend on availability, delivery route access, and lawful delivery requirements. No cash substitution except at sponsor discretion.'],
  ['Winner Selection','Winner will be selected by random drawing from eligible entries after the entry period closes. Odds of winning depend on the number of eligible entries received.'],
  ['Winner Contact','The potential winner will be contacted using the information submitted. If the potential winner cannot be reached, is ineligible, or does not respond within the stated response window, sponsor may select an alternate winner.'],
  ['Delivery','Prize delivery is limited to areas where Capital City Provisions can reasonably and lawfully deliver. Sponsor may arrange pickup or substitute comparable value if delivery cannot be completed.'],
  ['Privacy','Entry information may be used to administer the giveaway and to contact entrants about Capital City Provisions offers. Entrants can request removal from marketing follow-up.'],
  ['Order Bonuses','Cheesecake thank-you gifts, coupons, route bonuses, or purchase incentives are separate promotional offers. They are not required for giveaway entry and do not improve giveaway odds.'],
  ['Platform Disclaimer','This promotion is not sponsored, endorsed, administered by, or associated with Vercel, GitHub, Meta, Google, or any other platform where it may be advertised.']
];

export default function OfficialRulesPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">Official Rules</p><h1>Capital City Provisions freezer giveaway.</h1><p className="lead">No purchase necessary. Purchase does not improve odds. Please review the rules before entering.</p><div className="actions"><a href="/giveaway">Enter Giveaway</a><a href="/contact">Contact Us</a></div></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions official rules"/></section>
  <section className="section"><p className="eyebrow">Rules</p><h2>Freezer giveaway terms.</h2><div className="route-list">{rules.map(([title,copy])=><article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
</main>}
