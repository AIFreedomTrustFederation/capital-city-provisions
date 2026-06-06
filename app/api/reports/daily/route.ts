import { NextResponse } from 'next/server';
import { ownerSnapshot } from '../../../../lib/ops-memory';

export async function GET(){
  const memory=ownerSnapshot();
  const routeSummary=memory.routes.map(route=>({route:route.name,status:route.status,fill:route.fill,open:route.capacity-route.reserved,priority:route.priority}));
  return NextResponse.json({ok:true,date:memory.dailyReport.date,summary:{revenueScheduled:memory.dailyReport.revenueScheduled,activeOrders:memory.dailyReport.activeOrders,hotLeads:memory.dailyReport.hotLeads,wholesaleLeads:memory.dailyReport.wholesaleLeads,routeRisk:memory.dailyReport.routeRisk},routeSummary,ownerFocus:memory.dailyReport.ownerFocus,turnIns:memory.turnIns});
}
