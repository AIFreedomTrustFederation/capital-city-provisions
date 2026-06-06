'use client';
import {useMemo,useState} from 'react';

type Role='customer'|'driver'|'owner';
type ChatMessage={role:'user'|'assistant'|'system';content:string};
type PromptButton={label:string;prompt:string};
type LocalAIConciergeProps={context?:Record<string,any>;role?:Role;title?:string;intro?:string;initialPrompt?:string;prompts?:PromptButton[]};

const PREFERRED_MODELS=['Llama-3.2-1B-Instruct-q4f16_1-MLC','Qwen2.5-1.5B-Instruct-q4f16_1-MLC','Phi-3.5-mini-instruct-q4f16_1-MLC','Llama-3.1-8B-Instruct-q4f16_1-MLC'];
const FALLBACK_MODEL='Llama-3.1-8B-Instruct-q4f16_1-MLC';

const ROLE_PROFILES:Record<Role,{title:string;intro:string;initialPrompt:string;placeholder:string;prompts:PromptButton[];hello:string}>={
  customer:{title:'Box Concierge',intro:'Helps with freezer boxes, delivery routes, order bonuses, wholesale questions, and free giveaway rules.',initialPrompt:'What freezer box should I start with?',placeholder:'Ask about boxes, delivery, steak, wholesale, cheesecake, or giveaway...',hello:'I can help pick a freezer box, explain delivery, and answer promotion or giveaway questions. I will keep internal driver and owner tools out of this customer chat.',prompts:[{label:'Best box',prompt:'What freezer box should I start with?'},{label:'Delivery',prompt:'Do you deliver to my ZIP and how does routing work?'},{label:'Cheesecake',prompt:'How does the cheesecake offer work?'},{label:'Giveaway',prompt:'Can I enter the giveaway without buying?'}]},
  driver:{title:'Driver AI',intro:'Helps drivers with assigned routes, delivery status, fulfillment updates, restock notes, and turn-ins.',initialPrompt:'What do I need to know for my route today?',placeholder:'Ask about stops, route notes, fulfillment, restock, fuel, or turn-ins...',hello:'I can help with assigned routes, stop notes, fulfillment, restock issues, fuel notes, and turn-ins for the day.',prompts:[{label:'Today',prompt:'What do I need to know for my route today?'},{label:'Stops',prompt:'Summarize my stops and call-ahead notes.'},{label:'Restock',prompt:'What restock or partial fulfillment issues should I record?'},{label:'Turn-in',prompt:'Help me turn in the day.'}]},
  owner:{title:'Owner AI',intro:'Helps owners with orders, routes, reports, profit, restock needs, exports, and route learning.',initialPrompt:'What should I focus on today?',placeholder:'Ask about reports, orders, routes, profit, restock, drivers, or learning...',hello:'I can help with owner reports, orders, route performance, profit/loss, restock planning, driver updates, and route learning.',prompts:[{label:'Today',prompt:'What should I focus on today?'},{label:'Routes',prompt:'Summarize routes and route risk.'},{label:'Orders',prompt:'Summarize orders and follow-up priority.'},{label:'Learning',prompt:'How should we train routes to get smarter?'}]}
};

function webGpuSupported(){return typeof navigator!=='undefined'&&'gpu' in navigator;}
function chooseModel(webllm:any){const models=webllm?.prebuiltAppConfig?.model_list||[];const ids=models.map((model:any)=>model?.model_id).filter(Boolean);return PREFERRED_MODELS.find(id=>ids.includes(id))||ids.find((id:string)=>/1b|1\.5b|phi|smol/i.test(id)&&/instruct/i.test(id))||ids.find((id:string)=>/instruct/i.test(id))||FALLBACK_MODEL;}
function summarizeRoutes(routes:any[]){return routes.slice(0,3).map(route=>`${route.name}: ${route.status}, ${route.reserved}/${route.capacity} grouped, ${route.day} ${route.window}`).join('; ')}
function summarizeOrders(orders:any[]){return orders.slice(0,4).map(order=>`${order.id} ${order.customer||order.customerName||'customer'} ${order.box} ${order.status} $${order.value}`).join('; ')}

