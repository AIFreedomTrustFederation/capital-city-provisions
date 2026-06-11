'use client';
import {useState} from 'react';
import {generateCustomerMessage,type CustomerMessageStage} from '../lib/customer-messages';
import {departmentForStage,gmailComposeUrl,mailtoUrl} from '../lib/ccp-email-routing';

type ActionKey='confirm-window'|'on-way'|'running-late'|'complete'|'not-home'|'follow-up';
type Props={customerName:string;customerEmail:string;zip?:string;deliveryDate?:string;deliveryWindow?:string;invoiceNumber?:string;receiptNumber?:string;box?:string};
const actions:{key:ActionKey;label:string;stage:CustomerMessageStage;offerCode:string;offerText:string}[]=[
  {key:'confirm-window',label:'Confirm Window',stage:'appointment-confirmed',offerCode:'NEXTRESTOCK',offerText:'Next restock appreciation offer'},
  {key:'on-way',label:'On My Way',stage:'appointment-confirmed',offerCode:'',offerText:''},
  {key:'running-late',label:'Running Late',stage:'appointment-confirmed',offerCode:'',offerText:''},
  {key:'complete',label:'Delivery Complete',stage:'delivery-follow-up',offerCode:'RESTOCKTHANKS',offerText:'Thank-you savings for the next freezer box'},
  {key:'not-home',label:'Customer Not Home',stage:'quote-reminder',offerCode:'ROUTEHELP',offerText:'Ask us about the next available route window'},
  {key:'follow-up',label:'Restock Follow-Up',stage:'delivery-follow-up',offerCode:'RESTOCK10',offerText:'Restock club appreciation savings'}
];
function noteFor(key:ActionKey){if(key==='on-way')return 'I am on the way now. Please keep your phone nearby for any final route update.';if(key==='running-late')return 'I am still coming, but the route is running behind. Thank you for your patience.';if(key==='not-home')return 'I could not complete the delivery because I could not reach you at the stop. Please reply so we can coordinate the next step.';return ''}

export default function DriverMessageActions(props:Props){
  const [status,setStatus]=useState('');
  const [lastMessage,setLastMessage]=useState<any>(null);
  async function saveMessage(action:typeof actions[number]){
    const message=generateCustomerMessage({stage:action.stage,customerName:props.customerName,customerEmail:props.customerEmail,zip:props.zip,box:props.box||'Freezer Box',invoiceNumber:props.invoiceNumber,receiptNumber:props.receiptNumber,deliveryDate:props.deliveryDate,deliveryWindow:props.deliveryWindow,offerCode:action.offerCode,offerText:action.offerText,notes:noteFor(action.key)} as any);
    const saved=await fetch('/api/email-system',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'queue-generated',message:{stage:action.stage,customerName:props.customerName,customerEmail:props.customerEmail,zip:props.zip,box:props.box||'Freezer Box',invoiceNumber:props.invoiceNumber,receiptNumber:props.receiptNumber,deliveryDate:props.deliveryDate,deliveryWindow:props.deliveryWindow,offerCode:action.offerCode,offerText:action.offerText,source:`driver-${action.key}`}})}).then(res=>res.json()).catch(()=>null);
    const body=[message.body,noteFor(action.key)].filter(Boolean).join('\n\n');
    const record=saved?.record||{customerEmail:props.customerEmail,customerName:props.customerName,subject:message.subject,body,stage:action.stage,source:`driver-${action.key}`};
    setLastMessage(record);
    return {message,body,record};
  }
  async function send(action:typeof actions[number],mode:'gmail'|'mail'){
    if(!props.customerEmail){setStatus('Customer email required.');return}
    const prepared=await saveMessage(action);
    const department=departmentForStage(action.stage);
    const url=mode==='gmail'?gmailComposeUrl({to:props.customerEmail,subject:prepared.message.subject,body:prepared.body,department}):mailtoUrl({to:props.customerEmail,subject:prepared.message.subject,body:prepared.body,department});
    setStatus(`${action.label} queued. Confirm send after your mail app opens.`);
    if(mode==='gmail')window.open(url,'_blank','noopener,noreferrer'); else window.location.href=url;
  }
  async function mark(label:'sent'|'needs-follow-up'){
    if(!lastMessage){setStatus('Open a message first, then mark the result.');return}
    await fetch('/api/email-system',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'save-draft',record:{...lastMessage,status:label==='sent'?'sent':'queued',source:`${lastMessage.source||'driver-message'}-${label}`,metadata:{...(lastMessage.metadata||{}),driverOutcome:label}}})}).catch(()=>{});
    setStatus(label==='sent'?'Marked sent for owner backup.':'Marked needs follow-up for owner backup.');
  }
  return <div className="driver-message-actions"><p className="eyebrow">One-Tap Messages</p><div className="quick-grid">{actions.map(action=><div key={action.key} className="quick-action"><strong>{action.label}</strong><button onClick={()=>send(action,'gmail')} disabled={!props.customerEmail}>Gmail</button><button onClick={()=>send(action,'mail')} disabled={!props.customerEmail}>Mail</button></div>)}</div><div className="actions"><button onClick={()=>mark('sent')}>Mark Sent</button><button onClick={()=>mark('needs-follow-up')}>Needs Follow-Up</button></div>{status&&<p className="sales-save-notice">{status}</p>}<style>{`.driver-message-actions{margin-top:14px}.quick-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.quick-action{border:1px solid rgba(248,231,176,.35);border-radius:16px;padding:10px;background:rgba(10,6,3,.72)}.quick-action button{margin:6px 6px 0 0;border:1px solid #f8e7b0;border-radius:999px;padding:8px 10px;background:#211206;color:#fff7ed}.quick-action button:disabled{opacity:.45}@media(max-width:720px){.quick-grid{grid-template-columns:1fr}}`}</style></div>
}
