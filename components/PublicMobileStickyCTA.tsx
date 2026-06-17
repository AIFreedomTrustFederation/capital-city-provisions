'use client';

import {useId,useState} from 'react';
import {saveAiExchange} from '../lib/ai-memory-client';

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
function zipFrom(text:string){return text.match(/\b\d{5}\b/)?.[0]||''}
function boxFrom(text:string){
  const q=text.toLowerCase();
  if(q.includes('wholesale'))return 'Wholesale Provisioning Account';
  if(q.includes('big')||q.includes('reserve')||q.includes('large'))return 'Papa or Big Papa freezer package';
  if(q.includes('family')||q.includes('kids')||q.includes('meal'))return 'Mama family freezer package';
  if(q.includes('steak'))return 'Steak-forward freezer package';
  return 'Starter or Mama freezer package';
}
function localReply(question:string){
  const q=question.toLowerCase();
  if(q.includes('giveaway'))return 'Giveaway entry is free. No purchase is necessary, and buying does not improve odds. Order bonuses are separate from the giveaway.';
  if(q.includes('wholesale'))return 'For wholesale, send ZIP, delivery timing, volume, product needs, and account type. The team should confirm availability before any supply promise is final.';
  if(q.includes('zip')||q.includes('deliver')||q.includes('route'))return 'Start with your ZIP so CCP can check route fit before you choose a box. Delivery is grouped by area, and final timing is confirmed before anything is locked in.';
  if(q.includes('steak'))return 'For steak value, ask for a steak-forward box with ribeye, New York strip, sirloin, and ground beef balance. Share budget and freezer space so the plan stays practical.';
  return `A good first fit is the ${boxFrom(question)}. Share ZIP, household size, freezer space, favorite proteins, and budget so CCP can give a cleaner follow-up.`;
}
function routeAnswerText(data:any,question:string){
  const recommendation=data?.recommendation;
  const route=recommendation?.route;
  if(!route)return localReply(question);
  const box=clean(recommendation?.recommendation)||boxFrom(question);
  const budget=clean(recommendation?.budget);
  return `${route.status}: ${route.route}, ${route.day}, ${route.window}. Suggested next step: ${box}${budget?` around ${budget}`:''}. Final delivery and product details should be confirmed before an order is locked in.`;
}

