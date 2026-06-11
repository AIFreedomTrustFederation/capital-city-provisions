import WebAIContextBridge from '../../components/WebAIContextBridge';

export const metadata={
  title:'CCP Route Helper | Capital City Provisions',
  description:'Capital City Provisions customer route helper for delivery planning, freezer boxes, bonuses, and giveaway separation.'
};

const demoContext={
  route:{route:'Roseville Route',day:'Wednesday',window:'2-6 PM',status:'Confirmed route',capacity:12,reserved:9,slotsRemaining:3,fill:75,zip:'95661'},
  recommendation:{title:'Family Box',detail:'A practical freezer restock for families that want beef, chicken, pork, and flexible portions.',budget:'$500-$750'},
  promo:{code:'CHEESECAKE-48',deadlineHours:48,description:'Free cheesecake with a qualifying first freezer-box order reserved within 48 hours, while supplies last.'},
  giveaway:{entryPath:'/giveaway',purchaseRequired:false,purchaseImprovesOdds:false},
  wholesale:['restaurants','food trucks','caterers','lodges','churches/events']
};

const items=[
  ['Private by design','CCP keeps customer route help focused on delivery, boxes, bonuses, and giveaway clarity.'],
  ['No pressure','Customers can ask questions before submitting details or choosing a package.'],
  ['Rules fallback','If the helper cannot load, CCP still answers with route, box, promo, and giveaway rules.'],
  ['Clean promotions','Cheesecake bonuses and coupon timers are kept separate from no-purchase giveaway entries.'],
  ['Better follow-up','ZIP, route status, budget, family size, and product interest can improve owner-reviewed follow-up.']
];

export default function AiRouteConciergePage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">CCP Route Helper</p><h1>Check your delivery route before you pick a box.</h1><p className="lead">Customers can use CCP for route planning, freezer-box recommendations, wholesale intake, bonus clarity, and giveaway questions.</p><div className="actions"><a href="#local-ai-demo">Try Route Helper</a><a href="/giveaway">Giveaway Flow</a></div></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions route helper"/></section>
  <section className="section" id="local-ai-demo"><WebAIContextBridge role="customer" zip="95661" context={demoContext}/></section>
  <section className="section"><p className="eyebrow">CCP Concierge</p><h2>Helpful guidance without fake scarcity.</h2><div className="route-list">{items.map(([title,copy])=><article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
</main>}