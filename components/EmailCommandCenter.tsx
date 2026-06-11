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
      const [billingRes,apptRes]=await Promise.all([fetch('/api/billing/invoices',{credentials:'same-origin'}),fetch('/api/scheduling/appointments',{credentials:'same-origin'})]);
      const billing=await billingRes.json();const appt=await apptRes.json();
      const billingEmails=billing.ok?(billing.emails||[]):[];
      const apptEmails=appt.ok?(appt.emails||[]):[];
      setEmails([...billingEmails,...apptEmails].sort((a:any,b:any)=>String(b.createdAt||b.created_at||'').localeCompare(String(a.createdAt||a.created_at||''))));
      setNotice('');
    }catch(error:any){setNotice(error?.message||'Email records could not load.');}
  }
  useEffect(()=>{load()},[]);
  return <section className="section email-command" id="email-command"><div className="owner-board-head"><div><p className="eyebrow">Email Command Center</p><h2>AI customer emails and message backup.</h2><p>Generate warm stage-based customer messages and review queued invoice, receipt, and appointment email records.</p></div><button onClick={load}>Refresh</button></div><div className="sales-work-grid"><div className="lead-capture-card"><select value={form.stage} onChange={e=>setForm({...form,stage:e.target.value as CustomerMessageStage})}>{stages.map(stage=><option key={stage} value={stage}>{stage}</option>)}</select><input value={form.customerName} onChange={e=>setForm({...form,customerName:e.target.value})} placeholder="Customer name"/><input value={form.customerEmail} onChange={e=>setForm({...form,customerEmail:e.target.value})} placeholder="Customer email"/><input value={form.zip} onChange={e=>setForm({...form,zip:e.target.value})} placeholder="ZIP"/><input value={form.box} onChange={e=>setForm({...form,box:e.target.value})} placeholder="Box / offer"/><input value={form.invoiceNumber} onChange={e=>setForm({...form,invoiceNumber:e.target.value})} placeholder="Invoice number"/><input value={form.receiptNumber} onChange={e=>setForm({...form,receiptNumber:e.target.value})} placeholder="Receipt number"/><input value={form.deliveryDate} onChange={e=>setForm({...form,deliveryDate:e.target.value})} placeholder="Delivery date"/><input value={form.deliveryWindow} onChange={e=>setForm({...form,deliveryWindow:e.target.value})} placeholder="Delivery window"/><input value={form.balanceDue} onChange={e=>setForm({...form,balanceDue:e.target.value})} placeholder="Balance due"/><input value={form.offerCode} onChange={e=>setForm({...form,offerCode:e.target.value})} placeholder="Offer code"/><input value={form.offerText} onChange={e=>setForm({...form,offerText:e.target.value})} placeholder="Offer text"/></div><aside className="sales-ai-panel"><p className="eyebrow">Generated Message</p><h3>{message.subject}</h3><pre style={{whiteSpace:'pre-wrap',fontFamily:'inherit'}}>{message.body}</pre></aside></div><section className="section"><p className="eyebrow">Email Backup</p><h2>Queued and generated records.</h2>{notice&&<p className="sales-save-notice">{notice}</p>}<div className="route-list ops-cards">{emails.length?emails.map((email,index)=><article key={email.id||index}><p className="eyebrow">{email.emailType||email.email_type||'email'} · {email.status||'queued'}</p><h3>{email.subject}</h3><p>{email.customerEmail||email.customer_email}</p><pre style={{whiteSpace:'pre-wrap',fontFamily:'inherit'}}>{email.body}</pre></article>):<article><h3>No email records yet.</h3><p>Invoice, receipt, appointment, and generated messages will appear here as records are queued.</p></article>}</div></section></section>
}
