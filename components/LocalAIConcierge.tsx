'use client';
import {useMemo,useState} from 'react';

type ChatMessage={role:'user'|'assistant'|'system';content:string};
type LocalAIConciergeProps={context?:Record<string,any>};

const PREFERRED_MODELS=['Llama-3.2-1B-Instruct-q4f16_1-MLC','Qwen2.5-1.5B-Instruct-q4f16_1-MLC','Phi-3.5-mini-instruct-q4f16_1-MLC','Llama-3.1-8B-Instruct-q4f16_1-MLC'];
const FALLBACK_MODEL='Llama-3.1-8B-Instruct-q4f16_1-MLC';
const FALLBACK_ANSWERS=[
  ['giveaway','The freezer giveaway is free to enter. No purchase is necessary, and buying does not improve your odds. The cheesecake offer is separate.'],
  ['cheesecake','The cheesecake thank-you gift is a limited order bonus for qualifying first freezer-box orders reserved within 48 hours of a route check, while supplies last.'],
  ['wholesale','For restaurants, food trucks, caterers, lodges, churches, and events, the best next step is a wholesale provisioning account request with volume, delivery ZIP, and product mix.'],
  ['route','Start with your ZIP code. The concierge checks route status, route fill, delivery window, and whether the area is confirmed, building, almost full, or waitlist.'],
  ['box','For most households, choose Starter for 1-2 people, Family Box for 3-6 people, Rancher Box for larger monthly freezer planning, and Premium Owner Box for steak-heavy stocking.']
];

function webGpuSupported(){return typeof navigator!=='undefined'&&'gpu' in navigator;}

function chooseModel(webllm:any){
  const models=webllm?.prebuiltAppConfig?.model_list||[];
  const ids=models.map((model:any)=>model?.model_id).filter(Boolean);
  return PREFERRED_MODELS.find(id=>ids.includes(id))||ids.find((id:string)=>/1b|1\.5b|phi|smol/i.test(id)&&/instruct/i.test(id))||ids.find((id:string)=>/instruct/i.test(id))||FALLBACK_MODEL;
}

function summarizeRoutes(routes:any[]){return routes.slice(0,3).map(route=>`${route.name}: ${route.status}, ${route.reserved}/${route.capacity} grouped, ${route.day} ${route.window}`).join('; ')}
function summarizeOrders(orders:any[]){return orders.slice(0,4).map(order=>`${order.id} ${order.customer} ${order.box} ${order.status} $${order.value}`).join('; ')}

function roleAwareReply(prompt:string,context:Record<string,any>){
  const lower=prompt.toLowerCase();
  const memory=context?.memory||context;
  const role=context?.role||'customer';
  const routes=memory.routes||[];
  const orders=memory.orders||[];
  const report=memory.dailyReport||{};
  const turnIns=memory.turnIns||[];
  if(role==='owner'){
    if(lower.includes('report')||lower.includes('today')||lower.includes('focus'))return `Today: ${report.activeOrders||orders.length} active orders, ${report.hotLeads||0} hot leads, scheduled revenue ${report.revenueScheduled?`$${report.revenueScheduled}`:'not set'}. Focus: ${(report.ownerFocus||[]).join(', ')||'review routes, hot leads, and driver turn-ins'}.`;
    if(lower.includes('order')||lower.includes('customer'))return `Order snapshot: ${summarizeOrders(orders)||'No orders loaded yet.'}`;
    if(lower.includes('turn')||lower.includes('driver'))return `Driver turn-ins: ${turnIns.map((t:any)=>`${t.driver} on ${t.routeId}: ${t.completed} completed, ${t.missed} missed; ${t.ownerFollowup}`).join(' | ')||'No turn-ins loaded yet.'}`;
    if(lower.includes('learn')||lower.includes('train'))return `Route learning should use structured memory first: ZIP, route fill, order value, missed stops, customer notes, and conversion outcomes. Current risk: ${report.routeRisk||'keep route capacity and driver turn-ins updated.'}`;
  }
  if(role==='driver'){
    if(lower.includes('today')||lower.includes('route')||lower.includes('stop'))return `Driver plan: ${summarizeRoutes(routes)||'No assigned routes loaded.'} Check call-ahead notes, loaded status, payments, and submit turn-in before end of day.`;
    if(lower.includes('turn'))return 'Turn in completed stops, missed stops, reschedules, payments, customer notes, and owner follow-up. That becomes owner memory for tomorrow.';
    if(lower.includes('payment')||lower.includes('call'))return `Review order notes: ${summarizeOrders(orders)||'No stop notes loaded.'}`;
  }
  const found=FALLBACK_ANSWERS.find(([key])=>lower.includes(key));
  if(found)return found[1];
  const route=memory?.route?.name||memory?.route?.route||routes[0]?.name||'your local delivery route';
  const rec=memory?.recommendation?.title||memory?.recommendation||'a freezer box matched to your household';
  return `Based on the current site rules, I would start with ${rec}, check ${route}, keep the cheesecake offer separate from the free giveaway, and send ZIP, budget, household size, and preferred proteins for follow-up.`;
}

function fallbackReply(prompt:string,context:Record<string,any>){return roleAwareReply(prompt,context)}

function systemPrompt(context:Record<string,any>){return `You are Capital City Provisions Local AI Concierge. You run in the browser. Be concise, useful, local, role-aware, and honest. Use the provided route, order, report, turn-in, promo, and giveaway context. Respect role permissions: customers only get customer-facing route and box guidance; drivers get assigned route and turn-in help; owners can discuss all orders, routes, reports, exports, and route learning. Never say purchase improves giveaway odds. Never invent fake scarcity. Giveaway entry is free and no purchase is required. Cheesecake is a separate qualifying-order bonus. If asked for legal, medical, or financial advice, recommend contacting the business or a professional. Context JSON: ${JSON.stringify(context).slice(0,5500)}`;}

