import {NextResponse} from 'next/server';
import {summarizeCustomerOperations,customerOperationsContext} from '../../../lib/customer-operations';

function accessRole(request:Request){
  const cookie=request.headers.get('cookie')||'';
  return cookie.match(/(?:^|; )ccp_access=([^;]+)/)?.[1]||'';
}

type FlowCheck={
  area:string;
  start:string;
  next:string;
  backend:string;
  ownerLoop:string;
  status:'complete'|'watch'|'blocked';
  notes:string;
};

const checks:FlowCheck[]=[
  {
    area:'Public Home',
    start:'Homepage hero, ZIP check, box sections, quote request',
    next:'CustomerAccountJourney or customer help page',
    backend:'/api/customer-account and /api/customer-intake',
    ownerLoop:'Customer operations, order lead, owner customer ops, owner context',
    status:'complete',
    notes:'Public conversion path is live and avoids internal language.',
  },
  {
    area:'Customer Quote',
    start:'CustomerAccountJourney submit',
    next:'Success next-step card, customer portal, giveaway, ZIP check',
    backend:'/api/customer-intake creates order lead and quote request',
    ownerLoop:'Quote request becomes customer operation and internal board-ready item',
    status:'complete',
    notes:'Quote requests are owner-reviewable and recursive.',
  },
  {
    area:'Customer Rating',
    start:'CustomerServiceRating submit',
    next:'Recovery, testimonial, reorder, or restock follow-up',
    backend:'/api/customer-rating creates customer operations',
    ownerLoop:'Low ratings create recovery; excellent ratings create testimonial candidate',
    status:'complete',
    notes:'Rating loop feeds owner context and customer operations.',
  },
  {
    area:'Owner Command',
    start:'Owner dashboard',
    next:'Sales-to-delivery, customer ops, work queues, daily closeout',
    backend:'/api/customer-operations and /api/internal-board',
    ownerLoop:'Owner AI receives customerOperationsContext',
    status:'complete',
    notes:'Owner has recursive customer signals in panels and context.',
  },
  {
    area:'Driver Execution',
    start:'Driver task inbox and route execution panel',
    next:'Started, completed, blocked, customer not home, payment, restock',
    backend:'/api/internal-board',
    ownerLoop:'Driver notes return to owner queues and closeout',
    status:'complete',
    notes:'Driver execution loop exists through internal board.',
  },
  {
    area:'Customer Approved Messages',
    start:'Owner-approved customer messages',
    next:'Customer portal message history and delivery status',
    backend:'/api/internal-board',
    ownerLoop:'Messages are owner-approved before customer-visible history',
    status:'complete',
    notes:'Customer-safe messaging has an approval boundary.',
  },
  {
    area:'Persistence Boundary',
    start:'In-process customer operations and live app database',
    next:'Postgres migration later',
    backend:'globalThis memory now; PostgreSQL needed for durable production persistence',
    ownerLoop:'Owner loop works in app runtime; deploy-safe durability is next backend phase',
    status:'watch',
    notes:'This is the main long-term backend hardening item.',
  },
];

export async function GET(request:Request){
  const role=accessRole(request);
  if(role!=='owner')return NextResponse.json({ok:false,message:'Owner access required'},{status:401});
  const summary=summarizeCustomerOperations();
  const context=customerOperationsContext();
  const complete=checks.filter(item=>item.status==='complete').length;
  const watch=checks.filter(item=>item.status==='watch').length;
  const blocked=checks.filter(item=>item.status==='blocked').length;

  return NextResponse.json({
    ok:true,
    generatedAt:new Date().toISOString(),
    summary:{complete,watch,blocked,total:checks.length},
    customerOperations:summary,
    recursiveLoop:context.recursiveLoop,
    checks,
  });
}
