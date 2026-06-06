import AccessGate from '../../components/AccessGate';
import RoleAIWorkspace from '../../components/RoleAIWorkspace';
import { driverSnapshot } from '../../lib/ops-memory';

export const metadata={title:'Driver Ops | Capital City Provisions',description:'Driver route workspace for assigned stops, delivery status, fulfillment notes, restock issues, fuel efficiency, and daily turn-ins.'};

export default function DriverPage(){
  const memory=driverSnapshot('Marco');
  const stops=memory.routes.flatMap(route=>route.orders.map(order=>({...order,routeName:route.name,day:route.day,window:route.window,priority:route.priority})));
  return <AccessGate role="driver">
    <main className="site page-flow ops-shell">
      <section className="page-hero poster-frame ops-hero">
        <div>
          <p className="eyebrow">Driver route</p>
          <h1>Run the route, update the status, close the day.</h1>
          <p className="lead">Driver access stays focused on assigned stops, delivery notes, fulfillment updates, restock problems, fuel/miles, and turn-ins.</p>
          <div className="actions"><a href="#driver-ai">Ask Driver AI</a><a href="#turn-in-flow">Turn In Day</a></div>
        </div>
        <img src="/images/capital-city-hero.png" alt="Capital City Provisions driver route workflow"/>
      </section>

      <section className="section ops-grid">
        <div className="route-list ops-cards">
          {memory.routes.map(route=><article key={route.id}>
            <p className="eyebrow">Assigned route</p>
            <h3>{route.name}</h3>
            <p>{route.day} - {route.window}</p>
            <strong>{route.reserved}/{route.capacity} grouped</strong>
            <p>{route.priority}</p>
          </article>)}
        </div>
        <aside className="ops-side"><p className="eyebrow">Today</p><h2>{stops.length} stops</h2><p>Use this page after the gate to keep customer details off public pages.</p></aside>
      </section>

      <section className="section">
        <p className="eyebrow">Stops</p>
        <h2>Delivery list for the day.</h2>
        <div className="ops-table"><table><thead><tr><th>Order</th><th>Customer</th><th>Route</th><th>Box</th><th>Status</th><th>Notes</th></tr></thead><tbody>{stops.map(stop=><tr key={stop.id}><td>{stop.id}</td><td>{stop.customer}</td><td>{stop.routeName}</td><td>{stop.box}</td><td>{stop.status}</td><td>{stop.notes}</td></tr>)}</tbody></table></div>
      </section>

      <section className="section" id="turn-in-flow">
        <p className="eyebrow">Driver workflow</p>
        <h2>Update what changed before you leave the route.</h2>
        <div className="route-list ops-cards">
          <article><h3>Status</h3><p>Mark loaded, out for delivery, delivered, partially fulfilled, or issue so the owner view stays current.</p></article>
          <article><h3>Fulfillment</h3><p>Note packed, partial, substituted, or restock-blocked items before the customer follow-up happens.</p></article>
          <article><h3>Fuel and miles</h3><p>Record starting fuel, ending fuel, and route miles so the system can learn which routes are efficient.</p></article>
          <article><h3>Owner follow-up</h3><p>Flag payment needs, missed stops, substitutions, and customer requests before the day is closed.</p></article>
        </div>
      </section>

      <section id="driver-ai">
        <RoleAIWorkspace role="driver" title="Driver Ops" subtitle="Ask about assigned routes, stop order, customer notes, fulfillment issues, restock flags, fuel efficiency, and turn-ins." memory={memory}/>
      </section>
    </main>
  </AccessGate>
}
