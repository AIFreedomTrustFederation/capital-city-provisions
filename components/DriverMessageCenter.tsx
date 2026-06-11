'use client';
import {useState} from 'react';
import {generateCustomerMessage,type CustomerMessageStage} from '../lib/customer-messages';
import {departmentForStage,gmailComposeUrl,mailtoUrl} from '../lib/ccp-email-routing';

const stages:CustomerMessageStage[]=['lead-thank-you','quote-reminder','invoice-ready','receipt-issued','appointment-confirmed','delivery-follow-up'];

export default function DriverMessageCenter(){
  const [form,setForm]=useState({stage:'appointment-confirmed' as CustomerMessageStage,customerName:'',customerEmail:'',zip:'',box:'Freezer Box',invoiceNumber:'',receiptNumber:'',deliveryDate:'',deliveryWindow:'',balanceDue:'0',offerCode:'ROUTE10',offerText:'Route-day customer appreciation savings'});
  const message=generateCustomerMessage({...form,balanceDue:Number(form.balanceDue||0)});
  const department=departmentForStage(form.stage);
  const mailto=mailtoUrl({to:form.customerEmail,subject:message.subject,body:message.body,department});
  const gmail=gmailComposeUrl({to:form.customerEmail,subject:message.subject,body:message.body,department});
  async function saveQueued(){
    if(!form.customerEmail)return;
    await fetch('/api/email-system',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'queue-generated',message:{...form,balanceDue:Number(form.balanceDue||0),source:'driver-manual-message'}})}).catch(()=>{});
  }
  async function openGmail(){await saveQueued();window.open(gmail,'_blank','noopener,noreferrer')}
  async function openMail(){await saveQueued();window.location.href=mailto}
  return <section className="section driver-message-center" id="driver-message-center"><div className="owner-board-head"><div><p className="eyebrow">Driver Message Center</p><h2>Send customer updates from the route.</h2><p>AI prepares the message. CCP stores the backup. The driver sends manually from Gmail or the phone mail app.</p></div></div><div className="sales-work-grid"><div className="lead-capture-card"><select value={form.stage} onChange={e=>setForm({...form,stage:e.target.value as CustomerMessageStage})}>{stages.map(stage=><option key={stage} value={stage}>{stage}</option>)}</select><input value={form.customerName} onChange={e=>setForm({...form,customerName:e.target.value})} placeholder="Customer name"/><input value={form.customerEmail} onChange={e=>setForm({...form,customerEmail:e.target.value})} placeholder="Customer email"/><input value={form.zip} onChange={e=>setForm({...form,zip:e.target.value})} placeholder="ZIP"/><input value={form.deliveryDate} onChange={e=>setForm({...form,deliveryDate:e.target.value})} placeholder="Delivery date"/><input value={form.deliveryWindow} onChange={e=>setForm({...form,deliveryWindow:e.target.value})} placeholder="Delivery window"/><input value={form.invoiceNumber} onChange={e=>setForm({...form,invoiceNumber:e.target.value})} placeholder="Invoice number"/><input value={form.receiptNumber} onChange={e=>setForm({...form,receiptNumber:e.target.value})} placeholder="Receipt number"/><input value={form.offerCode} onChange={e=>setForm({...form,offerCode:e.target.value})} placeholder="Offer code"/><input value={form.offerText} onChange={e=>setForm({...form,offerText:e.target.value})} placeholder="Offer text"/><button onClick={openGmail} disabled={!form.customerEmail}>Open Gmail Compose</button><button onClick={openMail} disabled={!form.customerEmail}>Open Mail App</button><p className="mini-note">Department route: aifreedomtrust+ccp-{department}@gmail.com</p></div><aside className="sales-ai-panel"><p className="eyebrow">Preview</p><h3>{message.subject}</h3><pre style={{whiteSpace:'pre-wrap',fontFamily:'inherit'}}>{message.body}</pre></aside></div></section>
}
