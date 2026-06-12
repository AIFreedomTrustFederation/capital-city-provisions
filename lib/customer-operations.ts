export type CustomerOpsStatus='open'|'review'|'closed';
export type CustomerOpsPriority='low'|'normal'|'high'|'urgent';
export type CustomerOpsKind='customer-profile'|'quote-request'|'rating'|'recovery-case'|'testimonial-candidate'|'restock-interest'|'reorder-opportunity'|'giveaway-interest';

export type CustomerProfileRecord={
  id:string;
  name:string;
  email:string;
  phone:string;
  zip:string;
  household:string;
  freezerSpace:string;
  preferredBox:string;
  restockInterest:boolean;
  giveawayInterest:boolean;
  notes:string;
  source:string;
  createdAt:string;
  updatedAt:string;
};

export type QuoteRequestRecord={
  id:string;
  customerId:string;
  name:string;
  email:string;
  phone:string;
  zip:string;
  box:string;
  proteins:string;
  value:number;
  household:string;
  freezerSpace:string;
  interest:string;
  notes:string;
  orderId:string;
  status:CustomerOpsStatus;
  priority:CustomerOpsPriority;
  createdAt:string;
  updatedAt:string;
};

export type RatingRecord={
  id:string;
  customerId:string;
  name:string;
  email:string;
  phone:string;
  orderId:string;
  rating:number;
  loved:string;
  improve:string;
  reorderInterest:boolean;
  restockInterest:boolean;
  sharePermission:boolean;
  status:'excellent'|'good'|'needs-recovery';
  createdAt:string;
};

export type CustomerOpsItem={
  id:string;
  kind:CustomerOpsKind;
  subject:string;
  body:string;
  customerId:string;
  customerName:string;
  customerEmail:string;
  phone:string;
  zip:string;
  orderId?:string;
  quoteId?:string;
  ratingId?:string;
  status:CustomerOpsStatus;
  priority:CustomerOpsPriority;
  ownerAction:string;
  createdAt:string;
  updatedAt:string;
  metadata:Record<string,any>;
};

export type CustomerOperationsStore={
  customers:CustomerProfileRecord[];
  quotes:QuoteRequestRecord[];
  ratings:RatingRecord[];
  ops:CustomerOpsItem[];
};

const globalStore=globalThis as typeof globalThis&{ccpCustomerOperations?:CustomerOperationsStore};

function now(){
  return new Date().toISOString();
}

function clean(value:any){
  return String(value||'').trim();
}

function normalizedEmail(value:any){
  return clean(value).toLowerCase();
}

function flag(value:any){
  return value===true||value==='true'||value==='on'||value==='yes';
}

function money(value:any){
  const n=Number(value||0);
  return Number.isFinite(n)?n:0;
}

function score(value:any){
  const n=Number(value||0);
  if(!Number.isFinite(n))return 5;
  return Math.max(1,Math.min(5,Math.round(n)));
}

