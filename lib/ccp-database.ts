import { buildKnowledgeContext } from './ai-knowledge';
import { customerSnapshot, driverSnapshot, ownerSnapshot } from './ops-memory';

export type LifecycleStatus='lead'|'quoted'|'ordered'|'paid'|'scheduled'|'packed'|'loaded'|'out-for-delivery'|'partially-fulfilled'|'delivered'|'issue'|'restock-needed'|'cancelled';
export type FulfillmentStatus='pending'|'packed'|'partial'|'fulfilled'|'restock-blocked'|'substituted';
export type RouteEfficiency='excellent'|'good'|'watch'|'poor';
export type DatabaseMode='live';

export type CustomerRecord={id:string;name:string;email:string;phone:string;zip:string;source:string;preferences:string[];createdAt:string};
export type ProductRecord={sku:string;name:string;qty:number;unit:string;fulfilled:number;issue?:string};
export type OrderRecord={id:string;customerId:string;customerName:string;phone:string;zip:string;routeId:string;box:string;status:LifecycleStatus;fulfillment:FulfillmentStatus;value:number;costEstimate:number;marginEstimate:number;deliveryDate:string;deliveryWindow:string;products:ProductRecord[];notes:string;promo?:string;createdAt:string;updatedAt:string};
export type DriverUpdate={id:string;orderId:string;routeId:string;driver:string;status:LifecycleStatus;fulfillment:FulfillmentStatus;deliveredAt?:string;partialReason?:string;restockIssue?:string;substitutions?:string;customerNotes?:string;fuelStart?:number;fuelEnd?:number;milesDriven?:number;routeEfficiency:RouteEfficiency;createdAt:string};
export type DriverSalesStatus='queued'|'pitched'|'reserved'|'skipped';
export type DriverSalesLead={id:string;driver:string;sourceStopId?:string;sourceCustomer?:string;routeId?:string;leadName:string;email?:string;phone?:string;address?:string;zip:string;area:string;need:string;offer:string;estimatedValue:number;status:DriverSalesStatus;temperature:'hot'|'warm'|'watch';note:string;ownerOverride?:string;aiInstruction?:string;driverRoutePlan?:string;createdAt:string;updatedAt:string};
export type RestockIssue={id:string;orderId:string;routeId:string;sku:string;product:string;needed:number;available:number;severity:'low'|'medium'|'high';action:string;createdAt:string};
export type LearningEvent={id:string;role:'customer'|'driver'|'owner'|'system';eventType:string;summary:string;signal:number;routeId?:string;orderId?:string;createdAt:string};
export type RouteEfficiencyReport={routeId:string;route:string;efficiency:RouteEfficiency;fuelUsed:number;milesDriven:number;profit:number};
export type OwnerReport={date:string;revenue:number;estimatedCost:number;estimatedProfit:number;margin:number;openOrders:number;deliveredOrders:number;partialOrders:number;restockIssues:number;routeEfficiency:RouteEfficiencyReport[];futureRestock:{product:string;needed:number;reason:string}[];ownerActions:string[];learningNotes:string[];driverSalesQueue:DriverSalesLead[]};

export type OrderInput=Partial<OrderRecord>&{customerName?:string;phone?:string;zip?:string;email?:string};
export type DriverUpdateInput=Partial<DriverUpdate>&{orderId:string;routeId:string;driver:string};
type MutableDatabase={customers:CustomerRecord[];orders:OrderRecord[];driverUpdates:DriverUpdate[];driverSalesLeads:DriverSalesLead[];restockIssues:RestockIssue[];learningEvents:LearningEvent[]};
type DatabaseInput={mode?:DatabaseMode|string};
const globalDatabase=globalThis as typeof globalThis&{ccpLiveDatabase?:MutableDatabase};

