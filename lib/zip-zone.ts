import { serviceZip } from './service-area';

export type ZipZone={
  zip:string;
  status:'unknown'|'active'|'group-route'|'edge-route'|'manual-review';
  city:string;
  county:string;
  ring:string;
  minutes:number|null;
  priority:number;
  message:string;
  notes:string;
};

export function cleanZip(value:unknown){return String(value||'').replace(/\D/g,'').slice(0,5)}

export function zipZone(value:unknown):ZipZone{
  const zip=cleanZip(value);
  const area=serviceZip(zip);
  if(!zip)return {zip,status:'unknown',city:'',county:'',ring:'unknown',minutes:null,priority:0,message:'ZIP not provided yet.',notes:'Ask customer for ZIP before promising delivery.'};
  if(!area)return {zip,status:'manual-review',city:'',county:'',ring:'outside',minutes:null,priority:0,message:'Outside mapped one-hour Rancho Cordova delivery area. Manual route review required before promising delivery.',notes:'Join route request list or confirm grouped delivery manually.'};
  const status=area.ring==='hub'||area.ring==='core'?'active':area.ring==='near'?'group-route':'edge-route';
  const message=status==='active'?`${area.city} ${area.zip} is inside the active local delivery area.`:status==='group-route'?`${area.city} ${area.zip} is inside the grouped delivery area.`:`${area.city} ${area.zip} is inside the one-hour edge area; group orders before dispatch.`;
  return {zip,status,city:area.city,county:area.county,ring:area.ring,minutes:area.minutes,priority:area.priority,message,notes:area.notes};
}

export function withZipZone<T extends Record<string,any>>(record:T){
  const zone=zipZone(record.zip||record.address||record.deliveryZip);
  return {...record,zip:zone.zip||record.zip,zipZone:zone,deliveryZoneStatus:zone.status,deliveryZoneCity:zone.city,deliveryZoneCounty:zone.county,deliveryZoneRing:zone.ring,deliveryZoneMinutes:zone.minutes,deliveryZonePriority:zone.priority,deliveryZoneMessage:zone.message,deliveryZoneNotes:zone.notes};
}
