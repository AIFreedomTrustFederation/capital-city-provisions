export type InvoiceStatus='draft'|'sent'|'viewed'|'partial'|'paid'|'void'|'refunded';
export type PaymentStatus='pending'|'authorized'|'paid'|'failed'|'refunded'|'disputed';
export type PaymentProvider='manual'|'cash'|'ach'|'zelle'|'check'|'btcpay'|'hosted-card';
export type TaxCategory='grocery_food'|'prepared_food'|'delivery_fee'|'merchandise'|'promo_gift'|'wholesale';

export type InvoiceLineItem={sku?:string;description:string;qty:number;unit?:string;unitPrice:number;taxCategory?:TaxCategory;metadata?:Record<string,any>};
export type InvoiceInput={customerId?:string;orderId?:string;customerName:string;customerEmail:string;customerPhone?:string;billingName?:string;deliveryZip?:string;deliveryZoneStatus?:string;deliveryZoneRing?:string;lineItems:InvoiceLineItem[];discount?:number;tax?:number;deliveryFee?:number;dueAt?:string;expiresAt?:string;notes?:string;terms?:string;paymentInstructions?:string;metadata?:Record<string,any>};
export type InvoiceRecord=InvoiceInput&{id:string;invoiceNumber:string;status:InvoiceStatus;subtotal:number;total:number;amountPaid:number;balanceDue:number;currency:'USD';createdAt:string;updatedAt:string;sentAt?:string;paidAt?:string;voidedAt?:string};
export type PaymentRecord={id:string;invoiceId:string;provider:PaymentProvider;method:string;status:PaymentStatus;amount:number;currency:'USD';processorPaymentId?:string;processorFee:number;netAmount:number;cardBrand?:string;cardLast4?:string;receivedAt?:string;notes?:string;metadata?:Record<string,any>;createdAt:string;updatedAt:string};
export type ReceiptRecord={id:string;receiptNumber:string;invoiceId:string;paymentId?:string;customerEmail:string;amountPaid:number;balanceDue:number;status:'issued'|'void'|'refunded';emailStatus:'pending'|'queued'|'sent'|'failed';issuedAt:string;metadata?:Record<string,any>};

