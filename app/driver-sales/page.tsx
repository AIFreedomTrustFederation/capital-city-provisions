import AccessGate from '../../components/AccessGate';
import DriverSalesRouteMode from '../../components/DriverSalesRouteMode';
import { fullSystemSnapshot } from '../../lib/ccp-database';

export const metadata={title:'Driver Sales Route | Capital City Provisions',description:'Mobile-only protected driver sales-route mode for delivery stops, on-site selling, queued route opportunities, and AI-assisted customer scripts.'};

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

export default function DriverSalesPage(){
  const memory=liveDriverMemory();
  return <AccessGate role="driver">
    <main className="site page-flow ops-shell driver-sales-page">
      <section className="page-hero poster-frame ops-hero sales-mobile-hero">
        <div>
          <p className="eyebrow">Mobile driver sales mode</p>
          <h1>Delivery board meets field sales queue.</h1>
          <p className="lead">Built for phones in the field: complete live stops, capture nearby demand, reserve the next freezer box, and feed smarter route growth back to the team.</p>
          <div className="actions"><a href="#sales-route-mode">Open Sales Route</a><a href="/driver">Back To Driver Ops</a></div>
        </div>
        <img src="/images/capital-city-hero.png" alt="Capital City Provisions sales route mode"/>
      </section>
      <section className="section sales-desktop-lock poster-frame">
        <div>
          <p className="eyebrow">Phone-only tool</p>
          <h1>Open Sales Route Mode on a driver phone.</h1>
          <p className="lead">This workflow is intentionally mobile-only because it is made for active live deliveries, quick route decisions, navigation, and one-handed sale queueing in the field.</p>
          <div className="actions"><a href="/driver">Back To Driver Ops</a></div>
        </div>
      </section>
      <DriverSalesRouteMode memory={memory}/>
      <style>{`@media(min-width:781px){.sales-mobile-hero,.sales-route-mode{display:none!important}}@media(max-width:780px){.sales-desktop-lock{display:none!important}}`}</style>
    </main>
  </AccessGate>
}
