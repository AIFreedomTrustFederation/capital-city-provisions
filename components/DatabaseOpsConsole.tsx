'use client';
import {useMemo,useState} from 'react';
import LocalAIConcierge from './LocalAIConcierge';

type Props={snapshot:Record<string,any>};

function money(value:number){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value||0)}

export default function DatabaseOpsConsole({snapshot}:Props){
  const [orders,setOrders]=useState<any[]>(snapshot.orderLifecycle||[]);
  const [report,setReport]=useState<any>(snapshot.ownerReport||{});
  const [update,setUpdate]=useState({orderId:orders[0]?.id||'CCP-1007',routeId:orders[0]?.routeId||'roseville',driver:'Marco',status:'out-for-delivery',fulfillment:'pending',partialReason:'',restockIssue:'',substitutions:'',customerNotes:'',fuelStart:'18',fuelEnd:'14',milesDriven:'42'});
  const [notice,setNotice]=useState('');
  const aiContext=useMemo(()=>({role:'owner',database:{orders,report,learning:snapshot.trainingDataset},permissions:{owner:['orders','driver updates','restock','profit loss','route efficiency','training dataset']}}),[orders,report,snapshot.trainingDataset]);

  async function submitUpdate(e:React.FormEvent){
    e.preventDefault();
    setNotice('Saving driver update...');
    const response=await fetch('/api/db/driver-update',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(update)});
    const result=await response.json();
    if(result.ok){
      setOrders(current=>current.map(order=>order.id===result.lifecycle.id?result.lifecycle:order));
      setNotice(`Updated ${result.update.orderId}: ${result.update.status}, ${result.update.fulfillment}, efficiency ${result.update.routeEfficiency}.`);
      refreshReport();
    }else setNotice('Driver update failed.');
  }

  async function refreshReport(){
    const response=await fetch('/api/db/reports?training=1');
    const result=await response.json();
    if(result.ok&&result.report)setReport(result.report);
  }

  return <main className="site page-flow db-console">
    <section className="page-hero poster-frame"><div><p className="eyebrow">System Database</p><h1>Order lifecycle command center.</h1><p className="lead">Track each order from first customer input through delivery, partial fulfillment, restock issues, driver notes, fuel efficiency, owner reports, and AI learning records.</p><div className="actions"><a href="#driver-update">Update Delivery</a><a href="#owner-report">Owner Report</a></div></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions database system"/></section>
    <section className="section ops-grid"><div><LocalAIConcierge context={aiContext}/></div><aside className="ops-side"><p className="eyebrow">Owner Report</p><h2>{report.date}</h2><div className="metric-list"><span>Revenue <b>{money(report.revenue)}</b></span><span>Cost <b>{money(report.estimatedCost)}</b></span><span>Profit <b>{money(report.estimatedProfit)}</b></span><span>Margin <b>{report.margin}%</b></span><span>Restock Issues <b>{report.restockIssues}</b></span></div></aside></section>
    <section className="section"><p className="eyebrow">Order Lifecycle</p><h2>Customer input to delivered.</h2><div className="ops-table"><table><thead><tr><th>Order</th><th>Customer</th><th>Route</th><th>Status</th><th>Fulfillment</th><th>Delivery</th><th>Margin</th><th>Issues</th></tr></thead><tbody>{orders.map(order=><tr key={order.id}><td>{order.id}</td><td>{order.customerName}</td><td>{order.routeId}</td><td>{order.status}</td><td>{order.fulfillment}</td><td>{order.deliveryDate} {order.deliveryWindow}</td><td>{money(order.marginEstimate)}</td><td>{(order.restockIssues||[]).length}</td></tr>)}</tbody></table></div></section>
    <section className="section" id="driver-update"><p className="eyebrow">Driver Update</p><h2>Delivery, fulfillment, restock, and fuel notes.</h2><form onSubmit={submitUpdate} className="db-form marble"><select value={update.orderId} onChange={e=>{const order=orders.find(o=>o.id===e.target.value);setUpdate({...update,orderId:e.target.value,routeId:order?.routeId||update.routeId})}}>{orders.map(order=><option key={order.id} value={order.id}>{order.id} - {order.customerName}</option>)}</select><input value={update.driver} onChange={e=>setUpdate({...update,driver:e.target.value})} placeholder="Driver"/><select value={update.status} onChange={e=>setUpdate({...update,status:e.target.value})}><option>out-for-delivery</option><option>delivered</option><option>partially-fulfilled</option><option>issue</option><option>restock-needed</option></select><select value={update.fulfillment} onChange={e=>setUpdate({...update,fulfillment:e.target.value})}><option>pending</option><option>packed</option><option>fulfilled</option><option>partial</option><option>restock-blocked</option><option>substituted</option></select><input value={update.fuelStart} onChange={e=>setUpdate({...update,fuelStart:e.target.value})} placeholder="Fuel start gallons"/><input value={update.fuelEnd} onChange={e=>setUpdate({...update,fuelEnd:e.target.value})} placeholder="Fuel end gallons"/><input value={update.milesDriven} onChange={e=>setUpdate({...update,milesDriven:e.target.value})} placeholder="Miles driven"/><input value={update.restockIssue} onChange={e=>setUpdate({...update,restockIssue:e.target.value})} placeholder="Restock issue"/><textarea value={update.partialReason} onChange={e=>setUpdate({...update,partialReason:e.target.value})} placeholder="Partial fulfillment reason"/><textarea value={update.substitutions} onChange={e=>setUpdate({...update,substitutions:e.target.value})} placeholder="Substitutions"/><textarea value={update.customerNotes} onChange={e=>setUpdate({...update,customerNotes:e.target.value})} placeholder="Customer or delivery notes"/><button type="submit">Save Driver Update</button></form>{notice&&<p>{notice}</p>}</section>
    <section className="section" id="owner-report"><p className="eyebrow">Owner Report</p><h2>Profit, loss, restock, and next action.</h2><div className="route-list ops-cards"><article><h3>Owner Actions</h3>{(report.ownerActions||[]).map((item:string)=><p key={item}>{item}</p>)}</article><article><h3>Future Restock</h3>{(report.futureRestock||[]).map((item:any)=><p key={`${item.product}-${item.reason}`}><strong>{item.product}:</strong> {item.needed} needed. {item.reason}</p>)}</article><article><h3>AI Learning Notes</h3>{(report.learningNotes||[]).map((item:string)=><p key={item}>{item}</p>)}</article></div></section>
    <section className="section"><p className="eyebrow">Route Efficiency</p><h2>Fuel-aware delivery intelligence.</h2><div className="route-list ops-cards">{(report.routeEfficiency||[]).map((route:any)=><article key={route.routeId}><h3>{route.route}</h3><p>Efficiency: {route.efficiency}</p><p>Miles: {route.milesDriven}</p><p>Fuel used: {route.fuelUsed}</p><strong>Estimated route profit: {money(route.profit)}</strong></article>)}</div></section>
    <style>{`.ops-grid{display:grid;grid-template-columns:1fr 320px;gap:20px}.ops-side{border:1px solid rgba(255,200,87,.5);border-radius:22px;padding:20px;background:#080605;height:max-content}.metric-list{display:grid;gap:10px}.metric-list span{display:flex;justify-content:space-between;border-bottom:1px solid #b8892d55;padding-bottom:8px;color:#ded2bd}.metric-list b{color:#f8e7b0}.ops-table{overflow:auto;border:1px solid #b8892d66;border-radius:18px}.ops-table table{width:100%;border-collapse:collapse;min-width:900px;background:#050403}.ops-table th,.ops-table td{border-bottom:1px solid #b8892d44;padding:12px;text-align:left}.ops-table th{color:#f8e7b0}.db-form{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.db-form input,.db-form textarea,.db-form select{min-width:0;border:1px solid #b8892d;background:#050403;color:#fff7ed;border-radius:18px;padding:12px;font:inherit}.db-form textarea{grid-column:span 3;min-height:92px}.db-form button{grid-column:1/-1;border:1px solid #f8e7b0;background:linear-gradient(135deg,#facc15,#a16207);color:#160b04;border-radius:999px;padding:13px 16px;font-weight:900}@media(max-width:900px){.ops-grid,.db-form{grid-template-columns:1fr}.db-form textarea{grid-column:auto}}`}</style>
  </main>
}
