import { customerSnapshot, driverSnapshot, ownerSnapshot, opsOrders, opsRoutes } from './ops-memory';

export type LifecycleStatus='lead'|'quoted'|'ordered'|'paid'|'scheduled'|'packed'|'loaded'|'out-for-delivery'|'partially-fulfilled'|'delivered'|'issue'|'restock-needed'|'cancelled';
export type FulfillmentStatus='pending'|'packed'|'partial'|'fulfilled'|'restock-blocked'|'substituted';
export type RouteEfficiency='excellent'|'good'|'watch'|'poor';

export type CustomerRecord={id:string;name:string;email:string;phone:string;zip:string;source:string;preferences:string[];createdAt:string};
export type ProductRecord={sku:string;name:string;qty:number;unit:string;fulfilled:number;issue?:string};
export type OrderRecord={id:string;customerId:string;customerName:string;phone:string;zip:string;routeId:string;box:string;status:LifecycleStatus;fulfillment:FulfillmentStatus;value:number;costEstimate:number;marginEstimate:number;deliveryDate:string;deliveryWindow:string;products:ProductRecord[];notes:string;promo?:string;createdAt:string;updatedAt:string};
export type DriverUpdate={id:string;orderId:string;routeId:string;driver:string;status:LifecycleStatus;fulfillment:FulfillmentStatus;deliveredAt?:string;partialReason?:string;restockIssue?:string;substitutions?:string;customerNotes?:string;fuelStart?:number;fuelEnd?:number;milesDriven?:number;routeEfficiency:RouteEfficiency;createdAt:string};
export type RestockIssue={id:string;orderId:string;routeId:string;sku:string;product:string;needed:number;available:number;severity:'low'|'medium'|'high';action:string;createdAt:string};
export type LearningEvent={id:string;role:'customer'|'driver'|'owner'|'system';eventType:string;summary:string;signal:number;routeId?:string;orderId?:string;createdAt:string};
export type RouteEfficiencyReport={routeId:string;route:string;efficiency:RouteEfficiency;fuelUsed:number;milesDriven:number;profit:number};
export type OwnerReport={date:string;revenue:number;estimatedCost:number;estimatedProfit:number;margin:number;openOrders:number;deliveredOrders:number;partialOrders:number;restockIssues:number;routeEfficiency:RouteEfficiencyReport[];futureRestock:{product:string;needed:number;reason:string}[];ownerActions:string[];learningNotes:string[]};

type MutableDatabase={customers:CustomerRecord[];orders:OrderRecord[];driverUpdates:DriverUpdate[];restockIssues:RestockIssue[];learningEvents:LearningEvent[]};

const now='2026-06-06T12:00:00.000Z';
const globalDatabase=globalThis as typeof globalThis&{ccpDatabase?:MutableDatabase};

export const dbCustomers:CustomerRecord[]=opsOrders.map((order,index)=>({id:`CUST-${1000+index}`,name:order.customer,email:`customer${index+1}@example.com`,phone:order.phone,zip:order.zip,source:order.promo?'promo-route-check':'route-check',preferences:order.proteins,createdAt:now}));

export const dbOrders:OrderRecord[]=opsOrders.map((order,index)=>({
  id:order.id,
  customerId:dbCustomers[index]?.id||`CUST-${1000+index}`,
  customerName:order.customer,
  phone:order.phone,
  zip:order.zip,
  routeId:order.routeId,
  box:order.box,
  status:order.status==='delivered'?'delivered':order.status==='loaded'?'loaded':order.status==='waitlist'?'quoted':'ordered',
  fulfillment:order.status==='loaded'?'packed':'pending',
  value:order.value,
  costEstimate:Math.round(order.value*.58),
  marginEstimate:Math.round(order.value*.42),
  deliveryDate:order.routeId==='rocklin-lincoln'?'2026-06-11':order.routeId==='roseville'?'2026-06-10':order.routeId==='fair-oaks-carmichael'?'2026-06-09':'2026-06-12',
  deliveryWindow:opsRoutes.find(route=>route.id===order.routeId)?.window||'TBD',
  products:order.proteins.map((protein,pIndex)=>({sku:`${protein.toUpperCase()}-${pIndex+1}`,name:protein,qty:pIndex===0?10:6,unit:'lbs',fulfilled:order.status==='loaded'?(pIndex===0?10:6):0})),
  notes:order.notes,
  promo:order.promo,
  createdAt:now,
  updatedAt:now
}));

export const dbDriverUpdates:DriverUpdate[]=[
  {id:'DU-1001',orderId:'CCP-1011',routeId:'rocklin-lincoln',driver:'Elena',status:'loaded',fulfillment:'packed',customerNotes:'Steak box loaded. Call ahead requested.',fuelStart:18.4,fuelEnd:13.9,milesDriven:46,routeEfficiency:'good',createdAt:now},
  {id:'DU-1002',orderId:'CCP-1007',routeId:'roseville',driver:'Marco',status:'scheduled',fulfillment:'pending',customerNotes:'Family box confirmed for Wednesday.',fuelStart:17.5,fuelEnd:0,milesDriven:0,routeEfficiency:'good',createdAt:now}
];

