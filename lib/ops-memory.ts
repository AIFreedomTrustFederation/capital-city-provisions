export type OrderStatus='new'|'confirmed'|'loaded'|'out-for-delivery'|'delivered'|'issue'|'waitlist';
export type RouteStatus='confirmed'|'almost-full'|'building'|'waitlist';

export type OpsOrder={
  id:string;
  customer:string;
  zip:string;
  routeId:string;
  box:string;
  value:number;
  status:OrderStatus;
  proteins:string[];
  notes:string;
  phone:string;
  smsReady:boolean;
  promo?:string;
};

export type OpsRoute={
  id:string;
  name:string;
  day:string;
  window:string;
  zips:string[];
  status:RouteStatus;
  capacity:number;
  reserved:number;
  driver:string;
  priority:string;
  learnings:string[];
};

export type DriverTurnIn={
  id:string;
  routeId:string;
  driver:string;
  completed:number;
  missed:number;
  rescheduled:number;
  payments:string;
  customerNotes:string;
  ownerFollowup:string;
};

export const opsOrders:OpsOrder[]=[
  {id:'CCP-1007',customer:'M. Ramirez',zip:'95661',routeId:'roseville',box:'Family Box',value:525,status:'confirmed',proteins:['beef','chicken','pork'],notes:'Prefers family portions and weeknight meals.',phone:'916-555-0107',smsReady:true,promo:'CHEESECAKE-48'},
  {id:'CCP-1011',customer:'J. Thompson',zip:'95765',routeId:'rocklin-lincoln',box:'Steak Lovers Club',value:740,status:'loaded',proteins:['ribeye','filet','new york strip'],notes:'Call 20 minutes before arrival.',phone:'916-555-0111',smsReady:true,promo:'CHEESECAKE-48'},
  {id:'CCP-1014',customer:'Golden Oak Catering',zip:'95678',routeId:'roseville',box:'Wholesale Account',value:1280,status:'new',proteins:['beef','chicken'],notes:'Needs recurring quote for events and catering.',phone:'916-555-0114',smsReady:true},
  {id:'CCP-1016',customer:'A. Nguyen',zip:'95630',routeId:'folsom-orangevale',box:'Starter Box',value:315,status:'waitlist',proteins:['beef','chicken'],notes:'New family freezer customer. Wants simple cuts.',phone:'916-555-0116',smsReady:true},
  {id:'CCP-1020',customer:'L. Carter',zip:'95628',routeId:'fair-oaks-carmichael',box:'Rancher Box',value:890,status:'confirmed',proteins:['beef','pork','chicken'],notes:'Large freezer. Likes roasts and ground beef.',phone:'916-555-0120',smsReady:true}
];

export const opsRoutes:OpsRoute[]=[
  {id:'roseville',name:'Roseville Route',day:'Wednesday',window:'2-6 PM',zips:['95661','95678'],status:'confirmed',capacity:12,reserved:9,driver:'Marco',priority:'Protect on-time delivery and call wholesale lead first.',learnings:['Roseville converts well on family boxes above $500.','Wholesale leads here need morning callbacks.','Customers respond to clear route confirmation texts.']},
  {id:'rocklin-lincoln',name:'Rocklin / Lincoln Route',day:'Thursday',window:'2-6 PM',zips:['95765','95677','95648'],status:'almost-full',capacity:12,reserved:10,driver:'Elena',priority:'Close two more reservations before dispatch.',learnings:['Route fills fastest when steak bundle CTA is shown.','Two-hour reminder texts reduce missed stops.','Premium steak buyers ask about ribeye and filet first.']},
  {id:'folsom-orangevale',name:'Folsom / Orangevale Route',day:'Friday',window:'2-6 PM',zips:['95630','95662'],status:'building',capacity:12,reserved:5,driver:'TBD',priority:'Group nearby waitlist leads before assigning driver.',learnings:['Starter boxes are better entry point in Folsom.','Food-security copy works for monthly freezer planning.','Route should not dispatch below seven grouped stops.']},
  {id:'fair-oaks-carmichael',name:'Fair Oaks / Carmichael Route',day:'Tuesday',window:'3-7 PM',zips:['95628','95608'],status:'confirmed',capacity:12,reserved:7,driver:'Marco',priority:'Add two family-box leads and confirm delivery notes.',learnings:['Customers prefer practical mixed protein boxes.','Route has good Tuesday availability.','Cheesecake offer gets replies but should be framed as a thank-you gift.']}
];

export const driverTurnIns:DriverTurnIn[]=[
  {id:'turnin-2026-06-05-roseville',routeId:'roseville',driver:'Marco',completed:8,missed:1,rescheduled:1,payments:'2 card links requested, 1 check collected',customerNotes:'One customer requested more sirloin next order. Wholesale catering lead asked for Monday callback.',ownerFollowup:'Call Golden Oak Catering and review missed stop reason.'},
  {id:'turnin-2026-06-04-rocklin',routeId:'rocklin-lincoln',driver:'Elena',completed:9,missed:0,rescheduled:1,payments:'All paid or card-ready',customerNotes:'Steak customers asked for ribeye bundle pricing.',ownerFollowup:'Create ribeye bundle CTA for Rocklin and Lincoln.'}
];

export const dailyReport={
  date:'2026-06-06',
  revenueScheduled:3750,
  activeOrders:opsOrders.length,
  hotLeads:3,
  wholesaleLeads:1,
  giveawayEntries:0,
  routeRisk:'Folsom / Orangevale needs two more grouped leads before it should dispatch.',
  ownerFocus:['Call Golden Oak Catering','Close Rocklin / Lincoln route gap','Send route confirmation texts','Review driver turn-ins before end of day']
};

export function routeFill(route:OpsRoute){return Math.round((route.reserved/route.capacity)*100);}

export function ordersForRoute(routeId:string){return opsOrders.filter(order=>order.routeId===routeId);}

export function routeByZip(zip:string){return opsRoutes.find(route=>route.zips.includes(zip));}

export function ownerSnapshot(){
  return {
    dailyReport,
    routes:opsRoutes.map(route=>({...route,fill:routeFill(route),orders:ordersForRoute(route.id)})),
    orders:opsOrders,
    turnIns:driverTurnIns,
    routeLearningNotes:opsRoutes.flatMap(route=>route.learnings.map(note=>({route:route.name,note})))
  };
}

export function driverSnapshot(driver='Marco'){
  const routes=opsRoutes.filter(route=>route.driver===driver||route.driver==='TBD');
  return {driver,routes:routes.map(route=>({...route,fill:routeFill(route),orders:ordersForRoute(route.id)})),turnIns:driverTurnIns.filter(turnIn=>turnIn.driver===driver)};
}

export function customerSnapshot(zip='95661'){
  const route=routeByZip(zip)||opsRoutes[0];
  return {zip,route:{...route,fill:routeFill(route)},recommendedBoxes:['Starter Box','Family Box','Rancher Box','Premium Owner Box'],promo:{code:'CHEESECAKE-48',deadlineHours:48},giveaway:{entryPath:'/giveaway',purchaseRequired:false,purchaseImprovesOdds:false}};
}
