import { NextResponse } from 'next/server';
import { serviceAreaSummary, serviceZip } from '../../../lib/service-area';
import { cleanZip, zipZone } from '../../../lib/zip-zone';

function deliveryCopy(zip:string){
  const zone=zipZone(zip);
  if(zone.status==='unknown')return {status:'unknown',headline:'Enter your ZIP to check local delivery.',message:'We route freezer-box deliveries from Rancho Cordova 95670 and group nearby ZIPs for the best delivery windows.'};
  if(zone.status==='manual-review')return {status:'manual-review',headline:'Route request needed.',message:'This ZIP is outside the mapped one-hour Rancho Cordova delivery area. Join the route request list and we will confirm grouped delivery before promising a window.'};
  if(zone.status==='active')return {status:'active',headline:'You are inside our active local delivery area.',message:`${zone.city} ${zone.zip} is a ${zone.ring} ZIP about ${zone.minutes} minutes from Rancho Cordova. We can prioritize this for local freezer-box delivery.`};
  if(zone.status==='group-route')return {status:'group-route',headline:'You are inside our grouped delivery area.',message:`${zone.city} ${zone.zip} is about ${zone.minutes} minutes from Rancho Cordova. We group nearby orders for the best route window.`};
  return {status:'edge-route',headline:'You are inside the one-hour edge area.',message:`${zone.city} ${zone.zip} is about ${zone.minutes} minutes from Rancho Cordova. We should group orders before dispatching and confirm timing before promising delivery.`};
}

export async function GET(request:Request){
  const url=new URL(request.url);
  const zip=cleanZip(url.searchParams.get('zip'));
  const area=serviceZip(zip);
  const zone=zipZone(zip);
  return NextResponse.json({ok:true,zip,hub:serviceAreaSummary().hub,deliveryZone:area,zipZone:zone,coverage:deliveryCopy(zip),summary:serviceAreaSummary()});
}
