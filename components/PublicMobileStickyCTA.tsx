'use client';

import {useEffect,useId,useRef,useState} from 'react';
import {saveAiExchange} from '../lib/ai-memory-client';
import {enumerateCustomerGuideAnswer,extractCustomerZip} from '../lib/customer-guide-enumerator';

type PublicMobileStickyCTAProps={
  zipHref?:string;
  quoteHref?:string;
};
type Msg={role:'user'|'assistant';content:string};

const prompts=[
  'Help me choose a freezer box',
  'Do you deliver to my ZIP?',
  'Explain the giveaway rules',
  'I need steak value',
  'Wholesale account help'
];

function clean(value:unknown){return String(value||'').trim()}
function zipFrom(text:string){return extractCustomerZip(text)}
function localReply(question:string){return enumerateCustomerGuideAnswer({question,zip:zipFrom(question)}).answer}
function routeAnswerText(data:any,question:string){
  const recommendation=data?.recommendation;
  const guide=recommendation?.customerGuide;
  if(guide?.answer)return guide.answer;
  const route=recommendation?.route;
  if(!route)return localReply(question);
  const box=clean(recommendation?.recommendation)||'recommended freezer package';
  const budget=clean(recommendation?.budget);
  return `${route.status}: ${route.route}, ${route.day}, ${route.window}. Suggested next step: ${box}${budget?` around ${budget}`:''}. Final delivery and product details should be confirmed before an order is locked in.`;
}

