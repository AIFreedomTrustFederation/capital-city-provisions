import {NextResponse} from 'next/server';

const store=globalThis as typeof globalThis&{ccpReviews?:any[]};
function reviews(){if(!store.ccpReviews)store.ccpReviews=[];return store.ccpReviews}
function clean(v:unknown,n=500){return String(v||'').trim().slice(0,n)}
function accessRole(request:Request){return (request.headers.get('cookie')||'').match(/(?:^|; )ccp_access=([^;]+)/)?.[1]||''}

export async function GET(request:Request){const role=accessRole(request);const all=reviews().sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)));const visible=role==='owner'?all:all.filter(r=>r.status==='approved');return NextResponse.json({ok:true,reviews:visible})}

export async function POST(request:Request){try{const input=await request.json();const review={id:`review-${Date.now()}`,name:clean(input.name,80)||'Capital City Provisions Customer',city:clean(input.city,80),rating:Math.min(5,Math.max(1,Number(input.rating||5))),box:clean(input.box,120),quote:clean(input.quote,900),permission:clean(input.permission)||'first-name-city',status:'pending',source:'customer-review',createdAt:new Date().toISOString()};reviews().unshift(review);return NextResponse.json({ok:true,review,message:'Thank you. Your review was received and will be reviewed before it is published.'})}catch{return NextResponse.json({ok:false,message:'Review could not be saved.'},{status:500})}}