function customerReply(prompt:string,context:Record<string,any>){
  const lower=prompt.toLowerCase();
  const route=context?.route||context?.memory?.route||context?.memory?.routes?.[0];
  const recommendation=context?.recommendation?.title||context?.recommendation||'a freezer box matched to your household';
  if(lower.includes('giveaway'))return 'The freezer giveaway is free to enter. No purchase is necessary, and buying does not improve your odds. The cheesecake offer is a separate order bonus.';
  if(lower.includes('cheesecake')||lower.includes('coupon'))return 'The cheesecake thank-you gift is a limited bonus for qualifying first freezer-box orders reserved within 48 hours of a route check, while supplies last.';
  if(lower.includes('wholesale'))return 'For restaurants, food trucks, caterers, lodges, churches, and events, share your ZIP, delivery timing, estimated volume, and preferred proteins so sales can set up wholesale follow-up.';
  if(lower.includes('route')||lower.includes('deliver')||lower.includes('zip'))return route?`Your route estimate is ${route.route||route.name}, ${route.day||'next grouped route'} ${route.window||''}. Route status: ${route.status||'to be confirmed'}.`:'Start with your ZIP code so we can check your delivery route and timing.';
  if(lower.includes('box')||lower.includes('family')||lower.includes('steak'))return `I would start with ${recommendation}. Starter works for smaller households, Family Box for regular meal planning, Rancher Box for deeper freezer stocking, and Premium Owner Box for steak-heavy orders.`;
  return `For customer ordering, I can help pick a box, explain delivery, clarify the cheesecake offer, answer giveaway questions, or prepare your route request. A good next step is ${recommendation}.`;
}

function roleAwareReply(prompt:string,context:Record<string,any>,role:Role){
  const lower=prompt.toLowerCase();
  const memory=context?.memory||context;
  const routes=memory.routes||[];
  const orders=memory.orders||memory.orderLifecycle||[];
  const report=memory.dailyReport||memory.ownerReport||{};
  const turnIns=memory.turnIns||[];
  if(role==='customer')return customerReply(prompt,context);
  if(role==='owner'){
    if(lower.includes('report')||lower.includes('today')||lower.includes('focus'))return `Today: ${report.activeOrders||orders.length||0} active orders, ${report.hotLeads||0} hot leads, revenue ${report.revenue||report.revenueScheduled?`$${report.revenue||report.revenueScheduled}`:'not set'}, profit ${report.estimatedProfit?`$${report.estimatedProfit}`:'not set'}. Focus: ${(report.ownerFocus||report.ownerActions||[]).join(', ')||'review routes, restock issues, driver updates, and follow-up priorities'}.`;
    if(lower.includes('order')||lower.includes('customer'))return `Order snapshot: ${summarizeOrders(orders)||'No live orders loaded yet.'}`;
    if(lower.includes('turn')||lower.includes('driver'))return `Driver turn-ins: ${turnIns.map((t:any)=>`${t.driver} on ${t.routeId}: ${t.completed} completed, ${t.missed} missed; ${t.ownerFollowup}`).join(' | ')||'No turn-ins loaded yet.'}`;
    if(lower.includes('learn')||lower.includes('train'))return `Route learning should use owner-reviewed records: ZIP, route fill, order value, restock issues, fuel efficiency, missed stops, customer notes, and conversion outcomes. Current risk: ${report.routeRisk||'keep route capacity and delivery outcomes updated.'}`;
  }
  if(role==='driver'){
    if(lower.includes('today')||lower.includes('route')||lower.includes('stop'))return `Driver plan: ${summarizeRoutes(routes)||'No assigned routes loaded.'} Check call-ahead notes, fulfillment status, restock issues, fuel/mileage, and submit turn-in before end of day.`;
    if(lower.includes('turn'))return 'Turn in completed stops, missed stops, reschedules, payments, customer notes, fuel/mileage, partial fulfillment, restock issues, and owner follow-up.';
    if(lower.includes('payment')||lower.includes('call')||lower.includes('fulfill'))return `Review stop notes: ${summarizeOrders(orders)||'No stop notes loaded.'}`;
  }
  return role==='driver'?'Use this workspace for assigned routes, fulfillment, restock, fuel notes, and turn-ins.':'Use this workspace for reports, orders, route performance, restock needs, profit/loss, and learning records.';
}

