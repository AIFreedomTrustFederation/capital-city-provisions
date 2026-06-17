export type CustomerGuideIntent=
  'delivery_zip'|
  'box_choice'|
  'price_budget'|
  'giveaway_rules'|
  'wholesale'|
  'steak_value'|
  'menu'|
  'support'|
  'human_handoff'|
  'general';

export type CustomerGuideRoute={
  route:string;
  day:string;
  window:string;
  status:string;
  slotsRemaining?:number;
};

export type CustomerGuideResult={
  intent:CustomerGuideIntent;
  confidence:number;
  answer:string;
  nextActions:string[];
  needsZip:boolean;
  suggestedHref:string;
};

type GuideInput={
  question?:string;
  zip?:string;
  route?:CustomerGuideRoute|null;
};

function clean(value:unknown){return String(value||'').trim()}
function lower(value:unknown){return clean(value).toLowerCase()}
export function extractCustomerZip(text:string){return text.match(/\b\d{5}\b/)?.[0]||''}

export function enumerateCustomerIntent(question:string):{intent:CustomerGuideIntent;confidence:number}{
  const q=lower(question);
  if(/\b\d{5}\b/.test(q)||/(zip|deliver|delivery|route|area|near me|where|location|ship)/.test(q))return {intent:'delivery_zip',confidence:.9};
  if(/(giveaway|sweepstake|win|winner|freezer prize|official rule|odds|purchase necessary)/.test(q))return {intent:'giveaway_rules',confidence:.95};
  if(/(wholesale|restaurant|catering|church|business|bulk|supplier|account|commercial|event)/.test(q))return {intent:'wholesale',confidence:.9};
  if(/(price|cost|budget|pay|payment|finance|cheap|expensive|how much|monthly|\$)/.test(q))return {intent:'price_budget',confidence:.85};
  if(/(box|package|freezer|family|household|kids|meal prep|stock|restock|reserve|big mama|big papa|mama|papa|baby)/.test(q))return {intent:'box_choice',confidence:.86};
  if(/(steak|ribeye|new york|strip|sirloin|beef|value|cuts)/.test(q))return {intent:'steak_value',confidence:.82};
  if(/(menu|what do you have|products|seafood|chicken|pork|shrimp|lobster|crab)/.test(q))return {intent:'menu',confidence:.78};
  if(/(refund|problem|issue|support|wrong|late|replacement|cancel|complaint|help)/.test(q))return {intent:'support',confidence:.86};
  if(/(person|human|call me|text me|quote|consult|talk|contact|sales)/.test(q))return {intent:'human_handoff',confidence:.82};
  return {intent:'general',confidence:.55};
}

function routeLine(route?:CustomerGuideRoute|null){
  if(!route)return '';
  return `${route.status}: ${route.route}, ${route.day}, ${route.window}.`;
}

function boxFit(question:string){
  const q=lower(question);
  if(/(apartment|couple|small|starter|baby|first)/.test(q))return 'Start with the Baby Freezer Package.';
  if(/(\b5\b|\b6\b|\b7\b|five|six|seven|stock up|deeper|papa|reserve|fewer grocery)/.test(q))return 'Start with the Papa Freezer Package.';
  if(/(family|kids|busy|mama|weeknight|normal)/.test(q))return 'Start with the Mama Freezer Package.';
  if(/(large|big mama|serious|meal planner)/.test(q))return 'Start with the Big Mama Freezer Package.';
  if(/(food security|maximum|big papa|bulk|prepared)/.test(q))return 'Start with the Big Papa Freezer Package.';
  return 'Most first-time households should compare Baby, Mama, and Papa before going bigger.';
}