export function emptyDatabase():MutableDatabase{return {customers:[],orders:[],driverUpdates:[],driverSalesLeads:[],restockIssues:[],learningEvents:[]};}
export function getDatabase(_input:DatabaseInput={}):MutableDatabase{if(!globalDatabase.ccpLiveDatabase)globalDatabase.ccpLiveDatabase=emptyDatabase();return globalDatabase.ccpLiveDatabase;}

export function getOrderLifecycle(orderId?:string,input:DatabaseInput={}){
  const db=getDatabase(input);
  const orders=orderId?db.orders.filter(order=>order.id===orderId):db.orders;
  return orders.map(order=>({...order,customer:db.customers.find(customer=>customer.id===order.customerId),driverUpdates:db.driverUpdates.filter(update=>update.orderId===order.id),restockIssues:db.restockIssues.filter(issue=>issue.orderId===order.id),learningEvents:db.learningEvents.filter(event=>event.orderId===order.id||event.routeId===order.routeId)}));
}

export function buildOrderRecord(input:OrderInput):OrderRecord{
  const createdAt=input.createdAt||new Date().toISOString();
  const customerId=input.customerId||`CUST-${Date.now()}`;
  const value=Number(input.value||0);
  return {id:input.id||`CCP-${Date.now()}`,customerId,customerName:input.customerName||'New Customer',phone:input.phone||'',zip:input.zip||'',routeId:input.routeId||'owner-intake',box:input.box||'Custom Freezer Box',status:input.status||'ordered',fulfillment:input.fulfillment||'pending',value,costEstimate:input.costEstimate||Math.round(value*.58),marginEstimate:input.marginEstimate||Math.round(value*.42),deliveryDate:input.deliveryDate||'TBD',deliveryWindow:input.deliveryWindow||'TBD',products:input.products||[],notes:input.notes||'',promo:input.promo,createdAt,updatedAt:input.updatedAt||createdAt};
}

export function createOrder(input:OrderInput,dbInput:DatabaseInput={}){
  const db=getDatabase(dbInput);
  const order=buildOrderRecord(input);
  if(!db.customers.find(customer=>customer.id===order.customerId)){db.customers.push({id:order.customerId,name:order.customerName,email:input.email||'',phone:order.phone,zip:order.zip,source:'owner-dashboard',preferences:order.products.map(product=>product.name),createdAt:order.createdAt});}
  db.orders.unshift(order);
  db.learningEvents.unshift({id:`LEARN-${Date.now()}`,role:'customer',eventType:'order-created',summary:`${order.box} order created for ${order.zip} on ${order.routeId}.`,signal:6,orderId:order.id,routeId:order.routeId,createdAt:order.createdAt});
  return order;
}

export function buildDriverUpdateRecord(input:DriverUpdateInput):DriverUpdate{
  const createdAt=input.createdAt||new Date().toISOString();
  return {id:input.id||`DU-${Date.now()}`,orderId:input.orderId,routeId:input.routeId,driver:input.driver,status:input.status||'out-for-delivery',fulfillment:input.fulfillment||'pending',deliveredAt:input.deliveredAt,partialReason:input.partialReason,restockIssue:input.restockIssue,substitutions:input.substitutions,customerNotes:input.customerNotes,fuelStart:Number(input.fuelStart||0),fuelEnd:Number(input.fuelEnd||0),milesDriven:Number(input.milesDriven||0),routeEfficiency:input.routeEfficiency||scoreRouteEfficiency(Number(input.milesDriven||0),Number(input.fuelStart||0),Number(input.fuelEnd||0)),createdAt};
}