export default function PublicMobileStickyCTA({zipHref='#delivery-zone-check',quoteHref='#customer-account-journey'}:PublicMobileStickyCTAProps){
  const reactId=useId().replace(/[^a-zA-Z0-9-]/g,'');
  const [open,setOpen]=useState(false);
  const [input,setInput]=useState('');
  const [session,setSession]=useState('');
  const [loading,setLoading]=useState(false);
  const [messages,setMessages]=useState<Msg[]>([{role:'assistant',content:'I can help with ZIP fit, freezer boxes, steak value, wholesale questions, and giveaway rules before you request a quote.'}]);
  const href=quoteHref || zipHref;

  async function ask(value?:string){
    const question=clean(value||input);
    if(!question||loading)return;
    const id=session||`CCP-GUIDE-${reactId}`;
    if(!session)setSession(id);
    setInput('');
    setLoading(true);
    const userMsg={role:'user' as const,content:question};
    setMessages(current=>[...current,userMsg,{role:'assistant',content:'Checking the route and box guidance...'}]);
    let answer=localReply(question);
    try{
      const response=await fetch('/api/ai/route-concierge',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({role:'customer',question,zip:zipFrom(question),interest:question,familySize:question,budget:question})});
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
        <header><div><p className="eyebrow">CCP Guide</p><h3>Ask before you choose.</h3></div><button type="button" onClick={()=>setOpen(false)} aria-label="Close CCP Guide">x</button></header>
        <div className="guide-chat">{messages.map((message,index)=><p key={`${message.role}-${index}`} className={message.role}>{message.content}</p>)}</div>
        <div className="guide-prompts">{prompts.map(prompt=><button key={prompt} type="button" onClick={()=>ask(prompt)} disabled={loading}>{prompt}</button>)}</div>
        <form onSubmit={event=>{event.preventDefault();ask()}}>
          <input value={input} onChange={event=>setInput(event.target.value)} placeholder="Ask with your ZIP, budget, or box question..." disabled={loading}/>
          <button type="submit" disabled={loading||!input.trim()}>{loading?'...':'Send'}</button>
        </form>
        <nav className="guide-actions" aria-label="Guide next steps"><a href={zipHref}>Check ZIP</a><a href={href}>Request Quote</a></nav>
      </section>}
      <button className="guide-toggle" type="button" onClick={()=>setOpen(current=>!current)} aria-expanded={open} aria-label={open?'Close Capital City Provisions guide':'Open Capital City Provisions guide'}>
        <span className="robot-shell" aria-hidden="true">
          <span className="robot-antenna"></span>
          <span className="robot-head"><span></span></span>
        </span>
        <span className="robot-label">{open?'Close':'Guide'}</span>
      </button>
      <style>{`
        .public-mobile-cta{display:none}
        @media(max-width:760px){
          .public-mobile-cta{position:fixed;right:14px;bottom:14px;z-index:90;display:grid;justify-items:end;gap:10px;background:transparent;border:0;padding:0}
          .guide-toggle{position:relative;display:grid;place-items:center;width:72px;height:72px;border-radius:25px;background:linear-gradient(145deg,#fff8ed,#e8c878 58%,#b8892d);color:#2b1a12;text-decoration:none;border:1px solid #fff8ed;box-shadow:0 18px 42px rgba(69,39,20,.32),0 0 0 6px rgba(255,248,237,.55);cursor:pointer}
          .guide-toggle:before{content:"";position:absolute;inset:7px;border-radius:20px;border:1px solid rgba(43,26,18,.14);pointer-events:none}
          .robot-shell{position:relative;display:grid;place-items:center;width:42px;height:38px}
          .robot-antenna{position:absolute;top:-2px;width:3px;height:8px;border-radius:999px;background:#2b1a12}.robot-antenna:before{content:"";position:absolute;left:50%;top:-5px;transform:translateX(-50%);width:7px;height:7px;border-radius:50%;background:#2b1a12}
          .robot-head{position:relative;display:block;width:36px;height:30px;border-radius:13px;background:#2b1a12;box-shadow:inset 0 0 0 1px rgba(255,255,255,.12)}
          .robot-head:before,.robot-head:after{content:"";position:absolute;top:10px;width:7px;height:7px;border-radius:50%;background:#f5d976;box-shadow:0 0 10px rgba(245,217,118,.65)}.robot-head:before{left:9px}.robot-head:after{right:9px}
          .robot-head span{position:absolute;left:12px;right:12px;bottom:7px;height:3px;border-radius:99px;background:#f5d976}
          .robot-label{position:absolute;left:50%;bottom:-8px;transform:translateX(-50%);border:1px solid rgba(255,248,237,.52);border-radius:999px;background:#2b1a12;color:#fff8ed;padding:2px 8px;font-size:.58rem;font-weight:900;letter-spacing:.05em;text-transform:uppercase;box-shadow:0 8px 18px rgba(69,39,20,.24)}
          .guide-panel{width:min(380px,calc(100vw - 24px));max-height:min(620px,calc(100vh - 118px));overflow:auto;border:1px solid rgba(184,137,45,.34);border-radius:24px;background:linear-gradient(180deg,#fff8ed,#f1dfc6);box-shadow:0 28px 74px rgba(69,39,20,.28);padding:14px;color:#2b1a12}
          .guide-panel header{display:flex;align-items:start;justify-content:space-between;gap:12px}.guide-panel h3{margin:2px 0 0;color:#2b1a12;font-size:1.35rem}.guide-panel .eyebrow{color:#8a3a22!important}.guide-panel header button{width:32px;height:32px;border:1px solid rgba(43,26,18,.18);border-radius:50%;background:#2b1a12;color:#fff8ed;font-weight:900}
          .guide-chat{display:grid;gap:8px;max-height:230px;overflow:auto;margin:12px 0}.guide-chat p{margin:0!important;padding:10px 12px;border:1px solid rgba(184,137,45,.22);border-radius:15px;font-size:.92rem;line-height:1.38}.guide-chat .assistant{margin-right:22px!important;background:#fffaf3;color:#4b372b}.guide-chat .user{margin-left:22px!important;background:#3a2418;color:#fff8ed}
          .guide-prompts{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:10px}.guide-prompts button{border:1px solid rgba(184,137,45,.55);border-radius:999px;background:#fffaf3;color:#2b1a12;padding:8px 10px;font-size:.78rem;font-weight:900}
          .guide-panel form{display:grid;grid-template-columns:1fr auto;gap:8px}.guide-panel input{min-width:0;border:1px solid rgba(184,137,45,.55);background:#ffffff;color:#2b1a12;border-radius:999px;padding:12px;font-size:.9rem}.guide-panel form button{border:1px solid #d2a547;background:linear-gradient(135deg,#f5d976,#c7922e);color:#271913;border-radius:999px;font-weight:900;padding:0 13px}
          .guide-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.guide-actions a{display:grid;place-items:center;min-height:38px;border:1px solid rgba(43,26,18,.18);border-radius:999px;background:#fffaf3;color:#2b1a12;text-decoration:none;font-weight:900;font-size:.82rem}.guide-actions a:last-child{background:#2b1a12;color:#fff8ed}
          body{padding-bottom:92px}
        }
      `}</style>
    </aside>
  );
}
