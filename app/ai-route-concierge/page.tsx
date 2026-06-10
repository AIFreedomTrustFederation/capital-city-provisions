import WebAIContextBridge from '../../components/WebAIContextBridge';

export const metadata={
  title:'AI Route Concierge | Capital City Provisions',
  description:'Capital City Provisions local browser AI concierge for ethical customer engagement, route planning, coupons, and giveaway separation.'
};

const demoContext={
  route:{route:'Roseville Route',day:'Wednesday',window:'2-6 PM',status:'Confirmed route',capacity:12,reserved:9,slotsRemaining:3,fill:75,zip:'95661'},
  recommendation:{title:'Family Box',detail:'A practical freezer restock for families that want beef, chicken, pork, and flexible portions.',budget:'$500-$750'},
  promo:{code:'CHEESECAKE-48',deadlineHours:48,description:'Free cheesecake with a qualifying first freezer-box order reserved within 48 hours, while supplies last.'},
  giveaway:{entryPath:'/giveaway',purchaseRequired:false,purchaseImprovesOdds:false},
  wholesale:['restaurants','food trucks','caterers','lodges','churches/events']
};

const items=[
  ['Browser LLM','The customer can start an open-source model that runs in the browser with WebGPU when supported.'],
  ['No API key','The live chat path does not need an OpenAI key or a hosted AI server.'],
  ['Rules fallback','If the model cannot load, the same concierge answers with deterministic route, box, promo, and giveaway rules.'],
  ['Ethical promotions','Cheesecake bonuses and coupon timers are kept separate from no-purchase giveaway entries.'],
  ['Route learning','ZIP, route status, budget, family size, and product interest can improve owner-reviewed follow-up workflows.']
];

export default function AiRouteConciergePage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">AI Route Concierge</p><h1>Open-source AI built into the website.</h1><p className="lead">Customers can use local browser AI for route planning, freezer-box recommendations, wholesale intake, coupon clarity, and giveaway questions.</p><div className="actions"><a href="#local-ai-demo">Try Local AI</a><a href="/giveaway">Giveaway Flow</a></div></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions AI route concierge"/></section>
  <section className="section" id="local-ai-demo"><WebAIContextBridge role="customer" zip="95661" context={demoContext}/></section>
  <section className="section"><p className="eyebrow">System</p><h2>Helpful automation without fake scarcity.</h2><div className="route-list">{items.map(([title,copy])=><article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
</main>}
