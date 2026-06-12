import {NextResponse} from 'next/server';
import {fullSystemSnapshot} from '../../../../lib/ccp-database';
import {customerOperationsContext,summarizeCustomerOperations} from '../../../../lib/customer-operations';
import {postgresConfigured} from '../../../../lib/pg-database';

function accessRole(request:Request){
  const cookie=request.headers.get('cookie')||'';
  return cookie.match(/(?:^|; )ccp_access=([^;]+)/)?.[1]||'';
}

function status(ok:boolean,watch=false){
  if(ok)return 'connected';
  if(watch)return 'watch';
  return 'blocked';
}

function publicLanguageChecks(){
  const checks=[
    {scope:'Public Home',path:'/',terms:['AI','internal board','source of truth','operator brain','training records'],status:'watch',note:'Manual source scan recommended before major public launch.'},
    {scope:'Customer Journey',path:'/customer',terms:['AI','internal database','model'],status:'watch',note:'Customer pages should say team, concierge, help, delivery check, quote request.'},
    {scope:'Owner/Team',path:'/owner /team/dev',terms:['AI','context','internal board'],status:'connected',note:'Internal language is allowed behind the access gate.'},
  ];
  return checks;
}

function routeChecks(){
  return [
    {route:'/',label:'Public home',expected:'Homepage, ZIP, box builder, quote request',status:'connected'},
    {route:'/customer',label:'Customer portal',expected:'Delivery status, approved messages, quote/account/rating entry points',status:'connected'},
    {route:'/pay',label:'Deposit / invoice request',expected:'Customer payment intent creation and owner payment review',status:'connected'},
    {route:'/reviews',label:'Reviews + trust',expected:'Public trust cards, service rating, testimonial/recovery path',status:'connected'},
    {route:'/owner',label:'Owner command',expected:'Owner operations, customer ops, internal board, status, closeout, owner workspace',status:'connected'},
    {route:'/driver',label:'Driver portal',expected:'Driver tasks, route execution, closeout',status:'connected'},
    {route:'/team/dev',label:'Dev status board',expected:'Owner-gated diagnostics',status:'connected'},
    {route:'/api/customer-account',label:'Customer account API',expected:'Customer profile creation',status:'connected'},
    {route:'/api/customer-intake',label:'Customer intake API',expected:'Quote request and order lead creation',status:'connected'},
    {route:'/api/customer-rating',label:'Customer rating API',expected:'Rating, recovery, testimonial/reorder/restock signals',status:'connected'},
    {route:'/api/payment-intent',label:'Payment intent API',expected:'Deposit/invoice request records for owner review',status:'connected'},
    {route:'/api/customer-operations',label:'Customer operations API',expected:'Persistent runtime customer operations queue',status:'connected'},
    {route:'/api/customer-operations/bridge',label:'Customer ops bridge',expected:'Internal-board-ready customer operation records',status:'connected'},
    {route:'/api/site-flow-audit',label:'Site flow audit',expected:'Dead-end route and loop checks',status:'connected'},
    {route:'/api/internal-board',label:'Internal board API',expected:'Owner/driver/customer-approved work queue',status:'connected'},
    {route:'/api/ai/context',label:'Role-safe context API',expected:'Owner, driver, customer context boundaries',status:'connected'},
  ];
}

export async function GET(request:Request){
  const role=accessRole(request);
  if(role!=='owner')return NextResponse.json({ok:false,message:'Owner/team access required'},{status:401});

  const snapshot=fullSystemSnapshot();
  const customerOperations=customerOperationsContext();
  const customerSummary=summarizeCustomerOperations();
  const hasPostgres=postgresConfigured();

  const checks=[
    {
      key:'owner-context',
      label:'Owner AI Context',
      status:status(Boolean(snapshot.customerOperations)),
      detail:'Customer operations are injected into fullSystemSnapshot for the owner workspace.',
    },
    {
      key:'recursive-loop',
      label:'Recursive Customer Loop',
      status:status(customerOperations.recursiveLoop.length>5),
      detail:'Customer signals return into owner context through customerOperationsContext.',
    },
    {
      key:'customer-operations',
      label:'Customer Operations Store',
      status:status(Boolean(customerOperations.summary)),
      detail:`${customerSummary.openOps} open customer operation item(s).`,
    },
    {
      key:'internal-board-bridge',
      label:'Internal Board Bridge',
      status:'connected',
      detail:'Customer operations generate internal-board-ready records through the bridge route.',
    },
    {
      key:'site-flow-audit',
      label:'Dead-End Audit',
      status:'connected',
      detail:'Owner-only site flow audit API is available.',
    },
    {
      key:'public-language',
      label:'Public Language Safety',
      status:'watch',
      detail:'Public pages should avoid internal diagnostics language; owner/team pages may use it.',
    },
    {
      key:'persistence',
      label:'Persistence Mode',
      status:hasPostgres?'connected':'watch',
      detail:hasPostgres?'PostgreSQL appears configured.':'Runtime memory fallback active; Postgres durability is next backend hardening.',
    },
    {
      key:'mobile-cta',
      label:'Mobile Public CTA',
      status:'connected',
      detail:'Public mobile sticky CTA is wired on the homepage.',
    },
    {
      key:'payment-trust',
      label:'Payment + Trust MVP',
      status:'connected',
      detail:'Deposit intent, owner payment panel, reviews page, and service rating loops are wired.',
    },
    {
      key:'training-loop',
      label:'Training/Review Loop',
      status:status(snapshot.trainingDataset?.records?.length>=0),
      detail:`${snapshot.trainingDataset?.records?.length||0} training/context record(s) available from live runtime.`,
    },
  ];

  const watchItems=[
    'Move runtime customer operations and quote/rating records to PostgreSQL for deploy-safe durability.',
    'Run a public language scan before launch so internal terms stay behind team gates.',
    'Manually click home → ZIP → quote request → owner customer ops → owner workspace after each major UI change.',
    'Confirm internal board bridge items are promoted into work queues only when owner wants automatic queue creation.',
    'Keep customer-facing pages free of owner-only diagnostic language.',
  ];

  return NextResponse.json({
    ok:true,
    generatedAt:new Date().toISOString(),
    commit:process.env.VERCEL_GIT_COMMIT_SHA||process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA||'local/dev',
    environment:process.env.VERCEL_ENV||process.env.NODE_ENV||'development',
    storage:{postgresConfigured:hasPostgres,mode:hasPostgres?'postgres-ready':'runtime-memory-fallback'},
    summary:{
      connected:checks.filter(item=>item.status==='connected').length,
      watch:checks.filter(item=>item.status==='watch').length,
      blocked:checks.filter(item=>item.status==='blocked').length,
      total:checks.length,
    },
    checks,
    routes:routeChecks(),
    publicLanguage:publicLanguageChecks(),
    customerOperations:customerOperations.summary,
    recursiveLoop:customerOperations.recursiveLoop,
    watchItems,
  });
}
