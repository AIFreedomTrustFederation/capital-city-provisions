const truckCapacity=400;
const minimumDispatchPounds=300;
const routes=[
 {name:'Fair Oaks / Carmichael',day:'Tuesday',orders:6,target:10,revenue:2400,miles:28,stock:'Ready',pounds:210},
 {name:'Roseville',day:'Wednesday',orders:11,target:10,revenue:5100,miles:42,stock:'Ready',pounds:430},
 {name:'Rocklin / Lincoln',day:'Thursday',orders:8,target:10,revenue:3900,miles:46,stock:'Restock Monday',pounds:320},
 {name:'Folsom / Orangevale',day:'Friday',orders:4,target:10,revenue:1700,miles:36,stock:'Build route',pounds:145}
];
function orderFill(r:any){return Math.round((r.orders/r.target)*100)}
function weightFill(r:any){return Math.round((r.pounds/truckCapacity)*100)}
function poundsNeeded(r:any){return Math.max(0,minimumDispatchPounds-r.pounds)}
function score(r:any){return Math.round(orderFill(r)+weightFill(r)+r.revenue/100-r.miles)}
function status(r:any){if(r.pounds>=minimumDispatchPounds&&r.stock==='Ready')return 'Dispatch ready';if(r.pounds>=minimumDispatchPounds)return 'Capacity ready, waiting on restock';if(orderFill(r)>=80)return 'Almost full, collect more pounds';return 'Push out and keep selling this route'}
function eta(r:any){if(r.pounds>=minimumDispatchPounds&&r.stock==='Ready')return `${r.day} confirmed`;if(r.pounds>=minimumDispatchPounds)return `After ${r.stock.toLowerCase()}`;return `Needs ${poundsNeeded(r)} more lbs before dispatch`}
const ranked=[...routes].sort((a,b)=>score(b)-score(a));
const next=ranked[0];

export default function Ops(){return <main className="site"><section className="section"><p className="eyebrow">Operations</p><h1>Daily Route Planner</h1><p className="lead">Routes are prioritized by orders, pounds committed, truck capacity, stock readiness, revenue, and drive burden. The fullest stocked route runs first.</p><div className="grid"><article><h3>Next Route</h3><p>{next.name}</p><p>{status(next)}</p></article><article><h3>Truck Fill</h3><p>{next.pounds}/{truckCapacity} lbs • {weightFill(next)}%</p></article><article><h3>Customer ETA</h3><p>{eta(next)}</p></article></div></section><section className="section"><p className="eyebrow">Route Priority</p><h2>Run full and stocked routes. Push underfilled routes.</h2><div className="grid">{ranked.map(r=>{return <article key={r.name} className="marble"><h3>{r.name}</h3><p>{r.day}</p><p>{r.orders}/{r.target} orders • {orderFill(r)}% order fill</p><p>{r.pounds}/{truckCapacity} lbs • {weightFill(r)}% truck fill</p><p>Need {poundsNeeded(r)} more lbs to dispatch minimum</p><p>${r.revenue.toLocaleString()} estimated revenue • {r.miles} miles</p><p>Inventory: {r.stock}</p><p>Status: {status(r)}</p><strong>ETA: {eta(r)}</strong></article>})}</div></section><section className="section"><p className="eyebrow">Weekly Dispatch Plan</p><h2>Profit-first calendar.</h2><div className="grid">{routes.map(r=><article key={r.day}><h3>{r.day}</h3><p>{r.name}</p><p>{status(r)}</p><p>{eta(r)}</p></article>)}</div></section><section className="cta poster-frame"><p className="eyebrow">Dispatch Rule</p><h2>Never burn fuel for an underfilled route.</h2><p>If the route is not stocked and above the minimum dispatch weight, the system should push the date out, keep collecting orders, and run the most filled profitable route first.</p></section></main>}