export default function PublicMobileStickyCTA({zipHref='#delivery-zone-check',quoteHref='#customer-account-journey'}:PublicMobileStickyCTAProps){
  const reactId=useId().replace(/[^a-zA-Z0-9-]/g,'');
  const [open,setOpen]=useState(false);
  const [input,setInput]=useState('');
  const [session,setSession]=useState('');
  const [loading,setLoading]=useState(false);
  const [topicsOpen,setTopicsOpen]=useState(true);
  const [messages,setMessages]=useState<Msg[]>([{role:'assistant',content:'Ask me one direct question: delivery ZIP, which freezer box, steak value, giveaway rules, wholesale, menu, or support. I will give you the clean next step.'}]);
  const chatEndRef=useRef<HTMLSpanElement|null>(null);
  const href=quoteHref || zipHref;

  useEffect(()=>{if(open)chatEndRef.current?.scrollIntoView({block:'end',behavior:'smooth'});},[messages,open,loading]);

  async function ask(value?:string){
    const question=clean(value||input);
    if(!question||loading)return;
    const id=session||`CCP-GUIDE-${reactId}`;
    if(!session)setSession(id);
    setInput('');
    setLoading(true);
    setTopicsOpen(false);
    const userMsg={role:'user' as const,content:question};
    const localGuide=enumerateCustomerGuideAnswer({question,zip:zipFrom(question)});
    setMessages(current=>[...current,userMsg,{role:'assistant',content:`Checking ${localGuide.intent.replaceAll('_',' ')}...`}]);
    let answer=localReply(question);
    try{
      const response=await fetch('/api/ai/route-concierge',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({role:'customer',question,zip:zipFrom(question),interest:question,familySize:question,budget:question,intent:localGuide.intent})});
      if(response.ok)answer=routeAnswerText(await response.json(),question);
    }catch{
      answer=localReply(question);
    }
    setMessages(current=>[...current.slice(0,-1),{role:'assistant',content:answer}]);
    setLoading(false);
    await saveAiExchange({role:'customer',sessionId:id,title:question.split(' ').slice(0,8).join(' ')||'CCP guide',subjectKey:'public-guide-agent',messages:[userMsg,{role:'assistant',content:answer}],context:{source:'public-mobile-robot',zip:zipFrom(question),quoteHref,zipHref}});
  }

  return (
    <aside className={`public-mobile-cta ${open?'open':''}`} aria-label="Capital City Provisions guide">
      {open&&<section className="guide-panel" role="dialog" aria-modal="false" aria-label="CCP Guide">
        <header><div><p className="eyebrow">Concierge Desk</p><h3>Capital City Guide</h3></div><button type="button" onClick={()=>setOpen(false)} aria-label="Close CCP Guide">x</button></header>
        <div className="guide-chat" aria-live="polite">{messages.map((message,index)=><p key={`${message.role}-${index}`} className={message.role}>{message.content}</p>)}<span ref={chatEndRef} className="chat-end" aria-hidden="true"></span></div>
        <details className="guide-topic-drawer" open={topicsOpen} onToggle={event=>setTopicsOpen(event.currentTarget.open)}>
          <summary>Topics</summary>
          <div className="guide-prompts">{prompts.map(prompt=><button key={prompt} type="button" onClick={()=>ask(prompt)} disabled={loading}>{prompt}</button>)}</div>
        </details>
        <form onSubmit={event=>{event.preventDefault();ask()}}>
          <input value={input} onChange={event=>setInput(event.target.value)} placeholder="Ask with your ZIP, budget, or box question..." disabled={loading}/>
          <button type="submit" disabled={loading||!input.trim()}>{loading?'...':'Send'}</button>
        </form>
        <nav className="guide-actions" aria-label="Guide next steps"><a href={zipHref}>Check ZIP</a><a href={href}>Request Quote</a></nav>
      </section>}
      <button className="guide-toggle" type="button" onClick={()=>setOpen(current=>!current)} aria-expanded={open} aria-label={open?'Close Capital City Provisions guide':'Open Capital City Provisions guide'}>
        <span className="guide-character" aria-hidden="true">
          <span className="guide-face"><span className="guide-smile"></span></span>
          <span className="guide-body"></span>
          <span className="guide-arm left"></span>
          <span className="guide-arm right"></span>
          <span className="meat-tray"><i></i><i></i><i></i></span>
        </span>
        <span className="robot-label">{open?'Close':'Guide'}</span>
      </button>
      <style>{`
        .public-mobile-cta{display:none}
        @media(max-width:760px){
          .public-mobile-cta{position:fixed;right:14px;bottom:14px;z-index:90;display:grid;justify-items:end;gap:10px;background:transparent;border:0;padding:0}
          .guide-toggle{position:relative;display:grid;place-items:center;width:72px;height:72px;border-radius:25px;background:linear-gradient(145deg,#fff8ed,#e8c878 58%,#b8892d);color:#2b1a12;text-decoration:none;border:1px solid #fff8ed;box-shadow:0 18px 42px rgba(69,39,20,.32),0 0 0 6px rgba(255,248,237,.55);cursor:pointer}
          .guide-toggle:before{content:"";position:absolute;inset:7px;border-radius:20px;border:1px solid rgba(43,26,18,.14);pointer-events:none}
          .guide-character{position:relative;display:block;width:48px;height:44px}
          .guide-face{position:absolute;left:9px;top:0;width:30px;height:27px;border-radius:13px 13px 12px 12px;background:#2b1a12;box-shadow:inset 0 0 0 1px rgba(255,255,255,.12)}
          .guide-face:before,.guide-face:after{content:"";position:absolute;top:9px;width:6px;height:6px;border-radius:50%;background:#f5d976;box-shadow:0 0 8px rgba(245,217,118,.62)}.guide-face:before{left:8px}.guide-face:after{right:8px}
          .guide-smile{position:absolute;left:10px;right:10px;bottom:7px;height:4px;border-bottom:2px solid #f5d976;border-radius:0 0 99px 99px}
          .guide-body{position:absolute;left:15px;top:24px;width:18px;height:13px;border-radius:8px 8px 5px 5px;background:#3a2418}
          .guide-arm{position:absolute;top:29px;width:16px;height:5px;border-radius:999px;background:#2b1a12}.guide-arm.left{left:5px;transform:rotate(16deg)}.guide-arm.right{right:5px;transform:rotate(-16deg)}
          .meat-tray{position:absolute;left:5px;right:5px;bottom:0;height:12px;border-radius:999px;background:linear-gradient(180deg,#fff8ed,#d8b66a);box-shadow:0 2px 0 #8a3a22,0 6px 12px rgba(43,26,18,.22)}
          .meat-tray i{position:absolute;top:-5px;width:12px;height:9px;border-radius:70% 45% 65% 45%;background:linear-gradient(135deg,#a83224,#6f1d16);border:1px solid rgba(255,248,237,.55)}.meat-tray i:nth-child(1){left:6px;transform:rotate(-14deg)}.meat-tray i:nth-child(2){left:18px;top:-7px;transform:rotate(9deg)}.meat-tray i:nth-child(3){right:6px;transform:rotate(15deg)}
          .robot-label{position:absolute;left:50%;bottom:-8px;transform:translateX(-50%);border:1px solid rgba(255,248,237,.52);border-radius:999px;background:#2b1a12;color:#fff8ed;padding:2px 8px;font-size:.58rem;font-weight:900;letter-spacing:.05em;text-transform:uppercase;box-shadow:0 8px 18px rgba(69,39,20,.24)}
          .public-mobile-cta.open{left:0;right:0;top:0;bottom:0;align-items:end;justify-items:center;padding:10px 10px 92px;background:rgba(43,26,18,.22);backdrop-filter:blur(6px)}
          .public-mobile-cta.open .guide-toggle{position:absolute;right:14px;bottom:14px}
          .guide-panel{display:grid;grid-template-rows:auto minmax(0,1fr) auto auto auto;width:min(480px,calc(100vw - 20px));height:min(720px,calc(100vh - 112px));overflow:hidden;border:1px solid rgba(184,137,45,.34);border-radius:24px;background:linear-gradient(180deg,#fff8ed,#f1dfc6);box-shadow:0 28px 74px rgba(69,39,20,.28);padding:14px;color:#2b1a12}
          .guide-panel header{display:flex;align-items:start;justify-content:space-between;gap:12px}.guide-panel h3{margin:2px 0 0;color:#2b1a12;font-size:1.35rem}.guide-panel .eyebrow{color:#8a3a22!important}.guide-panel header button{width:32px;height:32px;border:1px solid rgba(43,26,18,.18);border-radius:50%;background:#2b1a12;color:#fff8ed;font-weight:900}
          .guide-chat{display:grid;align-content:start;gap:8px;min-height:0;overflow:auto;margin:12px 0;padding:2px 2px 10px;scroll-behavior:smooth}.guide-chat p{margin:0!important;padding:10px 12px;border:1px solid rgba(184,137,45,.22);border-radius:15px;font-size:.92rem;line-height:1.38}.guide-chat .assistant{margin-right:22px!important;background:#fffaf3;color:#4b372b}.guide-chat .user{margin-left:22px!important;background:#3a2418;color:#fff8ed}.chat-end{display:block;height:1px}
          .guide-topic-drawer{border:1px solid rgba(184,137,45,.25);border-radius:16px;background:rgba(255,250,243,.7);margin-bottom:10px;overflow:hidden}.guide-topic-drawer summary{cursor:pointer;list-style:none;padding:9px 11px;color:#8a3a22;font-size:.78rem;font-weight:950;letter-spacing:.08em;text-transform:uppercase}.guide-topic-drawer summary::-webkit-details-marker{display:none}.guide-topic-drawer summary:after{content:"+";float:right}.guide-topic-drawer[open] summary:after{content:"-"}
          .guide-prompts{display:flex;flex-wrap:wrap;gap:7px;padding:0 10px 10px}.guide-prompts button{border:1px solid rgba(184,137,45,.55);border-radius:999px;background:#fffaf3;color:#2b1a12;padding:8px 10px;font-size:.78rem;font-weight:900}
          .guide-panel form{display:grid;grid-template-columns:1fr auto;gap:8px}.guide-panel input{min-width:0;border:1px solid rgba(184,137,45,.55);background:#ffffff;color:#2b1a12;border-radius:999px;padding:12px;font-size:.9rem}.guide-panel form button{border:1px solid #d2a547;background:linear-gradient(135deg,#f5d976,#c7922e);color:#271913;border-radius:999px;font-weight:900;padding:0 13px}
          .guide-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.guide-actions a{display:grid;place-items:center;min-height:38px;border:1px solid rgba(43,26,18,.18);border-radius:999px;background:#fffaf3;color:#2b1a12;text-decoration:none;font-weight:900;font-size:.82rem}.guide-actions a:last-child{background:#2b1a12;color:#fff8ed}
          body{padding-bottom:92px}
        }
      `}</style>
    </aside>
  );
}
