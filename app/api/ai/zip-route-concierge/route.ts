import { NextResponse } from 'next/server';
import { zipZone } from '../../../../lib/zip-zone';

type Input=Record<string,any>;
function clean(value:unknown){return String(value||'').trim()}

function routeFromZip(zipValue:unknown){
  const zone=zipZone(zipValue);
  const route=zone.status==='active'?`${zone.city||'Rancho Cordova'} Active Local Route`:zone.status==='group-route'?`${zone.city} Grouped Route`:zone.status==='edge-route'?`${zone.city} Edge Route`:'Manual Route Review';
  const deliveryStatus=zone.status==='manual-review'?'manual-review':zone.status==='edge-route'?'confirm-before-promise':zone.status==='group-route'?'grouped-delivery':'active-delivery';
  const customerMessage=zone.status==='manual-review'?'Your ZIP needs manual route review before we promise delivery timing.':'Your ZIP is inside our Rancho Cordova delivery map. We will confirm the best grouped delivery window before anything is locked in.';
  return {route,deliveryStatus,customerMessage,zipZone:zone};
}

function recommendBox(input:Input){
  const interest=clean(input.interest).toLowerCase();
  const family=clean(input.familySize).toLowerCase();
  if(interest.includes('wholesale'))return 'Wholesale Provisioning Account';
  if(family.includes('5')||family.includes('6')||family.includes('7')||family.includes('family'))return 'Family Box';
  if(interest.includes('steak'))return 'Steak Stock-Up Box';
  return 'Starter Box';
}

export async function POST(request:Request){
  try{
    const input=await request.json();
    const route=routeFromZip(input.zip||input.address);
    const recommendation=recommendBox(input);
    return NextResponse.json({ok:true,source:'zip-zone-rules',recommendation:{route,recommendation,budget:clean(input.budget)||'$300-$500',nextStep:route.zipZone.status==='manual-review'?'Join route request and wait for manual confirmation.':'Continue with freezer-box planning and final route confirmation.',giveaway:{available:true,entryPath:'/giveaway',purchaseRequired:false,purchaseImprovesOdds:false},promo:{description:'Order gifts and giveaway entries stay separate.'}}});
  }catch(error){
    return NextResponse.json({ok:false,message:'ZIP route concierge failed'},{status:500});
  }
}
