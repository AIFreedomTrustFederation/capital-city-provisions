import { NextResponse } from 'next/server';
import { serviceAreaSummary, serviceZip } from '../../../lib/service-area';

function cleanZip(value:unknown){return String(value||'').replace(/\D/g,'').slice(0,5)}
function deliveryCopy(zip:string){
  const area=serviceZip(zip);
  if(!zip)return {status:'unknown',headline:'Enter your ZIP to check local delivery.',message:'We route freezer-box deliveries from Rancho Cordova 95670 and group nearby ZIPs for the best delivery windows.'};
  if(!area)return {status:'manual-review',headline:'Route request needed.',message:'This ZIP is outside the mapped one-hour Rancho Cordova delivery area. Join the route request list and we will confirm grouped delivery before promising a window.'};
  if(area.ring==='hub'||area.ring==='core')return {status:'active',headline:'You are inside our active local delivery area.',message:`${area.city} ${area.zip} is a ${area.ring} ZIP about ${area.minutes} minutes from Rancho Cordova. We can prioritize this for local freezer-box delivery.`};
  if(area.ring==='near')return {status:'group-route',headline:'You are inside our grouped delivery area.',message:`${area.city} ${area.zip} is about ${area.minutes} minutes from Rancho Cordova. We group nearby orders for the best route window.`};
  return {status:'edge-route',headline:'You are inside the one-hour edge area.',message:`${area.city} ${area.zip} is about ${area.minutes} minutes from Rancho Cordova. We should group orders before dispatching and confirm timing before promising delivery.`};
}

export async function GET(request:Request){
  const url=new URL(request.url);
  const zip=cleanZip(url.searchParams.get('zip'));
  const area=serviceZip(zip);
  return NextResponse.json({ok:true,zip,hub:serviceAreaSummary().hub,deliveryZone:area,coverage:deliveryCopy(zip),summary:serviceAreaSummary()});
}