export default function LocalAIConcierge({context={}}:LocalAIConciergeProps){
  const [ready,setReady]=useState(false);
  const [loading,setLoading]=useState(false);
  const [status,setStatus]=useState('Local AI is off until you start it.');
  const [engine,setEngine]=useState<any>(null);
  const [input,setInput]=useState('What should I focus on today?');
  const [messages,setMessages]=useState<ChatMessage[]>([{role:'assistant',content:'I can help with boxes, routes, orders, turn-ins, reports, and giveaway rules. I run locally when your browser supports WebGPU.'}]);
  const [mode,setMode]=useState<'rules'|'local-ai'>('rules');
  const [modelName,setModelName]=useState('Not loaded');
  const aiContext=useMemo(()=>context,[context]);

  async function startLocalAI(){
    if(!webGpuSupported()){setStatus('This browser does not expose WebGPU yet, so rules mode is active.');setMode('rules');return}
    setLoading(true);setStatus('Loading open-source local model on this device...');
    try{
      const webllm=await import('@mlc-ai/web-llm');
      const selectedModel=chooseModel(webllm);
      setModelName(selectedModel);
      const nextEngine=await webllm.CreateMLCEngine(selectedModel,{initProgressCallback:(report:any)=>setStatus(report?.text||'Preparing local AI model...')});
      setEngine(nextEngine);setReady(true);setMode('local-ai');setStatus('Local AI ready. No API key or external AI server is being used for chat.');
    }catch(error){
      setStatus('Local model could not load on this device. Rules mode is active.');setMode('rules');
    }finally{setLoading(false)}
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
        const response=await engine.chat.completions.create({messages:[{role:'system',content:systemPrompt(aiContext)},...nextMessages.filter(m=>m.role!=='system').slice(-8)],temperature:0.3,max_tokens:320});
        const answer=response?.choices?.[0]?.message?.content||fallbackReply(question,aiContext);
        setMessages([...nextMessages,{role:'assistant',content:answer}]);setStatus('Local AI ready.');return;
      }catch(error){setStatus('Local AI hit a device issue, so I answered with rules mode.');}
    }
    setMessages([...nextMessages,{role:'assistant',content:fallbackReply(question,aiContext)}]);
  }

  return <section className="local-ai-panel">
    <div className="local-ai-head"><div><p className="eyebrow">Local AI Concierge</p><h3>Open-source AI built into the website.</h3><p>Runs in-browser with WebGPU when available. Falls back to the site rules when a device cannot load the model.</p></div><button onClick={startLocalAI} disabled={loading||ready}>{ready?'AI Ready':loading?'Loading...':'Start Local AI'}</button></div>
    <div className="ai-status"><span>{mode==='local-ai'?'Local LLM':'Rules Mode'}</span><p>{status}</p><p>Model: {modelName}</p></div>
    <div className="local-ai-chat">{messages.map((m,index)=><div key={index} className={`ai-bubble ${m.role}`}>{m.content}</div>)}</div>
    <form onSubmit={ask} className="local-ai-input"><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask about orders, routes, reports, turn-ins, boxes, or promos..."/><button type="submit">Ask</button></form>
    <div className="ai-prompts"><button type="button" onClick={()=>setInput('What should I focus on today?')}>Today</button><button type="button" onClick={()=>setInput('Summarize routes and route risk.')}>Routes</button><button type="button" onClick={()=>setInput('Summarize orders and follow-up priority.')}>Orders</button><button type="button" onClick={()=>setInput('How should we train routes to get smarter?')}>Route learning</button></div>
    <style>{`.local-ai-panel{display:grid;gap:14px;border:1px solid #b8892d88;border-radius:22px;background:linear-gradient(180deg,#090706,#130a06);padding:16px;box-shadow:inset 0 0 0 1px #f8e7b014}.local-ai-head{display:grid;grid-template-columns:1fr auto;gap:14px;align-items:start}.local-ai-head h3{margin:0;color:#f8e7b0}.local-ai-head p{margin:6px 0 0!important}.local-ai-head button,.local-ai-input button,.ai-prompts button{border:1px solid #f8e7b0;background:linear-gradient(135deg,#facc15,#a16207);color:#160b04;border-radius:999px;padding:11px 14px;font-weight:900}.local-ai-head button:disabled{opacity:.7}.ai-status{border:1px solid #b8892d66;border-radius:16px;padding:10px;background:#050403}.ai-status span{color:#d4af37;font-weight:900}.ai-status p{margin:4px 0 0!important;font-size:.9rem!important}.local-ai-chat{display:grid;gap:9px;max-height:260px;overflow:auto;padding-right:4px}.ai-bubble{border:1px solid #b8892d55;border-radius:16px;padding:10px 12px;line-height:1.45}.ai-bubble.user{margin-left:10%;background:#1f1409;color:#fff7ed}.ai-bubble.assistant{margin-right:10%;background:#050403;color:#ded2bd}.local-ai-input{display:grid;grid-template-columns:1fr auto;gap:10px}.local-ai-input input{min-width:0;border:1px solid #b8892d;background:#050403;color:#fff7ed;border-radius:999px;padding:13px 15px;font:inherit}.ai-prompts{display:flex;flex-wrap:wrap;gap:8px}.ai-prompts button{padding:9px 11px;background:#080605;color:#f8e7b0;border-color:#d4af37}@media(max-width:760px){.local-ai-head,.local-ai-input{grid-template-columns:1fr}.local-ai-head button,.local-ai-input button{width:100%}.ai-bubble.user,.ai-bubble.assistant{margin-left:0;margin-right:0}}`}</style>
  </section>
}
