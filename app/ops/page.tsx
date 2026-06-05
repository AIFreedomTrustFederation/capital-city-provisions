const truckCapacity=400;
const minimumDispatchPounds=300;
const inventory:any={beef:260,chicken:220,seafood:70,pork:160};
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
function routeReservation(r:any){const need=boxNeeds[r.box]||{};const out:any={};Object.entries(need).forEach(([k,v]:any)=>out[k]=v*r.orders);return out}
function totalReserved(){const out:any={beef:0,chicken:0,seafood:0,pork:0};routes.forEach(r=>{const res=routeReservation(r);Object.entries(res).forEach(([k,v]:any)=>out[k]+=v)});return out}
function remainingStock(){const reserved=totalReserved();const out:any={};Object.keys(inventory).forEach(k=>out[k]=inventory[k]-(reserved[k]||0));return out}
function orderFill(r:any){return Math.round((r.orders/r.target)*100)}
function weightFill(r:any){return Math.round((r.pounds/truckCapacity)*100)}
function poundsNeeded(r:any){return Math.max(0,minimumDispatchPounds-r.pounds)}
function inventoryStatus(r:any){const need=routeReservation(r);const shortages=Object.entries(need).filter(([k,v]:any)=>inventory[k]<v);if(shortages.length===0)return 'Reserved inventory ready';return 'Restock first: '+shortages.map(([k]:any)=>k).join(', ')}
function inventoryReady(r:any){return inventoryStatus(r)==='Reserved inventory ready'}
function score(r:any){return Math.round(orderFill(r)+weightFill(r)+r.revenue/100-r.miles+(inventoryReady(r)?20:-40))}
function status(r:any){if(r.pounds>=minimumDispatchPounds&&inventoryReady(r))return 'Dispatch ready';if(r.pounds>=minimumDispatchPounds)return 'Capacity ready, waiting on inventory';if(orderFill(r)>=80)return 'Almost full, collect more pounds';return 'Push out and keep selling this route'}
function eta(r:any){if(r.pounds>=minimumDispatchPounds&&inventoryReady(r))return `${r.day} confirmed`;if(!inventoryReady(r))return inventoryStatus(r);return `Needs ${poundsNeeded(r)} more lbs before dispatch`}
const reserved=totalReserved();
const remaining=remainingStock();
const ranked=[...routes].sort((a,b)=>score(b)-score(a));
const next=ranked[0];

export default function Ops(){return <main className="site"><section className="section"><p className="eyebrow">Operations</p><h1>Inventory Reservation Engine</h1><p className="lead">Routes now reserve projected inventory before dispatch. The system protects stock, route fill, delivery promises, and customer trust.</p><div className="grid"><article><h3>Next Route</h3><p>{next.name}</p><p>{status(next)}</p></article><article><h3>Truck Fill</h3><p>{next.pounds}/{truckCapacity} lbs • {weightFill(next)}%</p></article><article><h3>Inventory</h3><p>{inventoryStatus(next)}</p></article></div></section><section className="section"><p className="eyebrow">Inventory</p><h2>Available, reserved, and remaining stock.</h2><div className="grid">{Object.keys(inventory).map(k=><article key={k}><h3>{k}</h3><p>{inventory[k]} lbs available</p><p>{reserved[k]||0} lbs reserved</p><strong>{remaining[k]} lbs remaining</strong></article>)}</div></section><section className="section"><p className="eyebrow">Route Priority</p><h2>Run full and stocked routes. Push underfilled or understocked routes.</h2><div className="grid">{ranked.map(r=>{const res=routeReservation(r);return <article key={r.name} className="marble"><h3>{r.name}</h3><p>{r.day} • {r.box}</p><p>{r.orders}/{r.target} orders • {orderFill(r)}% order fill</p><p>{r.pounds}/{truckCapacity} lbs • {weightFill(r)}% truck fill</p><p>Need {poundsNeeded(r)} more lbs to dispatch minimum</p><p>${r.revenue.toLocaleString()} estimated revenue • {r.miles} miles</p><p>Reserved: {Object.entries(res).map(([k,v])=>`${k} ${v} lbs`).join(' • ')}</p><p>{inventoryStatus(r)}</p><p>Status: {status(r)}</p><strong>ETA: {eta(r)}</strong></article>})}</div></section><section className="section"><p className="eyebrow">Customer Route Status</p><h2>Transparent delivery promises.</h2><div className="grid">{routes.map(r=><article key={r.name}><h3>{r.name}</h3><p>{status(r)}</p><p>Route fill: {weightFill(r)}%</p><p>Inventory: {inventoryStatus(r)}</p><p>Promise: {eta(r)}</p></article>)}</div></section><section className="cta poster-frame"><p className="eyebrow">Dispatch Rule</p><h2>Reserve inventory before promising delivery.</h2><p>Every customer box should reserve expected product weight first. If remaining inventory goes negative or route capacity is underfilled, the route is pushed out until stock and profit both support delivery.</p></section></main>}