function systemPrompt(context:Record<string,any>,role:Role){
  if(role==='customer')return `You are Capital City Provisions customer box concierge. You are speaking to a customer. Only discuss customer-facing topics: freezer boxes, steak delivery, wholesale inquiry, delivery route estimates, checkout/order interest, cheesecake order bonus, and free giveaway rules. Do not mention driver tools, owner reports, internal databases, turn-ins, profit/loss, route training, access codes, or internal operations. Never say purchase improves giveaway odds. Context JSON: ${JSON.stringify(context).slice(0,3500)}`;
  if(role==='driver')return `You are Capital City Provisions Driver AI. Only discuss assigned routes, stop notes, delivery status, fulfillment, partial fulfillment, restock issues, substitutions, fuel/mileage, and turn-ins. Do not expose owner financial reports unless provided in driver context. Context JSON: ${JSON.stringify(context).slice(0,4500)}`;
  return `You are Capital City Provisions Owner AI. Discuss orders, routes, reports, exports, profit/loss, restock, driver updates, database records, and route learning. Never connect giveaway odds to purchase. Context JSON: ${JSON.stringify(context).slice(0,5500)}`;
}

export default function LocalAIConcierge({context={},role,title,intro,initialPrompt,prompts}:LocalAIConciergeProps){
  const resolvedRole=(role||context.role||'customer') as Role;
  const profile=ROLE_PROFILES[resolvedRole]||ROLE_PROFILES.customer;
  const [ready,setReady]=useState(false);
  const [loading,setLoading]=useState(false);
  const [status,setStatus]=useState('Local AI is off until you start it.');
  const [engine,setEngine]=useState<any>(null);
  const [input,setInput]=useState(initialPrompt||profile.initialPrompt);
  const [messages,setMessages]=useState<ChatMessage[]>([{role:'assistant',content:profile.hello}]);
  const [mode,setMode]=useState<'rules'|'local-ai'>('rules');
  const [modelName,setModelName]=useState('Not loaded');
  const aiContext=useMemo(()=>({...context,role:resolvedRole}),[context,resolvedRole]);
  const promptButtons=prompts||profile.prompts;

  async function startLocalAI(){
    if(!webGpuSupported()){setStatus('This browser does not expose WebGPU yet, so rules mode is active.');setMode('rules');return}
    setLoading(true);setStatus('Loading open-source local model on this device...');
    try{
      const webllm=await import('@mlc-ai/web-llm');
      const selectedModel=chooseModel(webllm);
      setModelName(selectedModel);
      const nextEngine=await webllm.CreateMLCEngine(selectedModel,{initProgressCallback:(report:any)=>setStatus(report?.text||'Preparing local AI model...')});
      setEngine(nextEngine);setReady(true);setMode('local-ai');setStatus('Local AI ready. No API key or external AI server is being used for chat.');
    }catch(error){setStatus('Local model could not load on this device. Rules mode is active.');setMode('rules');}
    finally{setLoading(false)}
  }

  async function ask(e?:React.FormEvent){
    e?.preventDefault();
    const question=input.trim();
    if(!question)return;
    const nextMessages=[...messages,{role:'user' as const,content:question}];
    setMessages(nextMessages);setInput('');
    if(mode==='local-ai'&&ready&&engine){
      setStatus('Thinking locally on this device...');
      try{
        const response=await engine.chat.completions.create({messages:[{role:'system',content:systemPrompt(aiContext,resolvedRole)},...nextMessages.filter(m=>m.role!=='system').slice(-8)],temperature:0.25,max_tokens:resolvedRole==='customer'?220:340});
        const answer=response?.choices?.[0]?.message?.content||roleAwareReply(question,aiContext,resolvedRole);
        setMessages([...nextMessages,{role:'assistant',content:answer}]);setStatus('Local AI ready.');return;
      }catch(error){setStatus('Local AI hit a device issue, so I answered with rules mode.');}
    }
    setMessages([...nextMessages,{role:'assistant',content:roleAwareReply(question,aiContext,resolvedRole)}]);
  }

  return <section className="local-ai-panel">
    <div className="local-ai-head"><div><p className="eyebrow">{resolvedRole==='customer'?'Customer AI':resolvedRole==='driver'?'Driver AI':'Owner AI'}</p><h3>{title||profile.title}</h3><p>{intro||profile.intro}</p></div><button onClick={startLocalAI} disabled={loading||ready}>{ready?'AI Ready':loading?'Loading...':'Start Local AI'}</button></div>
    <div className="ai-status"><span>{mode==='local-ai'?'Local LLM':'Rules Mode'}</span><p>{status}</p><p>Model: {modelName}</p></div>
    <div className="local-ai-chat">{messages.map((m,index)=><div key={index} className={`ai-bubble ${m.role}`}>{m.content}</div>)}</div>
    <form onSubmit={ask} className="local-ai-input"><input value={input} onChange={e=>setInput(e.target.value)} placeholder={profile.placeholder}/><button type="submit">Ask</button></form>
    <div className="ai-prompts">{promptButtons.map(button=><button key={button.label} type="button" onClick={()=>setInput(button.prompt)}>{button.label}</button>)}</div>
    <style>{`.local-ai-panel{display:grid;gap:14px;border:1px solid #b8892d88;border-radius:22px;background:linear-gradient(180deg,#090706,#130a06);padding:16px;box-shadow:inset 0 0 0 1px #f8e7b014}.local-ai-head{display:grid;grid-template-columns:1fr auto;gap:14px;align-items:start}.local-ai-head h3{margin:0;color:#f8e7b0}.local-ai-head p{margin:6px 0 0!important}.local-ai-head button,.local-ai-input button,.ai-prompts button{border:1px solid #f8e7b0;background:linear-gradient(135deg,#facc15,#a16207);color:#160b04;border-radius:999px;padding:11px 14px;font-weight:900}.local-ai-head button:disabled{opacity:.7}.ai-status{border:1px solid #b8892d66;border-radius:16px;padding:10px;background:#050403}.ai-status span{color:#d4af37;font-weight:900}.ai-status p{margin:4px 0 0!important;font-size:.9rem!important}.local-ai-chat{display:grid;gap:9px;max-height:260px;overflow:auto;padding-right:4px}.ai-bubble{border:1px solid #b8892d55;border-radius:16px;padding:10px 12px;line-height:1.45}.ai-bubble.user{margin-left:10%;background:#1f1409;color:#fff7ed}.ai-bubble.assistant{margin-right:10%;background:#050403;color:#ded2bd}.local-ai-input{display:grid;grid-template-columns:1fr auto;gap:10px}.local-ai-input input{min-width:0;border:1px solid #b8892d;background:#050403;color:#fff7ed;border-radius:999px;padding:13px 15px;font:inherit}.ai-prompts{display:flex;flex-wrap:wrap;gap:8px}.ai-prompts button{padding:9px 11px;background:#080605;color:#f8e7b0;border-color:#d4af37}@media(max-width:760px){.local-ai-head,.local-ai-input{grid-template-columns:1fr}.local-ai-head button,.local-ai-input button{width:100%}.ai-bubble.user,.ai-bubble.assistant{margin-left:0;margin-right:0}}`}</style>
  </section>
}
