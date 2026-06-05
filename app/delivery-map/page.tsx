const zones=[
 {name:'Fair Oaks / Carmichael',day:'Tuesday',fill:'70%',status:'Collecting nearby orders',eta:'5-10 days'},
 {name:'Roseville',day:'Wednesday',fill:'100%',status:'Confirmed route',eta:'This week'},
 {name:'Rocklin / Lincoln',day:'Thursday',fill:'80%',status:'Almost full',eta:'3-5 days'},
 {name:'Folsom / Orangevale',day:'Friday',fill:'45%',status:'Building route',eta:'7-10 days'}
];
export default function DeliveryMap(){return <main className="site"><section className="section"><p className="eyebrow">Customer Route Map</p><h1>Delivery Areas</h1><p className="lead">See which delivery routes are confirmed, almost full, or still collecting nearby orders. Routes run when inventory and truck fill support profitable delivery.</p></section><section className="section"><p className="eyebrow">Route Status</p><h2>Customer delivery promise.</h2><div className="grid">{zones.map(z=><article key={z.name} className="marble"><h3>{z.name}</h3><p>{z.day}</p><p>Route fill: {z.fill}</p><p>{z.status}</p><strong>ETA: {z.eta}</strong></article>)}</div></section></main>}