export function applyDriverUpdate(input:DriverUpdateInput,dbInput:DatabaseInput={}){
  const db=getDatabase(dbInput);
  const update=buildDriverUpdateRecord(input);
  db.driverUpdates.unshift(update);
  const order=db.orders.find(order=>order.id===input.orderId);
  if(order){order.status=update.status;order.fulfillment=update.fulfillment;order.updatedAt=update.createdAt;if(update.status==='delivered')order.deliveryDate=update.createdAt.slice(0,10)}
  if(update.restockIssue){db.restockIssues.unshift({id:`RI-${Date.now()}`,orderId:update.orderId,routeId:update.routeId,sku:'DRIVER-REPORTED',product:update.restockIssue,needed:1,available:0,severity:update.fulfillment==='restock-blocked'?'high':'medium',action:'Owner review required before next route promise.',createdAt:update.createdAt});}
  db.learningEvents.unshift({id:`LEARN-${Date.now()}`,role:'driver',eventType:'driver-update',summary:`${update.driver} updated ${update.orderId}: ${update.status}, ${update.fulfillment}. Efficiency ${update.routeEfficiency}. ${update.restockIssue||''}`.trim(),signal:update.routeEfficiency==='poor'?9:6,orderId:update.orderId,routeId:update.routeId,createdAt:update.createdAt});
  return update;
}

export function upsertDriverSalesLead(input:Partial<DriverSalesLead>&{id:string;driver:string;leadName:string;zip:string;area:string;need:string;offer:string;status:DriverSalesStatus},dbInput:DatabaseInput={}){
  const db=getDatabase(dbInput);
  const updatedAt=new Date().toISOString();
  const existing=db.driverSalesLeads.find(lead=>lead.id===input.id);
  const record:DriverSalesLead={id:input.id,driver:input.driver,sourceStopId:input.sourceStopId,sourceCustomer:input.sourceCustomer,routeId:input.routeId,leadName:input.leadName,email:input.email,phone:input.phone,address:input.address,zip:input.zip,area:input.area,need:input.need,offer:input.offer,estimatedValue:Number(input.estimatedValue||0),status:input.status,temperature:input.temperature||'warm',note:input.note||'',ownerOverride:input.ownerOverride,aiInstruction:input.aiInstruction,driverRoutePlan:input.driverRoutePlan,createdAt:existing?.createdAt||updatedAt,updatedAt};
  if(existing){Object.assign(existing,record)}else{db.driverSalesLeads.unshift(record)}
  const signal=record.status==='reserved'?9:record.status==='pitched'?7:record.status==='skipped'?2:5;
  db.learningEvents.unshift({id:`LEARN-SALE-${Date.now()}`,role:record.ownerOverride?'owner':'driver',eventType:record.ownerOverride?'owner-sales-override':'driver-sales-queue',summary:`${record.driver} marked ${record.leadName} ${record.status} for ${record.area} ${record.zip}: ${record.offer}. Value ${record.estimatedValue}. ${record.ownerOverride?`Owner override: ${record.ownerOverride}.`:''} ${record.driverRoutePlan?`Route plan: ${record.driverRoutePlan}.`:''}`.trim(),signal,routeId:record.routeId,orderId:record.sourceStopId,createdAt:updatedAt});
  return record;
}

export function scoreRouteEfficiency(miles:number,fuelStart:number,fuelEnd:number):RouteEfficiency{const fuelUsed=Math.max(0,fuelStart-fuelEnd);if(!miles||!fuelUsed)return 'good';const mpg=miles/fuelUsed;if(mpg>=14)return 'excellent';if(mpg>=10)return 'good';if(mpg>=7)return 'watch';return 'poor';}
function routeEfficiencyScore(updates:DriverUpdate[]):RouteEfficiency{if(updates.some(update=>update.routeEfficiency==='poor'))return 'poor';if(updates.some(update=>update.routeEfficiency==='watch'))return 'watch';if(updates.some(update=>update.routeEfficiency==='excellent'))return 'excellent';return 'good';}
function liveRouteIds(db:MutableDatabase){return [...new Set([...db.orders.map(order=>order.routeId||'owner-intake'),...db.driverUpdates.map(update=>update.routeId||'owner-intake')])].filter(Boolean);}

