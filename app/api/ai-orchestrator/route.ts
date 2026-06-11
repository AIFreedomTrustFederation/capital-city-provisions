import {NextResponse} from 'next/server';

function accessRole(request:Request){const cookie=request.headers.get('cookie')||'';return cookie.match(/(?:^|; )ccp_access=([^;]+)/)?.[1]||''}

export async function GET(request:Request){
  const role=accessRole(request);
  if(role!=='owner')return NextResponse.json({ok:false,message:'Owner access required'},{status:401});
  return NextResponse.json({ok:true,storage:'contract',feed:[
    {id:'messages',kind:'messages',title:'Message Control',summary:'Review customer message threads, replies, failures, and escalations.',urgency:90,status:'open',action:'Open owner message board',href:'/owner#owner-message-board'},
    {id:'internal-board',kind:'internal-board',title:'Internal Board',summary:'Review owner-driver notes and customer-approved communications.',urgency:84,status:'open',action:'Open AI command board',href:'/owner#ai-command-interface'},
    {id:'ai-memory',kind:'ai-memory',title:'AI Memory',summary:'Review saved command threads and operational AI history.',urgency:70,status:'open',action:'Open memory ledger',href:'/ai-memory'},
    {id:'revenue',kind:'revenue',title:'Revenue Pipeline',summary:'Review leads, invoices, appointments, and follow-up.',urgency:68,status:'open',action:'Open revenue pipeline',href:'/revenue-pipeline'},
    {id:'routes',kind:'routes',title:'Routes And Delivery',summary:'Review delivery route health, appointments, and driver workflow.',urgency:65,status:'open',action:'Open driver route view',href:'/driver'}
  ],summary:{total:5,urgent:2,review:3}})
}
