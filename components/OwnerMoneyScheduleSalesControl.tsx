'use client';

import {useEffect,useMemo,useState} from 'react';

type BoardRecord={
  id:string;
  audience:string;
  subject:string;
  body:string;
  status:string;
  priority:string;
  routeId?:string;
  orderId?:string;
  source?:string;
  aiApproved?:boolean;
  metadata?:Record<string,any>;
  createdAt?:string;
  updatedAt?:string;
  contextTrust?:any;
};

type Props={
  snapshot:Record<string,any>;
};

function money(value:number){
  return new Intl.NumberFormat('en-US',{
    style:'currency',
    currency:'USD',
    maximumFractionDigits:0,
  }).format(value||0);
}

function lower(value:any){
  return String(value||'').toLowerCase();
}

function openBoard(records:BoardRecord[]){
  return records.filter(record=>record.status!=='closed');
}

function actionType(record:BoardRecord){
  return lower(record.metadata?.reviewAction||record.source||record.subject);
}

function hasText(record:BoardRecord,words:string[]){
  const text=lower(`${record.subject} ${record.body} ${record.source} ${record.metadata?.reviewAction||''}`);
  return words.some(word=>text.includes(word));
}

function today(){
  return new Date().toISOString().slice(0,10);
}

function todayRecord(record:any){
  return String(record?.updatedAt||record?.createdAt||record?.deliveryDate||'').startsWith(today());
}

function statusIn(item:any,statuses:string[]){
  return statuses.includes(lower(item?.status));
}

function fulfillmentIn(item:any,statuses:string[]){
  return statuses.includes(lower(item?.fulfillment));
}

function pct(part:number,total:number){
  if(!total)return 0;
  return Math.round((part/total)*100);
}

function lineItems(title:string,value:number|string,action:string,href:string){
  return {title,value,action,href};
}

