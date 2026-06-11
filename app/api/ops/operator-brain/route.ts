import { NextResponse } from 'next/server';
import { fullSystemSnapshot } from '../../../../lib/ccp-database';
import { generateOwnerReportFromPostgres, getDriverSalesLeadsFromPostgres, getOrderLifecycleFromPostgres, postgresConfigured } from '../../../../lib/pg-database';

function accessRole(request:Request){const cookie=request.headers.get('cookie')||'';return cookie.match(/(?:^|; )ccp_access=([^;]+)/)?.[1]||''}
function requiresPostgres(){return process.env.NODE_ENV==='production'||process.env.CCP_REQUIRE_POSTGRES==='true'}
function money(value:number){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value||0)}
function clean(value:unknown){return String(value||'').trim()}
function scoreLead(lead:any){let score=Number(lead.estimatedValue||0);const text=`${lead.status||''} ${lead.need||''} ${lead.offer||''} ${lead.note||''}`.toLowerCase();if(text.includes('reserved'))score+=600;if(text.includes('pitched'))score+=300;if(text.includes('wholesale'))score+=500;if(text.includes('freezer'))score+=250;if(text.includes('steak'))score+=150;if(lead.phone)score+=75;if(lead.email)score+=50;return score}
function statusPriority(status:string){if(status==='reserved')return 4;if(status==='pitched')return 3;if(status==='queued')return 2;if(status==='skipped')return 0;return 1}
function zipHeat(orders:any[],leads:any[]){
  const map:Record<string,any>={};
  for(const order of orders){const zip=clean(order.zip)||'unknown';map[zip]=map[zip]||{zip,orders:0,leads:0,value:0,signals:[],score:0};map[zip].orders+=1;map[zip].value+=Number(order.value||0);map[zip].score+=100+Number(order.value||0)/10;map[zip].signals.push(`${order.box||'Order'} ${order.status||''}`)}
  for(const lead of leads){const zip=clean(lead.zip)||'unknown';map[zip]=map[zip]||{zip,orders:0,leads:0,value:0,signals:[],score:0};map[zip].leads+=1;map[zip].value+=Number(lead.estimatedValue||0);map[zip].score+=75+Number(lead.estimatedValue||0)/12+statusPriority(lead.status)*80;map[zip].signals.push(`${lead.status||'lead'} ${lead.need||'sales lead'}`)}
  return Object.values(map).sort((a:any,b:any)=>b.score-a.score).slice(0,8);
}
function routeFocus(orders:any[]){
  const map:Record<string,any>={};
  for(const order of orders){const routeId=clean(order.routeId||order.route_id)||'unassigned';map[routeId]=map[routeId]||{routeId,orders:0,value:0,open:0,restock:0,boxes:new Set(),nextAction:''};map[routeId].orders+=1;map[routeId].value+=Number(order.value||0);map[routeId].boxes.add(order.box||'box');if(!['delivered','cancelled'].includes(order.status))map[routeId].open+=1;const text=`${order.fulfillment||''} ${order.notes||''}`.toLowerCase();if(text.includes('partial')||text.includes('restock')||text.includes('issue'))map[routeId].restock+=1;}
  return Object.values(map).map((route:any)=>({...route,boxes:[...route.boxes],nextAction:route.restock?`Protect ${route.routeId}: resolve ${route.restock} restock issue(s) before promising premium cuts.`:route.open?`Work ${route.routeId}: ${route.open} open stop(s), ${money(route.value)} scheduled.`:`Review ${route.routeId}: route appears closed or waiting.`})).sort((a:any,b:any)=>b.value-a.value).slice(0,8);
}
function restockRisk(orders:any[]){
  const risks:Record<string,any>={};
  for(const order of orders){const text=`${order.box||''} ${order.notes||''} ${order.fulfillment||''}`.toLowerCase();const products=['ribeye','filet','new york','sirloin','ground beef','chicken','pork','premium','steak'];for(const product of products){if(text.includes(product)){risks[product]=risks[product]||{product,count:0,value:0,reason:''};risks[product].count+=1;risks[product].value+=Number(order.value||0);}}if(text.includes('partial')||text.includes('restock')||text.includes('blocked')){const product=order.box||'general inventory';risks[product]=risks[product]||{product,count:0,value:0,reason:''};risks[product].count+=2;risks[product].value+=Number(order.value||0);}}
  return Object.values(risks).map((risk:any)=>({...risk,reason:`${risk.count} demand/restock signal(s), ${money(risk.value)} attached value.`})).sort((a:any,b:any)=>b.count-a.count||b.value-a.value).slice(0,8);
}
function recommendedActions(zip:any[],routes:any[],risks:any[],sales:any[]){
  const actions:string[]=[];
  if(zip[0])actions.push(`Push today where heat is strongest: ${zip[0].zip} has ${zip[0].orders} order(s), ${zip[0].leads} lead(s), and ${money(zip[0].value)} in demand.`);
  if(routes[0])actions.push(routes[0].nextAction);
  if(risks[0])actions.push(`Inventory guardrail: check ${risks[0].product} before promising premium boxes.`);
  if(sales[0])actions.push(`Owner follow-up: ${sales[0].leadName||'top driver lead'} is the strongest sales queue signal at ${money(sales[0].estimatedValue)}.`);
  if(!actions.length)actions.push('No live demand yet. Focus on getting the first real customer intake, first live order, and first driver sales lead into the system.');
  return actions;
}

export async function GET(request:Request){
  try{
    if(accessRole(request)!=='owner')return NextResponse.json({ok:false,message:'Owner access required'},{status:401});
    const hasDb=postgresConfigured();
    if(!hasDb&&requiresPostgres())return NextResponse.json({ok:false,storage:'unavailable',databaseRequired:true,message:'PostgreSQL is required for the owner operator brain.'},{status:503});
    const [orders,report,leads]=hasDb?await Promise.all([getOrderLifecycleFromPostgres(),generateOwnerReportFromPostgres(),getDriverSalesLeadsFromPostgres()]):(()=>{const snap=fullSystemSnapshot({mode:'live'});return [snap.orderLifecycle||[],snap.ownerReport||{},snap.database?.driverSalesLeads||[]] as any})();
    const hotZips=zipHeat(orders||[],leads||[]);
    const routes=routeFocus(orders||[]);
    const risks=restockRisk(orders||[]);
    const salesPriorities=(leads||[]).map((lead:any)=>({...lead,score:scoreLead(lead),nextAction:statusPriority(lead.status)>=3?'Call or text now; route the box if timing is real.':'Qualify need, timing, freezer space, and best delivery ZIP.'})).sort((a:any,b:any)=>b.score-a.score).slice(0,8);
    const actions=recommendedActions(hotZips,routes,risks,salesPriorities);
    return NextResponse.json({ok:true,mode:'live',storage:hasDb?'postgres':'memory',generatedAt:new Date().toISOString(),brain:{summary:actions[0],recommendedActions:actions,hotZips,routes,restockRisks:risks,salesPriorities,report}});
  }catch(error){
    console.error('Operator brain failed:',error);
    return NextResponse.json({ok:false,message:'Operator brain failed'},{status:500});
  }
}
