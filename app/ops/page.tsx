const truckCapacity=400;
const minimumDispatchPounds=300;
const inventory={beef:260,chicken:220,seafood:70,pork:160};
const boxNeeds:any={
 'Family Freezer Box':{beef:15,chicken:15,pork:10},
 'Steak Lovers Club':{beef:30},
 'Surf & Turf Club':{beef:20,seafood:15},
 'Wholesale Account':{beef:60,chicken:40,pork:30},
 'Custom Restock':{beef:15,chicken:10,seafood:5,pork:10}
};
const routes=[
 {name:'Fair Oaks / Carmichael',day:'Tuesday',orders:6,target:10,revenue:2400,miles:28,pounds:210,box:'Family Freezer Box'},
 {name:'Roseville',day:'Wednesday',orders:11,target:10,revenue:5100,miles:42,pounds:430,box:'Steak Lovers Club'},
 {name:'Rocklin / Lincoln',day:'Thursday',orders:8,target:10,revenue:3900,miles:46,pounds:320,box:'Surf & Turf Club'},
 {name:'Folsom / Orangevale',day:'Friday',orders:4,target:10,revenue:1700,miles:36,pounds:145,box:'Custom Restock'}
];
function orderFill(r:any){return Math.round((r.orders/r.target)*100)}
function weightFill(r:any){return Math.round((r.pounds/truckCapacity)*100)}
function poundsNeeded(r:any){return Math.max(0,minimumDispatchPounds-r.pounds)}
function inventoryStatus(r:any){const need=boxNeeds[r.box]||{};const shortages=Object.entries(need).filter(([k,v]:any)=>inventory[k]<(v*r.orders));if(shortages.length===0)return 'Inventory ready';return 'Restock first: '+shortages.map(([k]:any)=>k).join(', ')}
function inventoryReady(r:any){return inventoryStatus(r)==='Inventory ready'}
function score(r:any){return Math.round(orderFill(r)+weightFill(r)+r.revenue/100-r.miles+(inventoryReady(r)?20:-40))}
function status(r:any){if(r.pounds>=minimumDispatchPounds&&inventoryReady(r))return 'Dispatch ready';if(r.pounds>=minimumDispatchPounds)return 'Capacity ready, waiting on inventory';if(orderFill(r)>=80)return 'Almost full, collect more pounds';return 'Push out and keep selling this route'}
function eta(r:any){if(r.pounds>=minimumDispatchPounds&&inventoryReady(r))return `${r.day} confirmed`;if(!inventoryReady(r))return inventoryStatus(r);return `Needs ${poundsNeeded(r)} more lbs before dispatch`}
const ranked=[...routes].sort((a,b)=>score(b)-score(a));
const next=ranked[0];

export default function Ops(){return <main className="site"><section className="section"><p className="eyebrow">Operations</p><h1>Inventory-Aware Dispatch</h1><p className="lead">Routes are prioritized by orders, pounds committed, truck capacity, stock readiness, revenue, and drive burden. The fullest stocked route runs first.</p><div className="grid"><article><h3>Next Route</h3><p>{next.name}</p><p>{status(next)}</p></article><article><h3>Truck Fill</h3><p>{next.pounds}/{truckCapacity} lbs • {weightFill(next)}%</p></article><article><h3>Inventory</h3><p>{inventoryStatus(next)}</p></article></div></section><section className="section"><p className="eyebrow">Inventory</p><h2>Stock controls the route promise.</h2><div className="grid">{Object.entries(inventory).map(([k,v])=><article key={k}><h3>{k}</h3><p>{v} lbs available</p></article>)}</div></section><section className="section"><p className="eyebrow">Route Priority</p><h2>Run full and stocked routes. Push underfilled or understocked routes.</h2><div className="grid">{ranked.map(r=>{return <article key={r.name} className="marble"><h3>{r.name}</h3><p>{r.day} • {r.box}</p><p>{r.orders}/{r.target} orders • {orderFill(r)}% order fill</p><p>{r.pounds}/{truckCapacity} lbs • {weightFill(r)}% truck fill</p><p>Need {poundsNeeded(r)} more lbs to dispatch minimum</p><p>${r.revenue.toLocaleString()} estimated revenue • {r.miles} miles</p><p>{inventoryStatus(r)}</p><p>Status: {status(r)}</p><strong>ETA: {eta(r)}</strong></article>})}</div></section><section className="section"><p className="eyebrow">Weekly Dispatch Plan</p><h2>Profit-first calendar.</h2><div className="grid">{routes.map(r=><article key={r.day}><h3>{r.day}</h3><p>{r.name}</p><p>{status(r)}</p><p>{eta(r)}</p></article>)}</div></section><section className="cta poster-frame"><p className="eyebrow">Dispatch Rule</p><h2>Never promise what inventory cannot fulfill.</h2><p>If the route is not stocked and above the minimum dispatch weight, the system should restock first, push the date out, keep collecting orders, and run the most filled profitable stocked route first.</p></section></main>}