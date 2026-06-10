'use client';
import {useMemo,useState} from 'react';

type Props={snapshot:Record<string,any>};
type Filter='all'|'hot'|'wholesale'|'waitlist'|'restock';
type SalesFilter='all'|'queued'|'pitched'|'reserved'|'skipped';

function money(value:number){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value||0)}
function downloadFile(name:string,type:string,content:string){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=name;link.click();URL.revokeObjectURL(url)}
function csvEscape(value:any){return `"${String(value??'').replace(/"/g,'""')}"`}
function csvExport(rows:any[]){const headers=['id','customerName','phone','zip','routeId','box','status','fulfillment','value','deliveryDate','deliveryWindow','notes','priority'];const lines=[headers.join(','),...rows.map(row=>headers.map(header=>csvEscape(row[header])).join(','))];downloadFile('ccp-owner-leads-orders.csv','text/csv',lines.join('\n')+'\n')}
function salesCsvExport(rows:any[]){const headers=['id','driver','leadName','phone','email','address','zip','area','need','offer','estimatedValue','status','sourceStopId','ownerOverride','aiInstruction','driverRoutePlan','note'];const lines=[headers.join(','),...rows.map(row=>headers.map(header=>csvEscape(row[header])).join(','))];downloadFile('ccp-driver-sales-queue.csv','text/csv',lines.join('\n')+'\n')}
function routeName(routeId:string,routes:any[]){return routes.find(route=>route.id===routeId)?.name||routeId||'Unassigned'}
function normalizeOrders(snapshot:Record<string,any>){return (snapshot.orderLifecycle||snapshot.orders||[]).map((order:any)=>({...order,priority:priorityFor(order),routeName:routeName(order.routeId,snapshot.routes||[])}))}
function priorityFor(order:any){const text=`${order.box||''} ${order.notes||''} ${order.status||''} ${order.fulfillment||''}`.toLowerCase();if(text.includes('wholesale'))return 'wholesale';if(text.includes('restock')||text.includes('partial')||text.includes('issue'))return 'restock';if(text.includes('waitlist')||text.includes('quoted'))return 'waitlist';if(Number(order.value||0)>=700)return 'hot';return 'normal'}
function filterOrders(orders:any[],filter:Filter){if(filter==='all')return orders;if(filter==='hot')return orders.filter(order=>order.priority==='hot'||Number(order.value||0)>=700);if(filter==='wholesale')return orders.filter(order=>order.priority==='wholesale');if(filter==='waitlist')return orders.filter(order=>order.priority==='waitlist'||order.status==='quoted');if(filter==='restock')return orders.filter(order=>order.priority==='restock'||order.fulfillment==='partial'||order.fulfillment==='restock-blocked');return orders}