export function enumerateCustomerGuideAnswer(input:GuideInput):CustomerGuideResult{
  const question=clean(input.question);
  const zip=clean(input.zip)||extractCustomerZip(question);
  const {intent,confidence}=enumerateCustomerIntent(question);
  const route=input.route||null;
  const routeCopy=routeLine(route);

  if(intent==='delivery_zip'){
    const answer=zip
      ? `${routeCopy||'Thanks. We can use that ZIP for a route check.'} Next step: choose the freezer box direction, then the team confirms final timing before anything is locked in.`
      : 'Start with your ZIP. That tells us whether you are in an active route, grouped delivery area, opening route, or waitlist area before we recommend a box.';
    return {intent,confidence,answer,nextActions:['Enter ZIP','View freezer boxes','Ask for delivery follow-up'],needsZip:!zip,suggestedHref:'/#quick-route'};
  }

  if(intent==='box_choice'){
    return {intent,confidence,answer:`${boxFit(question)} Quick guide: Baby is the smaller first fill, Mama is the everyday family box, Papa is the deeper stock-up, and Big Mama or Big Papa are for larger freezers and reserve planning. Send household size, freezer space, favorite proteins, and budget and we can narrow it to one clear pick.`,nextActions:['Compare packages','Send household size','Check ZIP first'],needsZip:!zip,suggestedHref:'/freezer-boxes'};
  }

  if(intent==='price_budget'){
    return {intent,confidence,answer:'The site is set up for quote-first freezer planning, not blind checkout. The honest path is: ZIP, household size, freezer space, preferred proteins, then a confirmed quote. For most customers, the right box should fit the freezer and the monthly food rhythm before price is final.',nextActions:['Share budget range','Choose box size','Request quote'],needsZip:!zip,suggestedHref:'/contact'};
  }

  if(intent==='giveaway_rules'){
    return {intent,confidence:.98,answer:'The freezer giveaway is free to enter. No purchase is necessary, and buying does not improve odds. The cheesecake thank-you gift is separate: it is an order bonus for qualifying first freezer-box orders after a route check, while supplies last.',nextActions:['Enter giveaway','Read official rules','Check route separately'],needsZip:false,suggestedHref:'/giveaway'};
  }

  if(intent==='wholesale'){
    return {intent,confidence,answer:'For wholesale, we need ZIP, business type, delivery timing, product needs, approximate volume, and whether this is recurring or one-time. The team should confirm availability, route fit, and terms before any supply promise is final.',nextActions:['Send wholesale details','Ask for account review','Check delivery area'],needsZip:!zip,suggestedHref:'/wholesale'};
  }

  if(intent==='steak_value'){
    return {intent,confidence,answer:'For steak value, ask for a steak-forward freezer plan: ribeye or premium steak cuts where available, New York strip or sirloin for balance, and ground beef or everyday proteins so the box is useful all week. Tell us budget, freezer space, and how often you grill.',nextActions:['View menu','Compare steak boxes','Share budget'],needsZip:!zip,suggestedHref:'/menu'};
  }

  if(intent==='menu'){
    return {intent,confidence,answer:'The menu direction is premium steaks, beef staples, chicken, pork, seafood options, and freezer-ready family packs. Availability should be confirmed before a final order, especially for seafood or larger stock-up boxes.',nextActions:['View menu','Compare boxes','Ask about availability'],needsZip:false,suggestedHref:'/menu'};
  }

  if(intent==='support'){
    return {intent,confidence,answer:'For a support issue, send your name, ZIP, order or quote details, what happened, and photos if product condition is involved. Food delivery issues should be reviewed quickly and clearly before a refund, replacement, or credit is promised.',nextActions:['Contact support','Include order details','Add photos if needed'],needsZip:false,suggestedHref:'/contact'};
  }

  if(intent==='human_handoff'){
    return {intent,confidence,answer:'Yes. The clean handoff is to request a quote or contact the team with ZIP, household size, freezer space, favorite proteins, budget, and timing. That gives a real person enough detail to answer without guessing.',nextActions:['Request quote','Contact team','Check ZIP'],needsZip:!zip,suggestedHref:'/contact'};
  }

  return {intent,confidence,answer:'I can help fastest if we pick one lane: check delivery ZIP, choose a freezer package, explain the giveaway, review steak value, or start a wholesale/support request. What do you want to solve first?',nextActions:['Check ZIP','Choose a box','Ask giveaway rules'],needsZip:!zip,suggestedHref:'/customer-concierge'};
}