export default function OwnerMoneyScheduleSalesControl({snapshot}:Props){
  const [records,setRecords]=useState<BoardRecord[]>([]);
  const [status,setStatus]=useState('Loading owner control records...');

  useEffect(()=>{
    let active=true;
    fetch('/api/internal-board',{credentials:'same-origin'})
      .then(response=>response.json())
      .then(result=>{
        if(!active)return;
        setRecords(result?.records||[]);
        setStatus(result?.ok?`Board records loaded from ${result.storage||'working memory'}.`:result?.message||'Internal board unavailable.');
      })
      .catch(()=>{
        if(active)setStatus('Internal board unavailable from this device.');
      });
    return()=>{active=false};
  },[]);

  const db=snapshot.database||{};
  const report=snapshot.ownerReport||{};
  const orders=db.orders||[];
  const driverUpdates=db.driverUpdates||[];
  const restock=db.restockIssues||[];
  const leads=db.driverSalesLeads||[];
  const learning=db.learningEvents||[];
  const boardOpen=openBoard(records);

  const model=useMemo(()=>{
    const delivered=orders.filter((order:any)=>statusIn(order,['delivered']));
    const cancelled=orders.filter((order:any)=>statusIn(order,['cancelled']));
    const openOrders=orders.filter((order:any)=>!statusIn(order,['delivered','cancelled']));
    const partialOrders=orders.filter((order:any)=>statusIn(order,['partially-fulfilled'])||fulfillmentIn(order,['partial','restock-blocked']));
    const scheduled=orders.filter((order:any)=>statusIn(order,['scheduled','packed','loaded','out-for-delivery']));
    const requested=orders.filter((order:any)=>statusIn(order,['lead','quoted','ordered']));
    const paidToday=orders.filter((order:any)=>statusIn(order,['paid','delivered'])&&todayRecord(order));
    const disputed=boardOpen.filter(record=>hasText(record,['dispute','disputed','chargeback','refund']));
    const receiptsNeeded=boardOpen.filter(record=>hasText(record,['receipt','paid today','payment received']));
    const customerReplies=boardOpen.filter(record=>hasText(record,['customer-reply','customer reply','reply draft']));
    const driverTasks=boardOpen.filter(record=>record.audience==='driver'||hasText(record,['driver-task','driver task']));
    const followUps=boardOpen.filter(record=>hasText(record,['follow-up','follow up','call','text']));
    const urgent=boardOpen.filter(record=>record.priority==='urgent'||record.priority==='high');
    const hotLeads=leads.filter((lead:any)=>lead.temperature==='hot'||lead.status==='reserved');
    const warmLeads=leads.filter((lead:any)=>lead.temperature==='warm'||lead.status==='pitched'||lead.status==='queued');
    const routeIssues=driverUpdates.filter((update:any)=>update.partialReason||update.restockIssue||statusIn(update,['issue','partially-fulfilled','restock-needed']));
    const noAnswer=driverUpdates.filter((update:any)=>lower(update.customerNotes).includes('no answer')||lower(update.customerNotes).includes('no-answer'));
    const highDemandZips=[...new Set([...orders.map((order:any)=>order.zip).filter(Boolean),...leads.map((lead:any)=>lead.zip).filter(Boolean)])].slice(0,8);

    return {
      delivered,
      cancelled,
      openOrders,
      partialOrders,
      scheduled,
      requested,
      paidToday,
      disputed,
      receiptsNeeded,
      customerReplies,
      driverTasks,
      followUps,
      urgent,
      hotLeads,
      warmLeads,
      routeIssues,
      noAnswer,
      highDemandZips,
      revenue:Number(report.revenue||0),
      profit:Number(report.estimatedProfit||0),
      margin:Number(report.margin||0),
      openRevenue:openOrders.reduce((sum:number,order:any)=>sum+Number(order.value||0),0),
      unpaidRevenue:openOrders.reduce((sum:number,order:any)=>sum+Number(order.value||0),0),
      paidTodayValue:paidToday.reduce((sum:number,order:any)=>sum+Number(order.value||0),0),
      restockValue:restock.length,
      learningCount:learning.length,
    };
  },[orders,driverUpdates,restock.length,leads,learning.length,records]);

  const billingCards=[
    lineItems('Open Invoices',model.openOrders.length,'Collect, receipt, dispute, or follow up.','#owner-work-queues'),
    lineItems('Open Revenue',money(model.openRevenue),'Prioritize money that can be collected today.','#owner-ai'),
    lineItems('Paid Today',money(model.paidTodayValue),'Send receipts and close paid records.','#owner-work-queues'),
    lineItems('Partial Payments',model.partialOrders.length,'Review partial fulfillment or partial payment risk.','#needs-review'),
    lineItems('Disputed',model.disputed.length,'Escalate disputes before delivery promises.','#owner-work-queues'),
    lineItems('Receipts Needed',model.receiptsNeeded.length,'Approve and send receipt records.','#owner-work-queues'),
  ];

  const scheduleCards=[
    lineItems('Requested',model.requested.length,'Confirm or decline requested delivery promises.','#needs-review'),
    lineItems('Confirmed / Active',model.scheduled.length,'Check driver coverage and route safety.','#owner-work-queues'),
    lineItems('Needs Driver',model.scheduled.filter((order:any)=>!order.driver).length,'Assign driver task or route owner.','#owner-work-queues'),
    lineItems('Reschedule Needed',model.followUps.filter(record=>hasText(record,['reschedule','missed'])).length,'Create customer reply and driver task.','#owner-work-queues'),
    lineItems('Completed Today',model.delivered.filter(todayRecord).length,'Close records and capture learning.','#owner-report'),
    lineItems('Cancelled',model.cancelled.length,'Archive or follow up if customer can be saved.','#owner-work-queues'),
  ];

  const salesCards=[
    lineItems('Hot Leads',model.hotLeads.length,'Call highest-value buyers first.','#owner-ai'),
    lineItems('Warm Leads',model.warmLeads.length,'Create follow-up sequence.','#owner-ai'),
    lineItems('Driver Sales Leads',leads.length,'Convert route opportunities into quotes.','#owner-report'),
    lineItems('Customer Follow-Ups',model.followUps.length,'Call, text, invoice, or schedule.','#owner-work-queues'),
    lineItems('High-Value ZIPs',model.highDemandZips.length,'Protect capacity and route economics.','#owner-ai'),
    lineItems('No Answer Stops',model.noAnswer.length,'Create customer reply or reschedule task.','#owner-work-queues'),
  ];

  const inventoryCards=[
    lineItems('Restock Risks',restock.length,'Buy before promising more boxes.','#owner-report'),
    lineItems('Driver Shortages',driverUpdates.filter((update:any)=>update.restockIssue).length,'Convert shortage notes into restock tasks.','#owner-work-queues'),
    lineItems('Partial Delivery Causes',model.partialOrders.length,'Fix promise gaps before new orders.','#needs-review'),
    lineItems('Customer Requested Items',orders.filter((order:any)=>order.products?.length).length,'Use order products to forecast demand.','#owner-report'),
    lineItems('Supplier Notes Needed',restock.filter((item:any)=>lower(item.action).includes('supplier')).length,'Create supplier follow-up records.','#owner-work-queues'),
    lineItems('High Demand ZIPs',model.highDemandZips.join(', ')||'None yet','Use demand clusters to plan routes.','#owner-ai'),
  ];

  const closeout=[
    {label:'Open review items',value:model.urgent.length+model.followUps.length},
    {label:'Open driver tasks',value:model.driverTasks.length},
    {label:'Open customer replies',value:model.customerReplies.length},
    {label:'Unpaid revenue',value:money(model.unpaidRevenue)},
    {label:'Route issues',value:model.routeIssues.length},
    {label:'Restock blockers',value:restock.length},
    {label:'Hot leads not contacted',value:model.hotLeads.length},
    {label:'Learning records',value:model.learningCount},
  ];

  const truthLevels=[
    {label:'Needs Review',value:records.filter(record=>record.contextTrust?.truthLevel==='pending-review').length},
    {label:'AI Suggested',value:records.filter(record=>record.contextTrust?.truthLevel==='inferred').length},
    {label:'Working Memory',value:records.filter(record=>record.contextTrust?.truthLevel==='working').length},
    {label:'Owner Decision',value:records.filter(record=>record.contextTrust?.source==='owner-override'||hasText(record,['owner decision'])).length},
    {label:'Customer Approved',value:records.filter(record=>record.audience==='customer-approved'||record.aiApproved).length},
    {label:'Driver Note',value:records.filter(record=>record.contextTrust?.source==='driver-note'||record.audience==='driver').length},
  ];

  const prompts=[
    'What money do I need to collect today?',
    'Which deliveries are not safe to promise yet?',
    'Which customers need a reply right now?',
    'Which driver tasks are still open?',
    'What inventory do I need before selling more?',
    'Which hot leads should I call first?',
    'What can I close before the end of the day?',
    'Summarize today like an owner report.',
  ];

  return (
    <section className="section money-schedule-sales" id="money-schedule-sales">
      <div className="mss-hero">
        <div>
          <p className="eyebrow">Owner Money + Schedule + Sales</p>
          <h2>Run cash, delivery promises, sales, and inventory from one control layer.</h2>
          <p>{status}</p>
        </div>
        <div className="mss-score">
          <span>Revenue <b>{money(model.revenue)}</b></span>
          <span>Profit <b>{money(model.profit)}</b></span>
          <span>Margin <b>{model.margin}%</b></span>
          <span>Open Cash <b>{money(model.openRevenue)}</b></span>
        </div>
      </div>

      <div className="mss-grid">
        <ControlPanel title="Billing Control Panel" subtitle="Money to collect, receipts to send, and invoice risk." cards={billingCards}/>
        <ControlPanel title="Appointment Control Panel" subtitle="Delivery promises, reschedules, driver coverage, and completed stops." cards={scheduleCards}/>
        <ControlPanel title="Sales Pipeline Board" subtitle="Hot buyers, driver leads, high-value ZIPs, and follow-up opportunities." cards={salesCards}/>
        <ControlPanel title="Inventory + Restock Control" subtitle="Shortages, partial fulfillment causes, demand signals, and purchase priorities." cards={inventoryCards}/>
      </div>

      <div className="mss-bottom-grid">
        <article className="mss-closeout">
          <p className="eyebrow">Owner Closeout Report</p>
          <h3>Before ending the day, close or assign these.</h3>
          <div>
            {closeout.map(item=>(
              <span key={item.label}>{item.label}<b>{item.value}</b></span>
            ))}
          </div>
        </article>

        <article className="mss-truth">
          <p className="eyebrow">Trust + Truth Upgrade Panel</p>
          <h3>Separate suggestions from owner-approved truth.</h3>
          <div>
            {truthLevels.map(item=>(
              <span key={item.label}>{item.label}<b>{item.value}</b></span>
            ))}
          </div>
        </article>

        <article className="mss-prompts">
          <p className="eyebrow">Owner AI Prompt Sidebar</p>
          <h3>Ask the business what to do next.</h3>
          <div>
            {prompts.map(prompt=><a href="#owner-ai" key={prompt}>{prompt}</a>)}
          </div>
        </article>
      </div>

      <style>{`
        .money-schedule-sales{border:1px solid rgba(248,231,176,.22);border-radius:30px;background:radial-gradient(circle at top right,rgba(212,175,55,.14),transparent 34%),linear-gradient(135deg,#080503,#020202);padding:20px}
        .mss-hero{display:grid;grid-template-columns:1fr 360px;gap:16px;align-items:start;margin-bottom:16px}
        .mss-hero h2,.mss-closeout h3,.mss-truth h3,.mss-prompts h3,.mss-panel h3{color:#f8e7b0;margin:.25rem 0}
        .mss-hero p,.mss-panel p,.mss-closeout p,.mss-truth p,.mss-prompts p{color:#ded2bd}
        .mss-score{display:grid;gap:8px}
        .mss-score span,.mss-closeout span,.mss-truth span{display:flex;justify-content:space-between;gap:12px;border:1px solid rgba(212,175,55,.22);border-radius:16px;background:#050403;color:#ded2bd;padding:10px}
        .mss-score b,.mss-closeout b,.mss-truth b{color:#f8e7b0}
        .mss-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
        .mss-panel{border:1px solid rgba(248,231,176,.18);border-radius:24px;background:#050403;padding:14px}
        .mss-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:12px}
        .mss-card{border:1px solid rgba(248,231,176,.15);border-radius:18px;background:linear-gradient(180deg,#100904,#060403);padding:12px;text-decoration:none;color:#fff7ed;min-height:125px;display:flex;flex-direction:column;justify-content:space-between}
        .mss-card small{color:#d4af37;font-weight:900}
        .mss-card strong{font-size:1.55rem;color:#f8e7b0}
        .mss-card p{margin:0;color:#ded2bd}
        .mss-bottom-grid{display:grid;grid-template-columns:1fr 1fr 1.2fr;gap:14px;margin-top:14px}
        .mss-closeout,.mss-truth,.mss-prompts{border:1px solid rgba(248,231,176,.18);border-radius:24px;background:#050403;padding:14px}
        .mss-closeout div,.mss-truth div{display:grid;gap:8px;margin-top:12px}
        .mss-prompts div{display:flex;flex-wrap:wrap;gap:9px;margin-top:12px}
        .mss-prompts a{border:1px solid rgba(212,175,55,.32);border-radius:999px;background:#0b0704;color:#fff7ed;text-decoration:none;padding:9px 12px;font-weight:800}
        @media(max-width:1100px){.mss-hero,.mss-grid,.mss-bottom-grid{grid-template-columns:1fr}}
        @media(max-width:620px){.money-schedule-sales{padding:12px;border-radius:22px}.mss-cards{grid-template-columns:1fr}}
      `}</style>
    </section>
  );
}

function ControlPanel({title,subtitle,cards}:{title:string;subtitle:string;cards:{title:string;value:number|string;action:string;href:string}[]}){
  return (
    <article className="mss-panel">
      <p className="eyebrow">{title}</p>
      <h3>{subtitle}</h3>
      <div className="mss-cards">
        {cards.map(card=>(
          <a className="mss-card" href={card.href} key={`${title}-${card.title}`}>
            <small>{card.title}</small>
            <strong>{card.value}</strong>
            <p>{card.action}</p>
          </a>
        ))}
      </div>
    </article>
  );
}
