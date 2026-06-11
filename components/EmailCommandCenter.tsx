'use client';
import {useEffect,useState} from 'react';
import {generateCustomerMessage,type CustomerMessageStage} from '../lib/customer-messages';

const stages:CustomerMessageStage[]=['lead-thank-you','quote-reminder','invoice-ready','receipt-issued','appointment-confirmed','delivery-follow-up'];

export default function EmailCommandCenter(){
  const [emails,setEmails]=useState<any[]>([]);
  const [notice,setNotice]=useState('Loading email records...');
  const [form,setForm]=useState({stage:'lead-thank-you' as CustomerMessageStage,customerName:'',customerEmail:'',zip:'',box:'Freezer Box',invoiceNumber:'',receiptNumber:'',deliveryDate:'',deliveryWindow:'',balanceDue:'0',offerCode:'ROUTE10',offerText:'Customer appreciation savings'});
  const message=generateCustomerMessage({...form,balanceDue:Number(form.balanceDue||0)});
  async function load(){
    setNotice('Loading email records...');
    try{
      const response=await fetch('/api/email-system',{credentials:'same-origin'});
      const data=await response.json();
      if(!response.ok||!data.ok)throw new Error(data.message||'Email records could not load.');
      setEmails(data.records||[]);
      setNotice('');
    }catch(error:any){setNotice(error?.message||'Email records could not load.');}
  }
  async function queueGenerated(){
    if(!form.customerEmail){setNotice('Customer email is required before queueing.');return}
    setNotice('Queueing generated message...');
    try{
      const response=await fetch('/api/email-system',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'queue-generated',message:{...form,balanceDue:Number(form.balanceDue||0)}})});
      const data=await response.json();
      if(!response.ok||!data.ok)throw new Error(data.message||'Message was not queued.');
      setNotice(data.transport?.message||'Message queued.');
      await load();
    }catch(error:any){setNotice(error?.message||'Message was not queued.');}
  }
  async function importReceived(){
    if(!form.customerEmail){setNotice('Customer email is required before importing a reply.');return}
    const subject=prompt('Reply subject','Customer reply');
    const body=prompt('Paste customer reply text','');
    if(!body)return;
    setNotice('Importing received reply...');
    try{
      const response=await fetch('/api/email-system',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'import-received',message:{customerEmail:form.customerEmail,customerName:form.customerName,subject,body,source:'manual-owner-import'}})});
      const data=await response.json();
      if(!response.ok||!data.ok)throw new Error(data.message||'Reply was not imported.');
      setNotice('Received reply imported into backup inbox.');
      await load();
    }catch(error:any){setNotice(error?.message||'Reply was not imported.');}
  }
  useEffect(()=>{load()},[]);
  return <section className="section email-command" id="email-command"><div className="owner-board-head"><div><p className="eyebrow">Email Command Center</p><h2>AI customer emails and inbox backup.</h2><p>Generate stage-based customer messages, queue outbound records, and import received replies into the internal backup inbox.</p></div><button onClick={load}>Refresh</button></div><div className="sales-work-grid"><div className="lead-capture-card"><select value={form.stage} onChange={e=>setForm({...form,stage:e.target.value as CustomerMessageStage})}>{stages.map(stage=><option key={stage} value={stage}>{stage}</option>)}</select><input value={form.customerName} onChange={e=>setForm({...form,customerName:e.target.value})} placeholder="Customer name"/><input value={form.customerEmail} onChange={e=>setForm({...form,customerEmail:e.target.value})} placeholder="Customer email"/><input value={form.zip} onChange={e=>setForm({...form,zip:e.target.value})} placeholder="ZIP"/><input value={form.box} onChange={e=>setForm({...form,box:e.target.value})} placeholder="Box / offer"/><input value={form.invoiceNumber} onChange={e=>setForm({...form,invoiceNumber:e.target.value})} placeholder="Invoice number"/><input value={form.receiptNumber} onChange={e=>setForm({...form,receiptNumber:e.target.value})} placeholder="Receipt number"/><input value={form.deliveryDate} onChange={e=>setForm({...form,deliveryDate:e.target.value})} placeholder="Delivery date"/><input value={form.deliveryWindow} onChange={e=>setForm({...form,deliveryWindow:e.target.value})} placeholder="Delivery window"/><input value={form.balanceDue} onChange={e=>setForm({...form,balanceDue:e.target.value})} placeholder="Balance due"/><input value={form.offerCode} onChange={e=>setForm({...form,offerCode:e.target.value})} placeholder="Offer code"/><input value={form.offerText} onChange={e=>setForm({...form,offerText:e.target.value})} placeholder="Offer text"/><button onClick={queueGenerated}>Queue Generated Message</button><button onClick={importReceived}>Import Received Reply</button></div><aside className="sales-ai-panel"><p className="eyebrow">Generated Message</p><h3>{message.subject}</h3><pre style={{whiteSpace:'pre-wrap',fontFamily:'inherit'}}>{message.body}</pre></aside></div><section className="section"><p className="eyebrow">Inbox / Outbox Backup</p><h2>Customer communication records.</h2>{notice&&<p className="sales-save-notice">{notice}</p>}<div className="route-list ops-cards">{emails.length?emails.map((email,index)=><article key={email.id||index}><p className="eyebrow">{email.direction||'outbound'} · {email.stage||'message'} · {email.status||'queued'}</p><h3>{email.subject}</h3><p>{email.customerEmail||email.customer_email}</p><pre style={{whiteSpace:'pre-wrap',fontFamily:'inherit'}}>{email.body}</pre></article>):<article><h3>No email records yet.</h3><p>Queued messages and imported replies will appear here as backup records.</p></article>}</div></section></section>
}