export const dbRestockIssues:RestockIssue[]=[{id:'RI-1001',orderId:'CCP-1011',routeId:'rocklin-lincoln',sku:'FILET-2',product:'filet',needed:6,available:4,severity:'medium',action:'Offer filet substitution or hold 2 lbs for next restock.',createdAt:now}];
export const dbLearningEvents:LearningEvent[]=[
  {id:'LEARN-1001',role:'system',eventType:'route-conversion',summary:'Rocklin steak leads respond to ribeye and filet bundle language.',signal:8,routeId:'rocklin-lincoln',createdAt:now},
  {id:'LEARN-1002',role:'driver',eventType:'delivery-note',summary:'Call-ahead notes reduce missed stops on premium routes.',signal:7,routeId:'roseville',createdAt:now},
  {id:'LEARN-1003',role:'owner',eventType:'restock-risk',summary:'Seafood and filet should trigger restock alerts before premium boxes are promised.',signal:9,createdAt:now}
];

export function getDatabase():MutableDatabase{
  if(!globalDatabase.ccpDatabase){globalDatabase.ccpDatabase={customers:[...dbCustomers],orders:[...dbOrders],driverUpdates:[...dbDriverUpdates],restockIssues:[...dbRestockIssues],learningEvents:[...dbLearningEvents]};}
  return globalDatabase.ccpDatabase;
}

export function getOrderLifecycle(orderId?:string){
  const db=getDatabase();
  const orders=orderId?db.orders.filter(order=>order.id===orderId):db.orders;
  return orders.map(order=>({...order,customer:db.customers.find(customer=>customer.id===order.customerId),driverUpdates:db.driverUpdates.filter(update=>update.orderId===order.id),restockIssues:db.restockIssues.filter(issue=>issue.orderId===order.id),learningEvents:db.learningEvents.filter(event=>event.orderId===order.id||event.routeId===order.routeId)}));
}

export function createOrder(input:Partial<OrderRecord>&{customerName?:string;phone?:string;zip?:string}){
  const db=getDatabase();
  const createdAt=new Date().toISOString();
  const customerId=input.customerId||`CUST-${Date.now()}`;
  if(!db.customers.find(customer=>customer.id===customerId)){db.customers.push({id:customerId,name:input.customerName||'New Customer',email:'',phone:input.phone||'',zip:input.zip||'',source:'order-intake',preferences:[],createdAt});}
  const value=Number(input.value||0);
  const order:OrderRecord={id:input.id||`CCP-${Date.now()}`,customerId,customerName:input.customerName||'New Customer',phone:input.phone||'',zip:input.zip||'',routeId:input.routeId||'waitlist',box:input.box||'Custom Freezer Box',status:input.status||'ordered',fulfillment:input.fulfillment||'pending',value,costEstimate:input.costEstimate||Math.round(value*.58),marginEstimate:input.marginEstimate||Math.round(value*.42),deliveryDate:input.deliveryDate||'TBD',deliveryWindow:input.deliveryWindow||'TBD',products:input.products||[],notes:input.notes||'',promo:input.promo,createdAt,updatedAt:createdAt};
  db.orders.unshift(order);
  db.learningEvents.unshift({id:`LEARN-${Date.now()}`,role:'customer',eventType:'order-created',summary:`${order.box} order created for ${order.zip} on ${order.routeId}.`,signal:6,orderId:order.id,routeId:order.routeId,createdAt});
  return order;
}

export function applyDriverUpdate(input:Partial<DriverUpdate>&{orderId:string;routeId:string;driver:string}){
  const db=getDatabase();
  const createdAt=new Date().toISOString();
  const update:DriverUpdate={id:input.id||`DU-${Date.now()}`,orderId:input.orderId,routeId:input.routeId,driver:input.driver,status:input.status||'out-for-delivery',fulfillment:input.fulfillment||'pending',deliveredAt:input.deliveredAt,partialReason:input.partialReason,restockIssue:input.restockIssue,substitutions:input.substitutions,customerNotes:input.customerNotes,fuelStart:Number(input.fuelStart||0),fuelEnd:Number(input.fuelEnd||0),milesDriven:Number(input.milesDriven||0),routeEfficiency:input.routeEfficiency||scoreRouteEfficiency(Number(input.milesDriven||0),Number(input.fuelStart||0),Number(input.fuelEnd||0)),createdAt};
  db.driverUpdates.unshift(update);
  const order=db.orders.find(order=>order.id===input.orderId);
  if(order){order.status=update.status;order.fulfillment=update.fulfillment;order.updatedAt=createdAt;if(update.status==='delivered')order.deliveryDate=createdAt.slice(0,10)}
  if(update.restockIssue){db.restockIssues.unshift({id:`RI-${Date.now()}`,orderId:update.orderId,routeId:update.routeId,sku:'DRIVER-REPORTED',product:update.restockIssue,needed:1,available:0,severity:update.fulfillment==='restock-blocked'?'high':'medium',action:'Owner review required before next route promise.',createdAt});}
  db.learningEvents.unshift({id:`LEARN-${Date.now()}`,role:'driver',eventType:'driver-update',summary:`${update.driver} updated ${update.orderId}: ${update.status}, ${update.fulfillment}. Efficiency ${update.routeEfficiency}. ${update.restockIssue||''}`.trim(),signal:update.routeEfficiency==='poor'?9:6,orderId:update.orderId,routeId:update.routeId,createdAt});
  return update;
}

