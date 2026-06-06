export const metadata={
  title:'AI Route Concierge | Capital City Provisions',
  description:'Capital City Provisions route concierge system for ethical customer engagement, route planning, coupons, and giveaway separation.'
};

const items=[
  ['Self-hosted model ready','The site can call an OpenAI-compatible open-source model through a private endpoint when AI_CONCIERGE_URL is configured.'],
  ['Rules fallback','If the model is offline, route recommendations still work with deterministic business rules.'],
  ['Ethical promotions','Cheesecake bonuses and coupon timers are kept separate from no-purchase giveaway entries.'],
  ['Route learning','ZIP, route status, budget, family size, and product interest can train better follow-up workflows after owner review.']
];

export default function AiRouteConciergePage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">AI Route Concierge</p><h1>Open-source AI support for route planning and customer engagement.</h1><p className="lead">A production-safe concierge layer that can use a self-hosted model, while keeping the site working with rules-based recommendations.</p><div className="actions"><a href="/giveaway">Giveaway Flow</a><a href="/how-delivery-works">Delivery Flow</a></div></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions AI route concierge"/></section>
  <section className="section"><p className="eyebrow">System</p><h2>Helpful automation without fake scarcity.</h2><div className="route-list">{items.map(([title,copy])=><article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
</main>}