export function cleanEmail(value:unknown){return String(value||'').trim().toLowerCase()}
export function validEmail(value:unknown){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail(value))}
export function money(value:number){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(Number(value||0))}
export function invoiceNumber(date=new Date()){const stamp=date.toISOString().slice(0,10).replace(/-/g,'');return `CCP-INV-${stamp}-${String(Date.now()).slice(-6)}`}
export function receiptNumber(date=new Date()){const stamp=date.toISOString().slice(0,10).replace(/-/g,'');return `CCP-RCPT-${stamp}-${String(Date.now()).slice(-6)}`}
export function sanitizeInvoice(input:InvoiceInput){
  const customerEmail=cleanEmail(input.customerEmail);
  if(!validEmail(customerEmail))throw new Error('Customer email is required before creating an invoice.');
  if(!input.lineItems?.length)throw new Error('At least one line item is required.');
  const lineItems=input.lineItems.map(item=>({sku:item.sku||'',description:String(item.description||'').trim(),qty:Number(item.qty||1),unit:item.unit||'each',unitPrice:Number(item.unitPrice||0),taxCategory:item.taxCategory||'grocery_food',metadata:item.metadata||{}}));
  if(lineItems.some(item=>!item.description))throw new Error('Each line item needs a description.');
  const subtotal=lineItems.reduce((sum,item)=>sum+item.qty*item.unitPrice,0);
  const discount=Number(input.discount||0);
  const tax=Number(input.tax||0);
  const deliveryFee=Number(input.deliveryFee||0);
  const total=Math.max(0,subtotal-discount+tax+deliveryFee);
  const now=new Date().toISOString();
  return {id:`BILL-${Date.now()}`,invoiceNumber:invoiceNumber(),customerId:input.customerId,orderId:input.orderId,customerName:String(input.customerName||'Customer').trim(),customerEmail,customerPhone:input.customerPhone||'',billingName:input.billingName||input.customerName||'',deliveryZip:input.deliveryZip||'',deliveryZoneStatus:input.deliveryZoneStatus||'',deliveryZoneRing:input.deliveryZoneRing||'',lineItems,discount,tax,deliveryFee,dueAt:input.dueAt,expiresAt:input.expiresAt,notes:input.notes||'',terms:input.terms||defaultTerms(),paymentInstructions:input.paymentInstructions||defaultPaymentInstructions(),metadata:input.metadata||{},status:'draft' as InvoiceStatus,subtotal,total,amountPaid:0,balanceDue:total,currency:'USD' as const,createdAt:now,updatedAt:now};
}
export function defaultTerms(){return 'Inventory and delivery timing are confirmed before fulfillment. Giveaway entries are free and separate from purchases. Refunds, substitutions, and cancellations require owner review.'}
export function defaultPaymentInstructions(){return 'Pay only through an approved Capital City Provisions payment link or owner-confirmed method. Do not email card numbers. We never ask for full card details by email.'}
export function invoiceEmail(invoice:InvoiceRecord){
  const lines=invoice.lineItems.map(item=>`- ${item.description}: ${item.qty} ${item.unit||'each'} x ${money(item.unitPrice)} = ${money(item.qty*item.unitPrice)}`).join('\n');
  const subject=`Capital City Provisions Invoice ${invoice.invoiceNumber}`;
  const body=[`Hello ${invoice.customerName},`,'',`Your Capital City Provisions invoice is ready.`, '', lines, '', `Subtotal: ${money(invoice.subtotal)}`, `Discount: ${money(invoice.discount||0)}`, `Tax: ${money(invoice.tax||0)}`, `Delivery: ${money(invoice.deliveryFee||0)}`, `Total: ${money(invoice.total)}`, `Balance due: ${money(invoice.balanceDue)}`, '', `Delivery ZIP: ${invoice.deliveryZip||'TBD'} ${invoice.deliveryZoneStatus?`(${invoice.deliveryZoneStatus})`:''}`, '', invoice.paymentInstructions, '', invoice.terms, '', 'Capital City Provisions'].join('\n');
  return {subject,body};
}
export function createPayment(invoice:InvoiceRecord,provider:PaymentProvider,amount:number,method=provider,metadata:Record<string,any>={}){const now=new Date().toISOString();const processorFee=Number(metadata.processorFee||0);return {id:`PAY-${Date.now()}`,invoiceId:invoice.id,provider,method,status:'paid' as PaymentStatus,amount:Number(amount||0),currency:'USD' as const,processorPaymentId:String(metadata.processorPaymentId||''),processorFee,netAmount:Number(amount||0)-processorFee,cardBrand:String(metadata.cardBrand||''),cardLast4:String(metadata.cardLast4||''),receivedAt:now,notes:String(metadata.notes||''),metadata,createdAt:now,updatedAt:now}}
export function applyPayment(invoice:InvoiceRecord,payment:PaymentRecord){const amountPaid=Number(invoice.amountPaid||0)+Number(payment.amount||0);const balanceDue=Math.max(0,Number(invoice.total||0)-amountPaid);return {...invoice,amountPaid,balanceDue,status:balanceDue<=0?'paid':amountPaid>0?'partial':invoice.status,paidAt:balanceDue<=0?payment.receivedAt:invoice.paidAt,updatedAt:new Date().toISOString()} as InvoiceRecord}
export function createReceipt(invoice:InvoiceRecord,payment:PaymentRecord){return {id:`RCPT-${Date.now()}`,receiptNumber:receiptNumber(),invoiceId:invoice.id,paymentId:payment.id,customerEmail:invoice.customerEmail,amountPaid:payment.amount,balanceDue:invoice.balanceDue,status:'issued' as const,emailStatus:'pending' as const,issuedAt:new Date().toISOString(),metadata:{provider:payment.provider,method:payment.method,processorPaymentId:payment.processorPaymentId||''}}}
export function receiptEmail(invoice:InvoiceRecord,receipt:ReceiptRecord,payment:PaymentRecord){const subject=`Capital City Provisions Receipt ${receipt.receiptNumber}`;const body=[`Hello ${invoice.customerName},`,'',`Payment received for invoice ${invoice.invoiceNumber}.`,'',`Receipt: ${receipt.receiptNumber}`,`Amount paid: ${money(receipt.amountPaid)}`,`Payment method: ${payment.method}`,`Balance due: ${money(receipt.balanceDue)}`,'',`Delivery ZIP: ${invoice.deliveryZip||'TBD'}`,'',invoice.terms,'','Capital City Provisions'].join('\n');return {subject,body}}