export function scoreRouteEfficiency(miles:number,fuelStart:number,fuelEnd:number):RouteEfficiency{
  const fuelUsed=Math.max(0,fuelStart-fuelEnd);
  if(!miles||!fuelUsed)return 'good';
  const mpg=miles/fuelUsed;
  if(mpg>=14)return 'excellent';
  if(mpg>=10)return 'good';
  if(mpg>=7)return 'watch';
  return 'poor';
}

function routeEfficiencyScore(updates:DriverUpdate[]):RouteEfficiency{
  if(updates.some(update=>update.routeEfficiency==='poor'))return 'poor';
  if(updates.some(update=>update.routeEfficiency==='watch'))return 'watch';
  if(updates.some(update=>update.routeEfficiency==='excellent'))return 'excellent';
  return 'good';
}

export function generateOwnerReport():OwnerReport{
  const db=getDatabase();
  const delivered=db.orders.filter(order=>order.status==='delivered');
  const partial=db.orders.filter(order=>order.status==='partially-fulfilled'||order.fulfillment==='partial');
  const revenue=db.orders.reduce((sum,order)=>sum+order.value,0);
  const estimatedCost=db.orders.reduce((sum,order)=>sum+order.costEstimate,0);
  const estimatedProfit=revenue-estimatedCost;
  const routeEfficiency:RouteEfficiencyReport[]=opsRoutes.map(route=>{
    const updates=db.driverUpdates.filter(update=>update.routeId===route.id);
    const fuelUsed=updates.reduce((sum,update)=>sum+Math.max(0,(update.fuelStart||0)-(update.fuelEnd||0)),0);
    const milesDriven=updates.reduce((sum,update)=>sum+(update.milesDriven||0),0);
    const profit=db.orders.filter(order=>order.routeId===route.id).reduce((sum,order)=>sum+order.marginEstimate,0);
    return {routeId:route.id,route:route.name,efficiency:routeEfficiencyScore(updates),fuelUsed,milesDriven,profit};
  });
  const futureRestock=db.restockIssues.map(issue=>({product:issue.product,needed:issue.needed,reason:`${issue.severity} issue on ${issue.orderId}: ${issue.action}`}));
  const ownerActions=[db.restockIssues.length?`Review ${db.restockIssues.length} restock issue(s) before promising premium boxes.`:'No active restock blockers in sample data.',partial.length?`Call ${partial.length} partial fulfillment customer(s).`:'No partial fulfillment calls needed.','Use driver fuel/miles notes to adjust route grouping before dispatch.','Convert learning events into route rules after owner review.'];
  return {date:new Date().toISOString().slice(0,10),revenue,estimatedCost,estimatedProfit,margin:revenue?Math.round((estimatedProfit/revenue)*100):0,openOrders:db.orders.filter(order=>!['delivered','cancelled'].includes(order.status)).length,deliveredOrders:delivered.length,partialOrders:partial.length,restockIssues:db.restockIssues.length,routeEfficiency,futureRestock,ownerActions,learningNotes:db.learningEvents.slice(0,8).map(event=>event.summary)};
}

export function aiTrainingDataset(){
  const db=getDatabase();
  return {generatedAt:new Date().toISOString(),records:[...db.orders.map(order=>({type:'order',input:`${order.zip} ${order.box} ${order.products.map(p=>p.name).join(' ')}`,output:`status=${order.status}; fulfillment=${order.fulfillment}; margin=${order.marginEstimate}; route=${order.routeId}`})),...db.driverUpdates.map(update=>({type:'driver_update',input:`${update.routeId} ${update.status} ${update.fulfillment} ${update.restockIssue||''} miles=${update.milesDriven}`,output:`efficiency=${update.routeEfficiency}; learn=${update.customerNotes||update.partialReason||'no note'}`})),...db.learningEvents.map(event=>({type:'learning',input:event.eventType,output:event.summary,signal:event.signal}))]};
}

export function fullSystemSnapshot(){return {...ownerSnapshot(),database:getDatabase(),orderLifecycle:getOrderLifecycle(),ownerReport:generateOwnerReport(),trainingDataset:aiTrainingDataset(),customerSample:customerSnapshot(),driverSample:driverSnapshot()}}
