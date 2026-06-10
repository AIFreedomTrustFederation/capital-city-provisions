export type OrderStatus='new'|'confirmed'|'loaded'|'out-for-delivery'|'delivered'|'issue'|'waitlist';
export type RouteStatus='confirmed'|'almost-full'|'building'|'waitlist';

export type OpsOrder={id:string;customer:string;zip:string;routeId:string;box:string;value:number;status:OrderStatus;proteins:string[];notes:string;phone:string;smsReady:boolean;promo?:string;};
export type OpsRoute={id:string;name:string;day:string;window:string;zips:string[];status:RouteStatus;capacity:number;reserved:number;driver:string;priority:string;learnings:string[];orders?:OpsOrder[];};
export type DriverTurnIn={id:string;routeId:string;driver:string;completed:number;missed:number;rescheduled:number;payments:string;customerNotes:string;ownerFollowup:string;};

export const opsOrders:OpsOrder[]=[];
export const opsRoutes:OpsRoute[]=[];
export const driverTurnIns:DriverTurnIn[]=[];

export const dailyReport={date:new Date().toISOString().slice(0,10),revenueScheduled:0,activeOrders:0,hotLeads:0,wholesaleLeads:0,giveawayEntries:0,routeRisk:'No live route data yet.',ownerFocus:['Review live customer intake as it arrives']};

export function routeFill(route:OpsRoute){return Math.round((route.reserved/Math.max(route.capacity,1))*100);}
export function ordersForRoute(routeId:string){return opsOrders.filter(order=>order.routeId===routeId);}
export function routeByZip(zip:string){return opsRoutes.find(route=>route.zips.includes(zip));}

export function customerSnapshot(zip=''){
  return {mode:'live',zip,routes:[],orders:[],availableRoute:null,message:'No live customer route data yet. Real route availability appears after owner-created orders and routes are connected.'};
}

export function driverSnapshot(driver='Driver'){
  return {mode:'live',driver,routes:[],turnIns:[],message:'No live driver route data yet. Driver boards populate from the owner dashboard live source of truth.'};
}

export function ownerSnapshot(){
  return {mode:'live',routes:[],orders:[],turnIns:[],dailyReport,message:'Owner dashboard is the live source of truth. No seeded demo data is loaded.'};
}
