import { NextResponse } from 'next/server';

function clean(value:unknown){return String(value||'').trim()}

async function postJson(url:string|undefined,body:unknown){
  if(!url)return {configured:false,ok:false};
  const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  return {configured:true,ok:response.ok,status:response.status};
}

export async function POST(request:Request){
  try{
    const turnIn=await request.json();
    const enriched={createdAt:new Date().toISOString(),source:'capital-city-driver-turn-in',...turnIn};
    const ownerText=[
      `Driver turn-in: ${clean(enriched.driver)}`,
      `Route: ${clean(enriched.routeId)}`,
      `Completed: ${clean(enriched.completed)}`,
      `Missed: ${clean(enriched.missed)}`,
      `Rescheduled: ${clean(enriched.rescheduled)}`,
      `Payments: ${clean(enriched.payments)}`,
      `Customer Notes: ${clean(enriched.customerNotes)}`,
      `Owner Follow-up: ${clean(enriched.ownerFollowup)}`
    ].join('\n');
    const [ownerWebhook,sheetWebhook]=await Promise.allSettled([
      postJson(process.env.OPS_WEBHOOK_URL||process.env.LEADS_WEBHOOK_URL,{text:ownerText,turnIn:enriched}),
      postJson(process.env.OPS_GOOGLE_SHEETS_WEBHOOK_URL||process.env.LEADS_GOOGLE_SHEETS_WEBHOOK_URL,enriched)
    ]);
    console.log('Capital City Provisions turn-in:',enriched);
    return NextResponse.json({ok:true,turnIn:enriched,notifications:{ownerWebhook:ownerWebhook.status==='fulfilled'?ownerWebhook.value:{configured:false,ok:false},googleSheets:sheetWebhook.status==='fulfilled'?sheetWebhook.value:{configured:false,ok:false}}});
  }catch(error){
    console.error('Turn-in submission failed:',error);
    return NextResponse.json({ok:false,message:'Turn-in submission failed'},{status:500});
  }
}
