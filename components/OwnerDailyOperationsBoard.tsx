'use client';
import {useEffect,useMemo,useState} from 'react';
import {ownerReviewItems} from './OwnerNeedsReviewInbox';

type BoardRecord={id:string;audience:string;subject:string;status:string;priority:string;source:string;metadata?:Record<string,any>};
type Props={snapshot:Record<string,any>};
function money(value:number){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value||0)}
function countBy(records:BoardRecord[],action:string){return records.filter(record=>record.metadata?.reviewAction===action||record.subject?.toLowerCase().includes(action)).length}
function openRecords(records:BoardRecord[]){return records.filter(record=>record.status!=='closed')}
export default function OwnerDailyOperationsBoard({snapshot}:Props){
  const [boardRecords,setBoardRecords]=useState<BoardRecord[]>([]);
  const [boardStatus,setBoardStatus]=useState('Loading owner decision records...');
  useEffect(()=>{let active=true;fetch('/api/internal-board',{credentials:'same-origin'}).then(r=>r.json()).then(result=>{if(!active)return;setBoardRecords(result?.records||[]);setBoardStatus(result?.ok?`Internal board loaded from ${result.storage||'working memory'}.`:result?.message||'Internal board unavailable.')}).catch(()=>{if(active)setBoardStatus('Internal board unavailable from this device.')});return()=>{active=false}},[]);
  const db=snapshot.database||{};
  const report=snapshot.ownerReport||{};
  const orders=db.orders||[];
  const driverUpdates=db.driverUpdates||[];
  const restock=db.restockIssues||[];
  const leads=db.driverSalesLeads||[];
  const reviewItems=ownerReviewItems(snapshot,orders,driverUpdates);
  const openBoard=openRecords(boardRecords);
  const counts=useMemo(()=>({needsReview:reviewItems.length,driverTasks:countBy(openBoard,'driver-task'),customerReplies:countBy(openBoard,'customer-reply'),followUps:countBy(openBoard,'follow-up'),ownerDecisions:countBy(boardRecords,'confirm'),openInvoices:orders.filter((order:any)=>!['paid','delivered','cancelled'].includes(String(order.status))).length,appointmentRequests:orders.filter((order:any)=>['lead','quoted','ordered','scheduled'].includes(String(order.status))).length,restockRisks:restock.length,hotLeads:leads.filter((lead:any)=>lead.temperature==='hot'||lead.status==='reserved').length,routeIssues:driverUpdates.filter((update:any)=>update.partialReason||update.restockIssue||['issue','partially-fulfilled','restock-needed'].includes(String(update.status))).length}),[reviewItems.length,openBoard,boardRecords,orders,restock.length,leads,driverUpdates]);
  const cards=[
    {label:'Needs Review',count:counts.needsReview,href:'#needs-review',action:'Confirm, dismiss, or convert review items.',tone:'urgent'},
    {label:'Driver Tasks',count:counts.driverTasks,href:'#owner-message-board',action:'Assign route work and verify completion.',tone:'work'},
    {label:'Customer Replies',count:counts.customerReplies,href:'#owner-message-board',action:'Approve customer-facing drafts before sending.',tone:'work'},
    {label:'Open Invoices',count:counts.openInvoices,href:'#orders',action:'Collect, receipt, dispute, or follow up.',tone:'money'},
    {label:'Appointments',count:counts.appointmentRequests,href:'#owner-ai',action:'Confirm requested deliveries and driver coverage.',tone:'route'},
    {label:'Restock Risks',count:counts.restockRisks,href:'#owner-report',action:'Protect premium promises before selling boxes.',tone:'risk'},
    {label:'Hot Leads',count:counts.hotLeads,href:'#owner-report',action:'Call high-value buyers and freezer leads.',tone:'sales'},
    {label:'Route Issues',count:counts.routeIssues,href:'#owner-report',action:'Resolve missed, partial, or blocked stops.',tone:'risk'},
  ];
  const prompts=[
    'What needs my decision before we promise anything today?',
    'Show me unpaid money and the fastest collection actions.',
    'Which driver tasks are open and which route is at risk?',
    'Draft customer replies that are waiting for owner approval.',
    'What should I buy or restock before taking more orders?',
    'Which hot leads should I call first today?',
  ];
  return <section className="section owner-command-board" id="owner-daily-board"><div className="owner-command-shell"><aside className="owner-command-sidebar"><p className="eyebrow">CCP Command AI</p><h2>Owner cockpit</h2><p>{boardStatus}</p><div className="owner-command-stats"><span>Revenue <b>{money(report.revenue)}</b></span><span>Profit <b>{money(report.estimatedProfit)}</b></span><span>Margin <b>{report.margin||0}%</b></span><span>Board Open <b>{openBoard.length}</b></span></div><a className="owner-command-primary" href="#owner-ai">Ask Owner AI</a></aside><div className="owner-command-main"><div className="owner-command-header"><div><p className="eyebrow">Daily Operations Board</p><h2>What needs owner attention today.</h2></div><a href="#needs-review">Start with Needs Review</a></div><div className="owner-command-cards">{cards.map(card=><a className={`owner-command-card ${card.tone}`} href={card.href} key={card.label}><small>{card.label}</small><strong>{card.count}</strong><p>{card.action}</p></a>)}</div><div className="owner-prompt-bank"><p className="eyebrow">Prompt questions</p>{prompts.map(prompt=><a href="#owner-ai" key={prompt}>{prompt}</a>)}</div></div></div><style>{`.owner-command-shell{display:grid;grid-template-columns:310px 1fr;gap:16px;border:1px solid rgba(248,231,176,.28);border-radius:28px;background:radial-gradient(circle at top left,rgba(250,204,21,.16),transparent 36%),linear-gradient(135deg,#0c0703,#020202);padding:16px;box-shadow:0 18px 80px rgba(0,0,0,.38)}.owner-command-sidebar{border:1px solid rgba(212,175,55,.36);border-radius:22px;background:#050403;padding:18px}.owner-command-sidebar h2,.owner-command-header h2{color:#f8e7b0;margin:.25rem 0}.owner-command-sidebar p{color:#ded2bd}.owner-command-stats{display:grid;gap:9px;margin:16px 0}.owner-command-stats span{display:flex;justify-content:space-between;border-bottom:1px solid rgba(212,175,55,.24);padding-bottom:8px;color:#ded2bd}.owner-command-stats b{color:#fff7ed}.owner-command-primary,.owner-command-header a{display:inline-flex;border:1px solid #f8e7b0;border-radius:999px;background:linear-gradient(135deg,#facc15,#a16207);color:#170b04;text-decoration:none;font-weight:900;padding:11px 14px}.owner-command-main{display:grid;gap:14px}.owner-command-header{display:flex;align-items:center;justify-content:space-between;gap:12px}.owner-command-cards{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.owner-command-card{border:1px solid rgba(248,231,176,.22);border-radius:20px;background:#080604;color:#fff7ed;text-decoration:none;padding:14px;min-height:142px;display:flex;flex-direction:column;justify-content:space-between}.owner-command-card small{color:#d4af37;font-weight:900}.owner-command-card strong{font-size:2.35rem;line-height:1;color:#f8e7b0}.owner-command-card p{color:#ded2bd;margin:0}.owner-command-card.urgent{background:linear-gradient(180deg,rgba(127,29,29,.45),#080604)}.owner-command-card.money{background:linear-gradient(180deg,rgba(22,101,52,.32),#080604)}.owner-command-card.risk{background:linear-gradient(180deg,rgba(161,98,7,.32),#080604)}.owner-command-card.sales{background:linear-gradient(180deg,rgba(88,28,135,.32),#080604)}.owner-prompt-bank{border:1px solid rgba(248,231,176,.18);border-radius:22px;background:#050403;padding:14px;display:flex;flex-wrap:wrap;gap:10px}.owner-prompt-bank .eyebrow{width:100%;margin:0}.owner-prompt-bank a{border:1px solid rgba(212,175,55,.32);border-radius:999px;padding:9px 12px;text-decoration:none;color:#fff7ed;background:#0b0704;font-weight:800}@media(max-width:1100px){.owner-command-shell{grid-template-columns:1fr}.owner-command-cards{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:640px){.owner-command-cards{grid-template-columns:1fr}.owner-command-header{display:block}.owner-command-header a{margin-top:10px}.owner-command-shell{padding:10px;border-radius:20px}}`}</style></section>
}
