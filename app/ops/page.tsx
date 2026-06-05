const routes=[
 {name:'Fair Oaks / Carmichael',day:'Tuesday',orders:6,target:10,revenue:2400,miles:28,stock:'Ready'},
 {name:'Roseville',day:'Wednesday',orders:11,target:10,revenue:5100,miles:42,stock:'Ready'},
 {name:'Rocklin / Lincoln',day:'Thursday',orders:8,target:10,revenue:3900,miles:46,stock:'Restock Monday'},
 {name:'Folsom / Orangevale',day:'Friday',orders:4,target:10,revenue:1700,miles:36,stock:'Build route'}
];
function fill(r:any){return Math.round((r.orders/r.target)*100)}
function score(r:any){return Math.round(fill(r)+r.revenue/100-r.miles)}
function status(r:any){const f=fill(r);if(f>=100&&r.stock==='Ready')return 'Confirmed: next route';if(f>=80)return 'Almost full: likely this week';return 'Collecting orders: push to next profitable route'}
function eta(r:any){const f=fill(r);if(f>=100&&r.stock==='Ready')return `${r.day} ${r.window||'route window'}`;if(f>=80)return '3-5 days after restock confirmation';return '5-10 days, or sooner if nearby orders fill the route'}
const ranked=[...routes].sort((a,b)=>score(b)-score(a));
const next=ranked[0];

export default function Ops(){return <main className="site"><section className="section"><p className="eyebrow">Operations</p><h1>Daily Route Planner</h1><p className="lead">Customer delivery promises are based on route fill, stock readiness, revenue, and drive burden. The fullest profitable route runs first.</p><div className="grid"><article><h3>Next Route</h3><p>{next.name}</p><p>{status(next)}</p></article><article><h3>Route Score</h3><p>{score(next)}</p></article><article><h3>Customer ETA</h3><p>{eta(next)}</p></article></div></section><section className="section"><p className="eyebrow">Route Priority</p><h2>Run full routes. Push underfilled routes.</h2><div className="grid">{ranked.map(r=>{return <article key={r.name} className="marble"><h3>{r.name}</h3><p>{r.day}</p><p>{r.orders}/{r.target} orders • {fill(r)}% full</p><p>${r.revenue.toLocaleString()} estimated revenue • {r.miles} miles</p><p>Inventory: {r.stock}</p><p>Status: {status(r)}</p><strong>ETA: {eta(r)}</strong></article>})}</div></section><section className="cta poster-frame"><p className="eyebrow">Customer Promise Logic</p><h2>Schedule only when profitable and stocked.</h2><p>Confirmed routes are full and stocked. Almost-full routes can be tentatively scheduled. Underfilled routes should be pushed out while the system keeps collecting nearby orders.</p></section></main>}