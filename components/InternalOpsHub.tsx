type Role='owner'|'driver';
type Card={need:string;title:string;text:string;href:string;owner?:boolean;driver?:boolean;priority:number};
const cards:Card[]=[
  {need:'Setup',title:'Profile Setup',text:'Confirm identity, preferred sender, department routing, and backup handling.',href:'/owner-setup',owner:true,priority:100},
  {need:'Setup',title:'Driver Profile',text:'Confirm driver identity and route communication preferences.',href:'/driver-profile',driver:true,priority:100},
  {need:'Command',title:'Owner Command',text:'Live owner control room for messages, leads, reports, route health, and AI.',href:'/owner',owner:true,priority:98},
  {need:'Messages',title:'Owner Message Board',text:'Review queued messages, sent confirmations, imported replies, follow-ups, and escalations.',href:'/owner#owner-message-board',owner:true,priority:96},
  {need:'Messages',title:'Driver Messages',text:'Prepare customer updates from Gmail or phone mail while CCP keeps the backup record.',href:'/driver-messages',driver:true,owner:true,priority:94},
  {need:'Routes',title:'Driver Route',text:'Assigned stops, status updates, fulfillment notes, restock flags, fuel/miles, and turn-ins.',href:'/driver',driver:true,owner:true,priority:92},
  {need:'Appointments',title:'Driver Appointments',text:'Delivery windows with manual customer-message workflow.',href:'/driver-appointments',driver:true,owner:true,priority:90},
  {need:'Sales',title:'Field Sales',text:'Cold-knock and route-side sales opportunities.',href:'/field-sales',driver:true,owner:true,priority:88},
  {need:'Sales',title:'Driver Sales Queue',text:'Driver-created leads, pitch status, reserve notes, and owner review.',href:'/driver-sales',driver:true,owner:true,priority:86},
  {need:'Billing',title:'Billing Center',text:'Invoices, receipts, payment status, and billing message workflow.',href:'/billing',owner:true,priority:84},
  {need:'Revenue',title:'Revenue Pipeline',text:'Connect leads, invoices, appointments, and delivery follow-up into one sales view.',href:'/revenue-pipeline',owner:true,priority:82},
  {need:'Routes',title:'Delivery Map',text:'ZIP coverage, service rings, and delivery-area intelligence.',href:'/delivery-map',owner:true,driver:true,priority:80},
  {need:'AI',title:'AI Memory',text:'Persistent AI session ledger for saved command threads and role-based conversation memory.',href:'/ai-memory',owner:true,driver:true,priority:79},
  {need:'AI',title:'AI Route Concierge',text:'Ask the AI about ZIPs, delivery zones, boxes, routing, and customer context.',href:'/ai-route-concierge',owner:true,driver:true,priority:78},
  {need:'AI',title:'Business Intelligence',text:'Owner-level operator brain, route learning, restock risk, and profit signals.',href:'/business-intelligence',owner:true,priority:76}
];
function visible(card:Card,role:Role){return role==='owner'?card.owner:card.driver}
function groups(role:Role){const active=cards.filter(c=>visible(c,role)).sort((a,b)=>b.priority-a.priority);return [...new Set(active.map(c=>c.need))].map(need=>({need,cards:active.filter(c=>c.need===need)}))}
export default function InternalOpsHub({role,compact=false}:{role:Role;compact?:boolean}){
  const title=role==='owner'?'Owner Operations Hub':'Driver Operations Hub';
  const subtitle=role==='owner'?'One front door for command, messages, sales, billing, routes, reports, and AI.':'One front door for profile, route work, customer messages, appointments, sales opportunities, and AI.';
  return <section className="section" id="internal-ops-hub"><div className="owner-board-head"><div><p className="eyebrow">Internal Operations</p><h2>{title}</h2><p>{subtitle}</p></div><div className="actions"><a href="/internal-access?role=owner">Owner View</a><a href="/internal-access?role=driver">Driver View</a></div></div>{groups(role).map(group=><div key={group.need} className="ops-hub-group"><p className="eyebrow">{group.need}</p><div className="route-list ops-cards">{group.cards.slice(0,compact?3:99).map(card=><article key={`${group.need}-${card.title}`}><h3>{card.title}</h3><p>{card.text}</p><a href={card.href}>Open</a></article>)}</div></div>)}</section>
}