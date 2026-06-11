'use client';
import {useEffect,useState} from 'react';

type Item={description:string;qty:string;unitPrice:string;taxCategory:string};
const taxCategories=['grocery_food','prepared_food','delivery_fee','merchandise','promo_gift','wholesale'];
function money(value:number){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(value||0)}

export default function BillingCenter(){
  const [customer,setCustomer]=useState({customerName:'',customerEmail:'',customerPhone:'',deliveryZip:'',deliveryZoneStatus:'',deliveryZoneRing:''});
  const [items,setItems]=useState<Item[]>([{description:'Custom Freezer Box',qty:'1',unitPrice:'0',taxCategory:'grocery_food'}]);
  const [extra,setExtra]=useState({discount:'0',tax:'0',deliveryFee:'0',notes:'',paymentInstructions:''});
  const [invoices,setInvoices]=useState<any[]>([]);
  const [notice,setNotice]=useState('');
  const subtotal=items.reduce((sum,item)=>sum+Number(item.qty||0)*Number(item.unitPrice||0),0);
  const total=Math.max(0,subtotal-Number(extra.discount||0)+Number(extra.tax||0)+Number(extra.deliveryFee||0));
  async function load(){try{const response=await fetch('/api/billing/invoices',{credentials:'same-origin'});const data=await response.json();if(data.ok)setInvoices(data.invoices||[])}catch(error){}}
  useEffect(()=>{load()},[]);
  function updateItem(index:number,patch:Partial<Item>){setItems(current=>current.map((item,i)=>i===index?{...item,...patch}:item))}
  async function createInvoice(){
    setNotice('Creating invoice...');
    try{
      const payload={action:'create-invoice',invoice:{...customer,lineItems:items.map(item=>({description:item.description,qty:Number(item.qty||0),unitPrice:Number(item.unitPrice||0),taxCategory:item.taxCategory})),discount:Number(extra.discount||0),tax:Number(extra.tax||0),deliveryFee:Number(extra.deliveryFee||0),notes:extra.notes,paymentInstructions:extra.paymentInstructions}};
      const response=await fetch('/api/billing/invoices',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const data=await response.json();
      if(!response.ok||!data.ok)throw new Error(data.message||'Invoice failed');
      setNotice(`Invoice ${data.invoice.invoiceNumber} queued for ${data.invoice.customerEmail}.`);
      await load();
    }catch(error:any){setNotice(error?.message||'Invoice failed. Customer email is mandatory.');}
  }
  async function recordPayment(invoice:any){
    const amount=prompt('Amount received',String(invoice.balanceDue||invoice.total||0));
    if(!amount)return;
    const method=prompt('Payment method: cash, ach, zelle, check, btcpay, hosted-card','manual')||'manual';
    setNotice('Recording payment...');
    try{
      const response=await fetch('/api/billing/invoices',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'record-payment',invoiceId:invoice.id,amount:Number(amount),provider:method,method})});
      const data=await response.json();
      if(!response.ok||!data.ok)throw new Error(data.message||'Payment failed');
      setNotice(`Receipt ${data.receipt.receiptNumber} queued for ${data.invoice.customerEmail}.`);
      await load();
    }catch(error:any){setNotice(error?.message||'Payment failed.');}
  }
  return <section className="section billing-center" id="billing-center">
    <div className="owner-board-head"><div><p className="eyebrow">Billing Center</p><h2>Email-first invoices and receipts.</h2><p>Customer email is mandatory. Do not collect raw card numbers here; use approved payment links or owner-confirmed manual methods.</p></div></div>
    <div className="route-list ops-cards billing-grid">
      <article><p className="eyebrow">Customer</p><input value={customer.customerName} onChange={e=>setCustomer({...customer,customerName:e.target.value})} placeholder="Customer name"/><input value={customer.customerEmail} onChange={e=>setCustomer({...customer,customerEmail:e.target.value})} placeholder="Email required"/><input value={customer.customerPhone} onChange={e=>setCustomer({...customer,customerPhone:e.target.value})} placeholder="Phone"/><input value={customer.deliveryZip} onChange={e=>setCustomer({...customer,deliveryZip:e.target.value})} placeholder="Delivery ZIP"/><input value={customer.deliveryZoneStatus} onChange={e=>setCustomer({...customer,deliveryZoneStatus:e.target.value})} placeholder="Delivery zone status"/></article>
      <article><p className="eyebrow">Line Items</p>{items.map((item,index)=><div key={index} className="billing-line"><input value={item.description} onChange={e=>updateItem(index,{description:e.target.value})} placeholder="Description"/><input value={item.qty} onChange={e=>updateItem(index,{qty:e.target.value})} placeholder="Qty"/><input value={item.unitPrice} onChange={e=>updateItem(index,{unitPrice:e.target.value})} placeholder="Unit price"/><select value={item.taxCategory} onChange={e=>updateItem(index,{taxCategory:e.target.value})}>{taxCategories.map(category=><option key={category} value={category}>{category}</option>)}</select></div>)}<button onClick={()=>setItems([...items,{description:'',qty:'1',unitPrice:'0',taxCategory:'grocery_food'}])}>Add Line</button></article>
      <article><p className="eyebrow">Totals</p><input value={extra.discount} onChange={e=>setExtra({...extra,discount:e.target.value})} placeholder="Discount"/><input value={extra.tax} onChange={e=>setExtra({...extra,tax:e.target.value})} placeholder="Tax"/><input value={extra.deliveryFee} onChange={e=>setExtra({...extra,deliveryFee:e.target.value})} placeholder="Delivery fee"/><textarea value={extra.paymentInstructions} onChange={e=>setExtra({...extra,paymentInstructions:e.target.value})} placeholder="Payment instructions"/><textarea value={extra.notes} onChange={e=>setExtra({...extra,notes:e.target.value})} placeholder="Owner notes"/><h3>Total: {money(total)}</h3><button onClick={createInvoice}>Create & Queue Invoice Email</button>{notice&&<p className="sales-save-notice">{notice}</p>}</article>
    </div>
    <section className="section"><p className="eyebrow">Invoices</p><h2>Recent billing records.</h2><div className="route-list ops-cards">{invoices.length?invoices.map(invoice=><article key={invoice.id}><p className="eyebrow">{invoice.status}</p><h3>{invoice.invoiceNumber}</h3><p>{invoice.customerName} · {invoice.customerEmail}</p><p>Total {money(invoice.total)} · Paid {money(invoice.amountPaid)} · Balance {money(invoice.balanceDue)}</p><button onClick={()=>recordPayment(invoice)}>Record Payment / Queue Receipt</button></article>):<article><h3>No invoices yet.</h3><p>Create the first invoice after customer email, route, inventory, and price are confirmed.</p></article>}</div></section>
    <style>{`.billing-center input,.billing-center textarea,.billing-center select{width:100%;border:1px solid #b8892d;background:#050403;color:#fff7ed;border-radius:14px;padding:11px 12px;margin:5px 0}.billing-center button{border:1px solid #f8e7b0;background:linear-gradient(135deg,#facc15,#a16207);color:#160b04;border-radius:999px;padding:11px 14px;font-weight:900;margin-top:8px}.billing-line{display:grid;grid-template-columns:2fr .7fr .9fr 1.2fr;gap:6px}@media(max-width:760px){.billing-line{grid-template-columns:1fr}}`}</style>
  </section>
}