export default function OwnerLeadDashboard({snapshot}:Props){
  const [filter,setFilter]=useState<Filter>('all');
  const [salesFilter,setSalesFilter]=useState<SalesFilter>('all');
  const [overrideDraft,setOverrideDraft]=useState('Go out of route only when a real customer confirms a real box or wholesale account. Confirm timing before locking it.');
  const [aiInstruction,setAiInstruction]=useState('Hook this live lead into the closest route plan, prioritize dense ZIPs, and surface any restock risk before promising premium cuts.');
  const [salesNotice,setSalesNotice]=useState('');
  const active=snapshot;
  const orders=useMemo(()=>normalizeOrders(active),[active]);
  const visible=useMemo(()=>filterOrders(orders,filter),[orders,filter]);
  const report=active.ownerReport||{};
  const routes=active.routes||[];
  const counts={all:orders.length,hot:filterOrders(orders,'hot').length,wholesale:filterOrders(orders,'wholesale').length,waitlist:filterOrders(orders,'waitlist').length,restock:filterOrders(orders,'restock').length};
  const salesQueue=(active.ownerReport?.driverSalesQueue||active.database?.driverSalesLeads||[]);
  const visibleSales=salesQueue.filter((lead:any)=>salesFilter==='all'||lead.status===salesFilter);
  const salesCounts={all:salesQueue.length,queued:salesQueue.filter((lead:any)=>lead.status==='queued').length,pitched:salesQueue.filter((lead:any)=>lead.status==='pitched').length,reserved:salesQueue.filter((lead:any)=>lead.status==='reserved').length,skipped:salesQueue.filter((lead:any)=>lead.status==='skipped').length};
  const zipDensity=Object.values(salesQueue.reduce((map:Record<string,any>,lead:any)=>{const key=lead.zip||'unknown';map[key]=map[key]||{zip:key,count:0,value:0,areas:new Set()};map[key].count+=1;map[key].value+=Number(lead.estimatedValue||0);map[key].areas.add(lead.area||'Unknown');return map},{})).map((item:any)=>({...item,areas:[...item.areas].join(', ')})).sort((a:any,b:any)=>b.value-a.value);
  const emptyLive=!orders.length;

  async function ownerOverride(lead:any,status='reserved'){
    setSalesNotice(`Saving owner override for ${lead.leadName}...`);
    try{
      const response=await fetch('/api/ops/driver-sales',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...lead,status,ownerOverride:overrideDraft,aiInstruction})});
      const result=await response.json();
      setSalesNotice(result.ok?`${lead.leadName} override saved. AI and route learning will treat it as owner-priority.`:`${lead.leadName} override did not save. Try again.`);
    }catch(error){setSalesNotice(`${lead.leadName} override stayed local. API did not respond.`);}
  }

  return <section className="section owner-lead-dashboard" id="owner-leads">
    <div className="owner-board-head"><div><p className="eyebrow">Owner Lead Board</p><h2>Live route demand, priority leads, and follow-up.</h2><p>No sample/demo records are shown on this board.</p></div></div>
    <div className="owner-metrics"><article><span>Revenue</span><strong>{money(report.revenue)}</strong></article><article><span>Profit</span><strong>{money(report.estimatedProfit)}</strong></article><article><span>Open</span><strong>{report.openOrders||orders.length}</strong></article><article><span>Restock</span><strong>{report.restockIssues||counts.restock}</strong></article><article><span>Training</span><strong>{active.trainingDataset?.records?.length||0}</strong></article></div>
    <div className="owner-filters"><button onClick={()=>setFilter('all')} className={filter==='all'?'active':''}>All <b>{counts.all}</b></button><button onClick={()=>setFilter('hot')} className={filter==='hot'?'active':''}>Hot <b>{counts.hot}</b></button><button onClick={()=>setFilter('wholesale')} className={filter==='wholesale'?'active':''}>Wholesale <b>{counts.wholesale}</b></button><button onClick={()=>setFilter('waitlist')} className={filter==='waitlist'?'active':''}>Waitlist <b>{counts.waitlist}</b></button><button onClick={()=>setFilter('restock')} className={filter==='restock'?'active':''}>Restock <b>{counts.restock}</b></button><button onClick={()=>csvExport(visible)} disabled={!visible.length}>Export</button></div>
    {emptyLive?<article className="owner-empty marble"><h3>Live board is ready.</h3><p>No real intake has been created yet. Real customers, orders, driver updates, restock issues, and sales leads will appear here after they are submitted.</p></article>:<div className="owner-board-grid"><div className="lead-list">{visible.map((order:any)=><article key={order.id} className={`lead-row ${order.priority}`}><div><p className="eyebrow">{order.priority}</p><h3>{order.customerName||order.customer}</h3><p>{order.box} - {routeName(order.routeId,routes)}</p><small>{order.zip} - {order.phone}</small></div><div><strong>{money(order.value)}</strong><span>{order.status} / {order.fulfillment}</span><small>{order.deliveryDate} {order.deliveryWindow}</small></div><p>{order.notes||'No note yet.'}</p></article>)}</div><aside className="route-demand"><p className="eyebrow">Route Demand</p>{routes.length?routes.map((route:any)=><article key={route.id}><h3>{route.name}</h3><p>{route.day} - {route.window}</p><small>{route.reserved}/{route.capacity} grouped - {route.status}</small></article>):<p>No live route demand yet.</p>}</aside></div>}
    <section className="driver-sales-review marble">
      <div className="owner-board-head"><div><p className="eyebrow">Driver Sales Queue</p><h2>Review, override, and hook route deals.</h2></div><button onClick={()=>salesCsvExport(visibleSales)} disabled={!visibleSales.length}>Export Sales CSV</button></div>
      <div className="owner-filters sales-filters"><button onClick={()=>setSalesFilter('all')} className={salesFilter==='all'?'active':''}>All <b>{salesCounts.all}</b></button><button onClick={()=>setSalesFilter('queued')} className={salesFilter==='queued'?'active':''}>Queued <b>{salesCounts.queued}</b></button><button onClick={()=>setSalesFilter('pitched')} className={salesFilter==='pitched'?'active':''}>Pitched <b>{salesCounts.pitched}</b></button><button onClick={()=>setSalesFilter('reserved')} className={salesFilter==='reserved'?'active':''}>Reserved <b>{salesCounts.reserved}</b></button><button onClick={()=>setSalesFilter('skipped')} className={salesFilter==='skipped'?'active':''}>Skipped <b>{salesCounts.skipped}</b></button></div>
      <div className="override-grid"><textarea value={overrideDraft} onChange={event=>setOverrideDraft(event.target.value)} placeholder="Owner override for live lead."/><textarea value={aiInstruction} onChange={event=>setAiInstruction(event.target.value)} placeholder="AI instruction for live route hook."/></div>
      <div className="sales-review-grid"><div className="sales-review-list">{visibleSales.length?visibleSales.map((lead:any)=><article key={lead.id} className={`sales-review-card ${lead.status}`}><div><p className="eyebrow">{lead.status}</p><h3>{lead.leadName}</h3><p>{lead.need}</p><small>{lead.phone||'no phone'} - {lead.email||'no email'}</small><small>{lead.address||lead.area} {lead.zip}</small></div><div><strong>{money(lead.estimatedValue)}</strong><span>{lead.offer}</span><small>Source: {lead.sourceStopId||'field'} / {lead.driver}</small></div><p>{lead.note}</p><div className="sales-actions"><a href={lead.phone?`tel:${lead.phone}`:'#'}>Call</a><a href={lead.phone?`sms:${lead.phone}`:'#'}>Text</a><a href={lead.email?`mailto:${lead.email}`:'#'}>Email</a><button onClick={()=>ownerOverride(lead,'reserved')}>Owner Override</button><button onClick={()=>ownerOverride(lead,'pitched')}>Add AI Hook</button></div></article>):<article className="owner-empty"><h3>No driver sales yet.</h3><p>When drivers pitch, reserve, or skip live leads in mobile Sales Route Mode, they appear here for owner review.</p></article>}</div><aside className="route-demand"><p className="eyebrow">ZIP Density</p>{zipDensity.length?zipDensity.map((zip:any)=><article key={zip.zip}><h3>{zip.zip}</h3><p>{zip.areas}</p><strong>{money(zip.value)}</strong><small>{zip.count} queued signal(s)</small></article>):<p>No live ZIP signals yet.</p>}{salesNotice&&<p className="sales-notice">{salesNotice}</p>}</aside></div>
    </section>
  </section>
}
