import AccessGate from '../../components/AccessGate';
import DriverMobileWorkflow from '../../components/DriverMobileWorkflow';
import RoleAIWorkspace from '../../components/RoleAIWorkspace';
import { fullSystemSnapshot } from '../../lib/ccp-database';

export const metadata={title:'Driver Ops | Capital City Provisions',description:'Driver route workspace for assigned stops, delivery status, fulfillment notes, restock issues, fuel efficiency, and daily turn-ins.'};

function liveDriverMemory(){
  const snapshot=fullSystemSnapshot({mode:'live'});
  const activeOrders=(snapshot.orderLifecycle||[]).filter((order:any)=>!['delivered','cancelled'].includes(order.status));
  const grouped=activeOrders.reduce((map:Record<string,any>,order:any)=>{
    const routeId=order.routeId||'unassigned';
    map[routeId]=map[routeId]||{id:routeId,name:routeId==='unassigned'?'Unassigned Live Route':routeId,day:order.deliveryDate||'TBD',window:order.deliveryWindow||'TBD',capacity:activeOrders.length||0,reserved:0,driver:'Driver',priority:'Live orders only.',orders:[]};
    map[routeId].reserved+=1;
    map[routeId].orders.push({id:order.id,customer:order.customerName,zip:order.zip,routeId:order.routeId,box:order.box,value:order.value,status:order.status,notes:order.notes,phone:order.phone,address:order.address});
    return map;
  },{});
  return {driver:'Driver',routes:Object.values(grouped),database:snapshot.database,ownerReport:snapshot.ownerReport,mode:'live'};
}

export default function DriverPage(){
  const memory=liveDriverMemory();
  const stops=memory.routes.flatMap((route:any)=>route.orders.map((order:any)=>({...order,routeName:route.name,day:route.day,window:route.window,priority:route.priority})));
  return <AccessGate role="driver">
    <main className="site page-flow ops-shell">
      <section className="page-hero poster-frame ops-hero">
        <div>
          <p className="eyebrow">Driver route</p>
          <h1>Run the route, update the status, close the day.</h1>
          <p className="lead">Driver access stays focused on assigned live stops, delivery notes, fulfillment updates, restock problems, fuel/miles, and turn-ins.</p>
          <div className="actions"><a href="#mobile-route">Work Stops</a><a className="mobile-sales-entry" href="/driver-sales">Sales Route Mode</a><a href="#turn-in-mobile">Turn In Day</a><a href="#driver-ai">Ask Driver AI</a></div>
        </div>
        <img src="/images/capital-city-hero.png" alt="Capital City Provisions driver route workflow"/>
      </section>

      <section className="section ops-grid">
        <div className="route-list ops-cards">
          {memory.routes.length?memory.routes.map((route:any)=><article key={route.id}>
            <p className="eyebrow">Assigned live route</p>
            <h3>{route.name}</h3>
            <p>{route.day} - {route.window}</p>
            <strong>{route.reserved}/{route.capacity} grouped</strong>
            <p>{route.priority}</p>
          </article>):<article><p className="eyebrow">Assigned live route</p><h3>No live stops yet.</h3><p>Real driver routes appear here after live orders are created and scheduled.</p></article>}
        </div>
        <aside className="ops-side"><p className="eyebrow">Today</p><h2>{stops.length} stops</h2><p>Use the mobile stop cards first, then open Sales Route Mode from your phone when a delivery creates a new box or wholesale opportunity.</p><a className="ops-button mobile-sales-entry" href="/driver-sales">Open Sales Route Mode</a></aside>
      </section>

      <DriverMobileWorkflow memory={memory}/>

      <section className="section desktop-stop-table">
        <p className="eyebrow">Stops</p>
        <h2>Delivery list for review.</h2>
        {stops.length?<div className="ops-table"><table><thead><tr><th>Order</th><th>Customer</th><th>Route</th><th>Box</th><th>Status</th><th>Notes</th></tr></thead><tbody>{stops.map((stop:any)=><tr key={stop.id}><td>{stop.id}</td><td>{stop.customer}</td><td>{stop.routeName}</td><td>{stop.box}</td><td>{stop.status}</td><td>{stop.notes}</td></tr>)}</tbody></table></div>:<article className="marble"><h3>No live stops yet.</h3><p>This page will stay empty until real orders are assigned to a route.</p></article>}
      </section>

      <section id="driver-ai">
        <RoleAIWorkspace role="driver" title="Driver Ops" subtitle="Ask about assigned live routes, stop order, customer notes, fulfillment issues, restock flags, fuel efficiency, and turn-ins." memory={memory}/>
      </section>
      <style>{`@media(min-width:781px){.mobile-sales-entry{display:none!important}}`}</style>
    </main>
  </AccessGate>
}