function uniq(prefix:string){
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2,8)}`.toUpperCase();
}

export function getCustomerOperationsStore():CustomerOperationsStore{
  if(!globalStore.ccpCustomerOperations){
    globalStore.ccpCustomerOperations={customers:[],quotes:[],ratings:[],ops:[]};
  }
  return globalStore.ccpCustomerOperations;
}

export function findCustomer(input:{email?:string;phone?:string;id?:string}){
  const store=getCustomerOperationsStore();
  const email=normalizedEmail(input.email);
  const phone=clean(input.phone);
  const id=clean(input.id);
  return store.customers.find(customer=>
    (id&&customer.id===id)||
    (email&&customer.email===email)||
    (phone&&customer.phone===phone)
  );
}

export function upsertCustomerProfile(input:any){
  const store=getCustomerOperationsStore();
  const timestamp=now();
  const existing=findCustomer({id:input?.id,email:input?.email,phone:input?.phone});

  const customer:CustomerProfileRecord={
    id:existing?.id||clean(input?.id)||uniq('CUSTOMER'),
    name:clean(input?.name)||existing?.name||'New Customer',
    email:normalizedEmail(input?.email)||existing?.email||'',
    phone:clean(input?.phone)||existing?.phone||'',
    zip:clean(input?.zip)||existing?.zip||'',
    household:clean(input?.household)||existing?.household||'',
    freezerSpace:clean(input?.freezerSpace)||existing?.freezerSpace||'',
    preferredBox:clean(input?.preferredBox)||clean(input?.box)||existing?.preferredBox||'Premium Freezer Box',
    restockInterest:flag(input?.restockInterest)||existing?.restockInterest||false,
    giveawayInterest:flag(input?.giveawayInterest)||existing?.giveawayInterest||false,
    notes:clean(input?.notes)||existing?.notes||'',
    source:clean(input?.source)||existing?.source||'customer-facing-flow',
    createdAt:existing?.createdAt||timestamp,
    updatedAt:timestamp,
  };

  if(existing)Object.assign(existing,customer);
  else store.customers.unshift(customer);

  if(customer.restockInterest){
    createCustomerOpsItem({
      kind:'restock-interest',
      customer,
      subject:`Restock Interest: ${customer.name}`,
      body:`${customer.name} is interested in monthly restocks. Preferred box: ${customer.preferredBox}. ZIP: ${customer.zip}.`,
      priority:'normal',
      ownerAction:'Review for monthly restock follow-up.',
      metadata:{preferredBox:customer.preferredBox,freezerSpace:customer.freezerSpace},
    });
  }

  if(customer.giveawayInterest){
    createCustomerOpsItem({
      kind:'giveaway-interest',
      customer,
      subject:`Giveaway Interest: ${customer.name}`,
      body:`${customer.name} wants free giveaway information. Buying does not improve odds.`,
      priority:'low',
      ownerAction:'Confirm free entry path and optional sales follow-up separately.',
      metadata:{giveawayInterest:true},
    });
  }

  return customer;
}

export function createQuoteRequest(input:any){
  const store=getCustomerOperationsStore();
  const customer=upsertCustomerProfile({...input,source:'quote-request'});
  const timestamp=now();

  const quote:QuoteRequestRecord={
    id:clean(input?.id)||uniq('QUOTE'),
    customerId:customer.id,
    name:customer.name,
    email:customer.email,
    phone:customer.phone,
    zip:customer.zip,
    box:clean(input?.box)||clean(input?.preferredBox)||customer.preferredBox||'Premium Freezer Box',
    proteins:clean(input?.proteins),
    value:money(input?.value)||497,
    household:customer.household,
    freezerSpace:customer.freezerSpace,
    interest:clean(input?.interest)||'Freezer box quote request',
    notes:clean(input?.notes),
    orderId:clean(input?.orderId),
    status:'review',
    priority:customer.zip?'high':'normal',
    createdAt:timestamp,
    updatedAt:timestamp,
  };

  store.quotes.unshift(quote);

  createCustomerOpsItem({
    kind:'quote-request',
    customer,
    subject:`Quote Request: ${quote.name}`,
    body:[
      `Customer: ${quote.name}`,
      `ZIP: ${quote.zip||'Needs ZIP'}`,
      `Box: ${quote.box}`,
      `Proteins: ${quote.proteins||'Not specified'}`,
      `Estimated budget/value: ${quote.value}`,
      `Household: ${quote.household||'Not provided'}`,
      `Freezer space: ${quote.freezerSpace||'Not provided'}`,
      `Order lead: ${quote.orderId||'Not created'}`,
      `Notes: ${quote.notes||'None'}`,
    ].join('\n'),
    priority:quote.priority,
    ownerAction:'Build quote, confirm delivery fit, and create invoice when ready.',
    quoteId:quote.id,
    orderId:quote.orderId,
    metadata:{quote},
  });

  return {customer,quote};
}

export function statusFromRating(value:number):RatingRecord['status']{
  if(value>=5)return 'excellent';
  if(value>=4)return 'good';
  return 'needs-recovery';
}

export function createCustomerRating(input:any){
  const store=getCustomerOperationsStore();
  const customer=upsertCustomerProfile({...input,source:'service-rating'});
  const ratingValue=score(input?.rating);
  const timestamp=now();

  const rating:RatingRecord={
    id:clean(input?.id)||uniq('RATING'),
    customerId:customer.id,
    name:customer.name,
    email:customer.email,
    phone:customer.phone,
    orderId:clean(input?.orderId),
    rating:ratingValue,
    loved:clean(input?.loved),
    improve:clean(input?.improve),
    reorderInterest:flag(input?.reorderInterest),
    restockInterest:flag(input?.restockInterest),
    sharePermission:flag(input?.sharePermission),
    status:statusFromRating(ratingValue),
    createdAt:timestamp,
  };

  store.ratings.unshift(rating);

  createCustomerOpsItem({
    kind:'rating',
    customer,
    subject:`${ratingValue}★ Service Rating: ${rating.name}`,
    body:[
      `Rating: ${ratingValue} stars`,
      `Loved: ${rating.loved||'Not provided'}`,
      `Improve: ${rating.improve||'Not provided'}`,
      `Reorder interest: ${rating.reorderInterest?'Yes':'No'}`,
      `Restock interest: ${rating.restockInterest?'Yes':'No'}`,
      `Share permission: ${rating.sharePermission?'May ask customer':'No permission yet'}`,
    ].join('\n'),
    priority:rating.status==='needs-recovery'?'urgent':rating.status==='excellent'?'high':'normal',
    ownerAction:rating.status==='needs-recovery'?'Create service recovery follow-up.':'Review for reorder, restock, or testimonial opportunity.',
    ratingId:rating.id,
    orderId:rating.orderId,
    metadata:{rating},
  });

  if(rating.status==='needs-recovery'){
    createCustomerOpsItem({
      kind:'recovery-case',
      customer,
      subject:`Recovery Case: ${rating.name}`,
      body:`${rating.name} rated service ${ratingValue} stars. Improvement note: ${rating.improve||'No details provided.'}`,
      priority:'urgent',
      ownerAction:'Call customer, review driver/order notes, and create recovery plan.',
      ratingId:rating.id,
      orderId:rating.orderId,
      metadata:{rating},
    });
  }

  if(rating.status==='excellent'){
    createCustomerOpsItem({
      kind:'testimonial-candidate',
      customer,
      subject:`Testimonial Candidate: ${rating.name}`,
      body:`${rating.name} gave 5 stars. Loved: ${rating.loved||'No text provided.'} Share permission: ${rating.sharePermission?'May ask customer.':'Need permission.'}`,
      priority:'normal',
      ownerAction:'Ask permission to share, then save as testimonial candidate.',
      ratingId:rating.id,
      orderId:rating.orderId,
      metadata:{rating},
    });
  }

  if(rating.reorderInterest){
    createCustomerOpsItem({
      kind:'reorder-opportunity',
      customer,
      subject:`Reorder Opportunity: ${rating.name}`,
      body:`${rating.name} indicated reorder interest after service rating.`,
      priority:'high',
      ownerAction:'Create reorder follow-up or monthly restock offer.',
      ratingId:rating.id,
      orderId:rating.orderId,
      metadata:{rating},
    });
  }

  if(rating.restockInterest){
    createCustomerOpsItem({
      kind:'restock-interest',
      customer,
      subject:`Restock Interest After Rating: ${rating.name}`,
      body:`${rating.name} wants monthly restock information after rating service.`,
      priority:'normal',
      ownerAction:'Offer restock club options based on household and freezer size.',
      ratingId:rating.id,
      orderId:rating.orderId,
      metadata:{rating},
    });
  }

  return {customer,rating};
}

export function createCustomerOpsItem(input:{
  kind:CustomerOpsKind;
  customer:CustomerProfileRecord;
  subject:string;
  body:string;
  priority?:CustomerOpsPriority;
  status?:CustomerOpsStatus;
  ownerAction:string;
  orderId?:string;
  quoteId?:string;
  ratingId?:string;
  metadata?:Record<string,any>;
}){
  const store=getCustomerOperationsStore();
  const timestamp=now();

  const item:CustomerOpsItem={
    id:uniq('CUSTOPS'),
    kind:input.kind,
    subject:input.subject,
    body:input.body,
    customerId:input.customer.id,
    customerName:input.customer.name,
    customerEmail:input.customer.email,
    phone:input.customer.phone,
    zip:input.customer.zip,
    orderId:input.orderId,
    quoteId:input.quoteId,
    ratingId:input.ratingId,
    status:input.status||'open',
    priority:input.priority||'normal',
    ownerAction:input.ownerAction,
    createdAt:timestamp,
    updatedAt:timestamp,
    metadata:input.metadata||{},
  };

  store.ops.unshift(item);
  return item;
}

export function summarizeCustomerOperations(){
  const store=getCustomerOperationsStore();
  const open=store.ops.filter(item=>item.status!=='closed');
  return {
    customers:store.customers.length,
    quotes:store.quotes.length,
    ratings:store.ratings.length,
    openOps:open.length,
    quoteRequests:store.ops.filter(item=>item.kind==='quote-request'&&item.status!=='closed').length,
    recoveryCases:store.ops.filter(item=>item.kind==='recovery-case'&&item.status!=='closed').length,
    testimonialCandidates:store.ops.filter(item=>item.kind==='testimonial-candidate'&&item.status!=='closed').length,
    restockInterest:store.ops.filter(item=>item.kind==='restock-interest'&&item.status!=='closed').length,
    reorderOpportunities:store.ops.filter(item=>item.kind==='reorder-opportunity'&&item.status!=='closed').length,
    giveawayInterest:store.ops.filter(item=>item.kind==='giveaway-interest'&&item.status!=='closed').length,
  };
}
