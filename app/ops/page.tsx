export const metadata={title:'AI Ops Hub | Capital City Provisions',description:'Role-based AI hub for customers, drivers, owners, routes, orders, turn-ins, inventory, and reports.'};

const roles=[
  ['Customer Concierge','/customer-concierge','Customer-facing route, box, coupon, and giveaway help.'],
  ['Driver Ops','/driver','Daily route summary, stop notes, delivery memory, and turn-ins.'],
  ['Owner Command Center','/owner','Orders, routes, reports, exports, lead priority, and route learning.'],
  ['Reports','/reports','Daily report, route risk, driver turn-ins, and training notes.']
];

const flow=[
  ['Capture','ZIP checks, box requests, giveaway entries, wholesale leads, and customer notes become structured memory.'],
  ['Reserve','Inventory and route capacity are checked before delivery promises get stronger.'],
  ['Operate','Drivers use route and order memory to complete the day and submit turn-ins.'],
  ['Review','Owners chat with the day, exports, reports, route risk, and follow-up priorities.'],
  ['Learn','Route notes, conversion outcomes, missed stops, and customer preferences improve the next route plan.']
];

const inventory=[
  ['Beef','260 lbs available','Protect steak bundles and family boxes.'],
  ['Chicken','220 lbs available','Good support for mixed family packs.'],
  ['Seafood','70 lbs available','Watch surf and turf promises.'],
  ['Pork','160 lbs available','Useful for rancher and monthly freezer plans.']
];

export default function OpsHubPage(){return <main className="site page-flow">
  <section className="page-hero poster-frame"><div><p className="eyebrow">AI Ops Hub</p><h1>One system for customers, drivers, and owners.</h1><p className="lead">Role-based AI workspaces connected to the same route, order, report, inventory, and turn-in memory.</p><div className="actions"><a href="/owner">Owner Command</a><a href="/driver">Driver Ops</a></div></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions AI ops hub"/></section>
  <section className="section"><p className="eyebrow">Roles</p><h2>Open the right workspace.</h2><div className="route-list">{roles.map(([title,href,copy])=><article key={href}><h3>{title}</h3><p>{copy}</p><a href={href}>Open</a></article>)}</div></section>
  <section className="section"><p className="eyebrow">Learning Loop</p><h2>How the system gets smarter.</h2><div className="route-list">{flow.map(([title,copy])=><article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
  <section className="section"><p className="eyebrow">Inventory Memory</p><h2>Stock awareness stays part of route intelligence.</h2><div className="route-list">{inventory.map(([title,stock,copy])=><article key={title}><h3>{title}</h3><p>{stock}</p><p>{copy}</p></article>)}</div></section>
</main>}