export function generateOwnerReport(input:DatabaseInput={}):OwnerReport{
  const db=getDatabase(input);
  const delivered=db.orders.filter(order=>order.status==='delivered');
  const partial=db.orders.filter(order=>order.status==='partially-fulfilled'||order.fulfillment==='partial');
  const revenue=db.orders.reduce((sum,order)=>sum+order.value,0);
  const estimatedCost=db.orders.reduce((sum,order)=>sum+order.costEstimate,0);
  const estimatedProfit=revenue-estimatedCost;
  const routeEfficiency:RouteEfficiencyReport[]=liveRouteIds(db).map(routeId=>{const updates=db.driverUpdates.filter(update=>update.routeId===routeId);const fuelUsed=updates.reduce((sum,update)=>sum+Math.max(0,(update.fuelStart||0)-(update.fuelEnd||0)),0);const milesDriven=updates.reduce((sum,update)=>sum+(update.milesDriven||0),0);const profit=db.orders.filter(order=>order.routeId===routeId).reduce((sum,order)=>sum+order.marginEstimate,0);return {routeId,route:routeId,efficiency:routeEfficiencyScore(updates),fuelUsed,milesDriven,profit};});
  const futureRestock=db.restockIssues.map(issue=>({product:issue.product,needed:issue.needed,reason:`${issue.severity} issue on ${issue.orderId}: ${issue.action}`}));
  const ownerActions=[db.orders.length?`Review ${db.orders.length} live order(s) from the owner source of truth.`:'No live orders yet.',db.driverSalesLeads.length?`Review ${db.driverSalesLeads.length} live driver sales lead(s).`:'No live driver sales leads yet.',db.restockIssues.length?`Review ${db.restockIssues.length} restock issue(s) before promising premium boxes.`:'No active restock blockers.',partial.length?`Call ${partial.length} partial fulfillment customer(s).`:'No partial fulfillment calls needed.'];
  return {date:new Date().toISOString().slice(0,10),revenue,estimatedCost,estimatedProfit,margin:revenue?Math.round((estimatedProfit/revenue)*100):0,openOrders:db.orders.filter(order=>!['delivered','cancelled'].includes(order.status)).length,deliveredOrders:delivered.length,partialOrders:partial.length,restockIssues:db.restockIssues.length,routeEfficiency,futureRestock,ownerActions,learningNotes:db.learningEvents.slice(0,8).map(event=>event.summary),driverSalesQueue:db.driverSalesLeads};
}

export function aiTrainingDataset(input:DatabaseInput={}){const db=getDatabase(input);return {generatedAt:new Date().toISOString(),mode:'live',records:[...db.orders.map(order=>({type:'order',input:`${order.zip} ${order.box} ${order.products.map(p=>p.name).join(' ')}`,output:`status=${order.status}; fulfillment=${order.fulfillment}; margin=${order.marginEstimate}; route=${order.routeId}`})),...db.driverUpdates.map(update=>({type:'driver_update',input:`${update.routeId} ${update.status} ${update.fulfillment} ${update.restockIssue||''} miles=${update.milesDriven}`,output:`efficiency=${update.routeEfficiency}; learn=${update.customerNotes||update.partialReason||'no note'}`})),...db.driverSalesLeads.map(lead=>({type:'driver_sales_lead',input:`${lead.zip} ${lead.area} ${lead.need} ${lead.offer}`,output:`status=${lead.status}; value=${lead.estimatedValue}; route=${lead.routeId||'unassigned'}; driver=${lead.driver}`})),...db.learningEvents.map(event=>({type:'learning',input:event.eventType,output:event.summary,signal:event.signal}))]};}

export function fullSystemSnapshot(_input:DatabaseInput={}){const mode='live' as const;const database=getDatabase();return {...ownerSnapshot(),mode,database,orderLifecycle:getOrderLifecycle(),ownerReport:generateOwnerReport(),trainingDataset:aiTrainingDataset(),aiKnowledge:buildKnowledgeContext('owner'),sampleAvailable:false,customerSample:customerSnapshot(),driverSample:driverSnapshot()};}
