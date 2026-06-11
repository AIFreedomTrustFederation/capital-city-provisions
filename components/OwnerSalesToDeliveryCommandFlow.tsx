'use client';

import {useMemo,useState} from 'react';

type Props={
  snapshot:Record<string,any>;
};

type FlowAction='quote'|'invoice'|'appointment'|'driver-task'|'customer-reply'|'owner-decision';

type FormState={
  customer:string;
  email:string;
  phone:string;
  zip:string;
  box:string;
  proteins:string;
  value:string;
  routeId:string;
  driver:string;
  note:string;
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

function today(){
  return new Date().toISOString().slice(0,10);
}

function defaultForm():FormState{
  return {
    customer:'',
    email:'',
    phone:'',
    zip:'',
    box:'Premium Freezer Box',
    proteins:'Prime beef, chicken, pork, seafood',
    value:'497',
    routeId:'owner-intake',
    driver:'',
    note:'',
  };
}

function actionSubject(action:FlowAction,form:FormState){
  const name=form.customer||'New Customer';
  if(action==='quote')return `Quote Draft: ${name}`;
  if(action==='invoice')return `Invoice Draft: ${name}`;
  if(action==='appointment')return `Delivery Appointment: ${name}`;
  if(action==='driver-task')return `Driver Assignment: ${name}`;
  if(action==='customer-reply')return `Customer Confirmation Draft: ${name}`;
  return `Owner Decision: Sales Flow for ${name}`;
}

function actionBody(action:FlowAction,form:FormState){
  const base=[
    `Customer: ${form.customer||'New Customer'}`,
    `Email: ${form.email||'not provided'}`,
    `Phone: ${form.phone||'not provided'}`,
    `ZIP: ${form.zip||'not provided'}`,
    `Box: ${form.box}`,
    `Proteins: ${form.proteins}`,
    `Estimated Value: ${form.value||'0'}`,
    `Route: ${form.routeId||'owner-intake'}`,
    `Driver: ${form.driver||'not assigned'}`,
    `Owner Note: ${form.note||'none'}`,
  ].join('\n');

  if(action==='quote')return `${base}\n\nBuild a customer quote from this lead and prepare it for owner review.`;
  if(action==='invoice')return `${base}\n\nCreate an invoice draft from this quote. Do not treat as paid until owner records payment.`;
  if(action==='appointment')return `${base}\n\nSchedule delivery after owner confirms quote/payment safety.`;
  if(action==='driver-task')return `${base}\n\nCreate a driver task for route assignment, delivery instructions, payment notes, and restock warnings.`;
  if(action==='customer-reply')return `${base}\n\nDraft a customer-facing confirmation message. Owner approval required before customer use.`;
  return `${base}\n\nOwner confirmed this sales-to-delivery flow step as an owner decision.`;
}

function actionAudience(action:FlowAction){
  if(action==='driver-task')return 'driver';
  return 'owner';
}

function actionPriority(action:FlowAction){
  if(action==='invoice'||action==='appointment'||action==='driver-task')return 'high';
  return 'normal';
}

function actionReviewLabel(action:FlowAction){
  if(action==='quote')return 'quote';
  if(action==='invoice')return 'invoice';
  if(action==='appointment')return 'appointment';
  if(action==='driver-task')return 'driver-task';
  if(action==='customer-reply')return 'customer-reply';
  return 'confirm';
}

function safeNumber(value:any){
  const n=Number(value||0);
  return Number.isFinite(n)?n:0;
}

export default function OwnerSalesToDeliveryCommandFlow({snapshot}:Props){
  const db=snapshot.database||{};
  const orders=db.orders||[];
  const leads=db.driverSalesLeads||[];
  const restock=db.restockIssues||[];
  const driverUpdates=db.driverUpdates||[];
  const report=snapshot.ownerReport||{};

  const [form,setForm]=useState<FormState>(defaultForm());
  const [status,setStatus]=useState('Ready to turn leads into paid deliveries.');
  const [busy,setBusy]=useState('');

  const model=useMemo(()=>{
    const newLeads=leads.filter((lead:any)=>['queued','pitched','reserved'].includes(lower(lead.status)));
    const quoteNeeded=orders.filter((order:any)=>['lead','quoted'].includes(lower(order.status)));
    const invoiceNeeded=orders.filter((order:any)=>['ordered','scheduled'].includes(lower(order.status)));
    const paymentNeeded=orders.filter((order:any)=>!['paid','delivered','cancelled'].includes(lower(order.status)));
    const deliveryNeeded=orders.filter((order:any)=>['paid','scheduled','packed','loaded'].includes(lower(order.status)));
    const driverNeeded=orders.filter((order:any)=>['scheduled','packed','loaded','out-for-delivery'].includes(lower(order.status))&&!order.driver);
    const customerReplyNeeded=driverUpdates.filter((update:any)=>update.customerNotes||update.partialReason||update.restockIssue);
    const closed=orders.filter((order:any)=>['delivered','cancelled'].includes(lower(order.status)));

    const routeRisk=driverUpdates.filter((update:any)=>update.partialReason||update.restockIssue||['issue','partially-fulfilled','restock-needed'].includes(lower(update.status))).length;
    const restockRisk=restock.length;
    const paymentRisk=paymentNeeded.length;
    const promiseSafe=routeRisk===0&&restockRisk===0&&paymentRisk===0;

    return {
      newLeads,
      quoteNeeded,
      invoiceNeeded,
      paymentNeeded,
      deliveryNeeded,
      driverNeeded,
      customerReplyNeeded,
      closed,
      routeRisk,
      restockRisk,
      paymentRisk,
      promiseSafe,
      revenue:safeNumber(report.revenue),
      profit:safeNumber(report.estimatedProfit),
      margin:safeNumber(report.margin),
    };
  },[orders,leads,restock.length,driverUpdates,report]);

  const pipeline=[
    {label:'New Leads',count:model.newLeads.length,action:'Build box quote and owner-approved reply.'},
    {label:'Quotes Needed',count:model.quoteNeeded.length,action:'Turn interest into a priced freezer box offer.'},
    {label:'Invoices Needed',count:model.invoiceNeeded.length,action:'Create invoice drafts from approved quotes.'},
    {label:'Payment Needed',count:model.paymentNeeded.length,action:'Collect before promising delivery.'},
    {label:'Delivery Needed',count:model.deliveryNeeded.length,action:'Schedule and confirm the delivery promise.'},
    {label:'Driver Needed',count:model.driverNeeded.length,action:'Assign a driver task with route and customer notes.'},
    {label:'Customer Reply Needed',count:model.customerReplyNeeded.length,action:'Draft a customer-safe approved message.'},
    {label:'Closed / Delivered',count:model.closed.length,action:'Archive and capture the learning.'},
  ];

  const boxes=[
    {name:'Starter Family Box',price:297,best:'New families testing premium meat delivery',mix:'Ground beef, chicken, pork basics',risk:'Low promise risk when common inventory is available'},
    {name:'Premium Steak Box',price:497,best:'Steak buyers and high-margin upgrades',mix:'Prime steaks, roasts, burger, specialty cuts',risk:'Check steak inventory before promising exact cuts'},
    {name:'Monthly Restock Box',price:397,best:'Recurring household buyers',mix:'Balanced beef, chicken, pork, seafood',risk:'Best sold with route capacity confirmed'},
    {name:'Freezer Fill-Up Box',price:997,best:'Freezer program and large-family buyers',mix:'Bulk premium proteins and restock plan',risk:'Confirm freezer space, delivery window, and payment first'},
    {name:'Wholesale Trial Box',price:1497,best:'Restaurants, churches, events, and bulk accounts',mix:'Chef-friendly bulk case mix',risk:'Confirm supplier and route before quote approval'},
  ];

  const promise=[
    {label:'Safe to Promise',value:model.promiseSafe?'Yes':'No',detail:model.promiseSafe?'No active payment, route, or restock blockers detected.':'One or more blockers need owner review.'},
    {label:'Restock Risk',value:model.restockRisk,detail:'Inventory blockers before selling more boxes.'},
    {label:'Route Risk',value:model.routeRisk,detail:'Missed, partial, blocked, or restock-related route issues.'},
    {label:'Payment Risk',value:model.paymentRisk,detail:'Orders not yet paid, delivered, or cancelled.'},
    {label:'Driver Not Assigned',value:model.driverNeeded.length,detail:'Scheduled work that needs a driver task.'},
  ];

  const prompts=[
    'Build a quote for this customer.',
    'Turn this lead into an invoice.',
    'What can I safely promise today?',
    'Which boxes should I sell first?',
    'Which orders need payment before delivery?',
    'Which deliveries need driver assignment?',
    'Draft a customer confirmation.',
    'Close everything that is completed.',
  ];

  async function createBoardRecord(action:FlowAction){
    setBusy(action);
    setStatus(`Creating ${actionSubject(action,form)}...`);

    const payload={
      audience:actionAudience(action),
      subject:actionSubject(action,form),
      body:actionBody(action,form),
      status:'open',
      priority:actionPriority(action),
      routeId:form.routeId||'owner-intake',
      orderId:'',
      source:'sales-to-delivery-command-flow',
      aiApproved:false,
      customerName:form.customer,
      customerEmail:form.email,
      metadata:{
        reviewAction:actionReviewLabel(action),
        flowAction:action,
        customerName:form.customer,
        customerEmail:form.email,
        phone:form.phone,
        zip:form.zip,
        box:form.box,
        proteins:form.proteins,
        estimatedValue:safeNumber(form.value),
        routeId:form.routeId,
        driver:form.driver,
        ownerNote:form.note,
        createdFrom:'OwnerSalesToDeliveryCommandFlow',
        createdAt:today(),
      },
    };

    const result=await fetch('/api/internal-board',{
      method:'POST',
      credentials:'same-origin',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload),
    }).then(response=>response.json()).catch(()=>null);

    setBusy('');
    if(result?.ok){
      setStatus(`${actionSubject(action,form)} saved to the internal board.`);
    }else{
      setStatus(result?.message||'Could not save this flow action.');
    }
  }

  function updateForm(key:keyof FormState,value:string){
    setForm(current=>({...current,[key]:value}));
  }

  return (
    <section className="section sales-flow" id="sales-to-delivery-flow">
      <div className="sales-flow-hero">
        <div>
          <p className="eyebrow">Sales-to-Delivery Command Flow</p>
          <h2>Turn interest into quotes, invoices, appointments, driver tasks, and approved customer messages.</h2>
          <p>{status}</p>
        </div>
        <div className="sales-flow-score">
          <span>Revenue <b>{money(model.revenue)}</b></span>
          <span>Profit <b>{money(model.profit)}</b></span>
          <span>Margin <b>{model.margin}%</b></span>
          <span>Promise Safe <b>{model.promiseSafe?'Yes':'Needs Review'}</b></span>
        </div>
      </div>

      <div className="sales-flow-pipeline">
        {pipeline.map(step=>(
          <article key={step.label}>
            <small>{step.label}</small>
            <strong>{step.count}</strong>
            <p>{step.action}</p>
          </article>
        ))}
      </div>

      <div className="sales-flow-grid">
        <article className="quote-builder">
          <p className="eyebrow">Quote Builder Panel</p>
          <h3>Build the offer once, then create the next business record.</h3>

          <div className="quote-form">
            <label>Customer<input value={form.customer} onChange={event=>updateForm('customer',event.target.value)} placeholder="Customer name"/></label>
            <label>Email<input value={form.email} onChange={event=>updateForm('email',event.target.value)} placeholder="customer@email.com"/></label>
            <label>Phone<input value={form.phone} onChange={event=>updateForm('phone',event.target.value)} placeholder="Phone"/></label>
            <label>ZIP<input value={form.zip} onChange={event=>updateForm('zip',event.target.value)} placeholder="Delivery ZIP"/></label>
            <label>Box<input value={form.box} onChange={event=>updateForm('box',event.target.value)} placeholder="Box offer"/></label>
            <label>Proteins<input value={form.proteins} onChange={event=>updateForm('proteins',event.target.value)} placeholder="Protein mix"/></label>
            <label>Estimated Value<input value={form.value} onChange={event=>updateForm('value',event.target.value)} placeholder="497"/></label>
            <label>Route<input value={form.routeId} onChange={event=>updateForm('routeId',event.target.value)} placeholder="owner-intake"/></label>
            <label>Driver<input value={form.driver} onChange={event=>updateForm('driver',event.target.value)} placeholder="Driver name"/></label>
            <label className="wide">Owner Note<textarea value={form.note} onChange={event=>updateForm('note',event.target.value)} placeholder="Promise safety, inventory, payment, or delivery note."/></label>
          </div>

          <div className="quote-actions">
            <button disabled={busy==='quote'} onClick={()=>createBoardRecord('quote')}>Create Quote</button>
            <button disabled={busy==='invoice'} onClick={()=>createBoardRecord('invoice')}>Create Invoice Draft</button>
            <button disabled={busy==='appointment'} onClick={()=>createBoardRecord('appointment')}>Schedule Delivery</button>
            <button disabled={busy==='driver-task'} onClick={()=>createBoardRecord('driver-task')}>Assign Driver</button>
            <button disabled={busy==='customer-reply'} onClick={()=>createBoardRecord('customer-reply')}>Customer Reply</button>
            <button disabled={busy==='owner-decision'} onClick={()=>createBoardRecord('owner-decision')}>Save Owner Decision</button>
          </div>
        </article>

        <article className="promise-safety">
          <p className="eyebrow">Customer Promise Safety Check</p>
          <h3>Do not promise what the operation cannot safely deliver.</h3>
          <div>
            {promise.map(item=>(
              <span key={item.label}>
                <b>{item.label}</b>
                <strong>{item.value}</strong>
                <small>{item.detail}</small>
              </span>
            ))}
          </div>
        </article>
      </div>

      <div className="box-recommendations">
        <p className="eyebrow">Box Recommendation Cards</p>
        <h3>Fast owner offers for common buyer types.</h3>
        <div>
          {boxes.map(box=>(
            <article key={box.name}>
              <small>{box.name}</small>
              <strong>{money(box.price)}</strong>
              <p><b>Best for:</b> {box.best}</p>
              <p><b>Mix:</b> {box.mix}</p>
              <p><b>Risk:</b> {box.risk}</p>
              <button onClick={()=>{
                setForm(current=>({
                  ...current,
                  box:box.name,
                  value:String(box.price),
                  proteins:box.mix,
                  note:box.risk,
                }));
                setStatus(`${box.name} loaded into Quote Builder.`);
              }}>Use This Box</button>
            </article>
          ))}
        </div>
      </div>

      <div className="flow-bottom">
        <article>
          <p className="eyebrow">Driver Assignment Builder</p>
          <h3>Create field work from a scheduled delivery.</h3>
          <p>Attach route, order, customer note, payment note, and restock warning, then create a driver task from the quote builder.</p>
          <a href="#driver-task-inbox">View Driver Tasks</a>
        </article>

        <article>
          <p className="eyebrow">Customer Approved Message Composer</p>
          <h3>Draft the customer-safe message.</h3>
          <p>Create quote, invoice, payment reminder, delivery confirmation, reschedule, receipt, or thank-you messages for approval.</p>
          <a href="#customer-approved-messages">View Approved Messages</a>
        </article>

        <article>
          <p className="eyebrow">Closeout Automation Panel</p>
          <h3>Ask what can close now.</h3>
          <p>Paid invoices, completed driver tasks, approved messages, delivered orders, archived reviews, and closed route issues should roll into closeout.</p>
          <a href="#daily-closeout">View Closeout</a>
        </article>
      </div>

      <div className="sales-flow-prompts">
        <p className="eyebrow">Owner AI Sales Prompts</p>
        {prompts.map(prompt=><a href="#owner-ai" key={prompt}>{prompt}</a>)}
      </div>

      <style>{`
        .sales-flow{border:1px solid rgba(248,231,176,.22);border-radius:30px;background:radial-gradient(circle at top right,rgba(212,175,55,.16),transparent 34%),linear-gradient(135deg,#080503,#020202);padding:20px}
        .sales-flow-hero{display:grid;grid-template-columns:1fr 360px;gap:16px;align-items:start;margin-bottom:16px}
        .sales-flow h2,.sales-flow h3{color:#f8e7b0;margin:.25rem 0}
        .sales-flow p{color:#ded2bd}
        .sales-flow-score{display:grid;gap:8px}
        .sales-flow-score span{display:flex;justify-content:space-between;gap:12px;border:1px solid rgba(212,175,55,.22);border-radius:16px;background:#050403;color:#ded2bd;padding:10px}
        .sales-flow-score b{color:#f8e7b0}
        .sales-flow-pipeline{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:14px}
        .sales-flow-pipeline article,.quote-builder,.promise-safety,.box-recommendations,.flow-bottom article{border:1px solid rgba(248,231,176,.16);border-radius:22px;background:#050403;padding:14px}
        .sales-flow-pipeline small,.box-recommendations small{color:#d4af37;font-weight:900}
        .sales-flow-pipeline strong,.box-recommendations strong{font-size:2rem;color:#f8e7b0}
        .sales-flow-pipeline p{margin:0}
        .sales-flow-grid{display:grid;grid-template-columns:1.4fr .8fr;gap:14px}
        .quote-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:12px}
        .quote-form label{display:grid;gap:5px;color:#d4af37;font-weight:900;font-size:.84rem}
        .quote-form input,.quote-form textarea{border:1px solid rgba(248,231,176,.22);border-radius:14px;background:#0b0704;color:#fff7ed;padding:10px;font:inherit}
        .quote-form textarea{min-height:90px}
        .quote-form .wide{grid-column:1/-1}
        .quote-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:12px}
        .quote-actions button,.box-recommendations button,.flow-bottom a{border:1px solid rgba(248,231,176,.42);border-radius:999px;background:#0b0704;color:#fff7ed;text-decoration:none;padding:9px 12px;font-weight:900;cursor:pointer}
        .quote-actions button:first-child,.box-recommendations button{background:linear-gradient(135deg,#facc15,#a16207);color:#170b04}
        .quote-actions button:disabled{opacity:.55;cursor:wait}
        .promise-safety div{display:grid;gap:10px;margin-top:12px}
        .promise-safety span{border:1px solid rgba(248,231,176,.14);border-radius:16px;background:linear-gradient(180deg,#100904,#060403);padding:10px;display:grid;gap:4px}
        .promise-safety b{color:#d4af37}
        .promise-safety strong{color:#f8e7b0;font-size:1.35rem}
        .promise-safety small{color:#ded2bd}
        .box-recommendations{margin-top:14px}
        .box-recommendations>div{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;margin-top:12px}
        .box-recommendations article{border:1px solid rgba(248,231,176,.14);border-radius:18px;background:linear-gradient(180deg,#100904,#060403);padding:12px;display:grid;gap:7px}
        .box-recommendations p{margin:0}
        .box-recommendations b{color:#fff7ed}
        .flow-bottom{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:14px}
        .flow-bottom a{display:inline-flex;margin-top:8px}
        .sales-flow-prompts{display:flex;flex-wrap:wrap;gap:9px;border:1px solid rgba(248,231,176,.16);border-radius:22px;background:#050403;padding:14px;margin-top:14px}
        .sales-flow-prompts .eyebrow{width:100%;margin:0}
        .sales-flow-prompts a{border:1px solid rgba(212,175,55,.32);border-radius:999px;background:#0b0704;color:#fff7ed;text-decoration:none;padding:9px 12px;font-weight:800}
        @media(max-width:1180px){.box-recommendations>div{grid-template-columns:repeat(2,minmax(0,1fr))}.sales-flow-pipeline{grid-template-columns:repeat(2,minmax(0,1fr))}.sales-flow-hero,.sales-flow-grid,.flow-bottom{grid-template-columns:1fr}}
        @media(max-width:640px){.sales-flow{padding:12px;border-radius:22px}.quote-form,.box-recommendations>div,.sales-flow-pipeline{grid-template-columns:1fr}}
      `}</style>
    </section>
  );
}
