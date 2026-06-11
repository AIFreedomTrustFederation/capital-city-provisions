export type ServiceAreaRing='hub'|'core'|'near'|'extended';

export type ServiceZip={
  zip:string;
  city:string;
  county:string;
  ring:ServiceAreaRing;
  minutes:number;
  priority:number;
  notes:string;
};

export const SERVICE_AREA_HUB={zip:'95670',city:'Rancho Cordova',state:'CA',driveWindowMinutes:60};

export const SERVICE_ZIPS:ServiceZip[]=[
  {zip:'95670',city:'Rancho Cordova',county:'Sacramento',ring:'hub',minutes:0,priority:100,notes:'Home hub and first-route anchor.'},
  {zip:'95742',city:'Rancho Cordova',county:'Sacramento',ring:'hub',minutes:12,priority:98,notes:'Rancho Cordova east growth route.'},
  {zip:'95827',city:'Rancho Cordova / Rosemont',county:'Sacramento',ring:'hub',minutes:12,priority:96,notes:'Near hub and dense delivery opportunity.'},
  {zip:'95826',city:'Rosemont / Sacramento',county:'Sacramento',ring:'core',minutes:15,priority:94,notes:'Close-in Sacramento route density.'},
  {zip:'95655',city:'Mather',county:'Sacramento',ring:'core',minutes:10,priority:93,notes:'Immediate hub-adjacent delivery zone.'},
  {zip:'95829',city:'Vineyard / Sacramento',county:'Sacramento',ring:'core',minutes:20,priority:90,notes:'South Sacramento growth corridor.'},
  {zip:'95828',city:'Florin / Sacramento',county:'Sacramento',ring:'core',minutes:25,priority:88,notes:'Dense household route opportunity.'},
  {zip:'95823',city:'Parkway / Sacramento',county:'Sacramento',ring:'core',minutes:25,priority:87,notes:'South Sacramento freezer-box density.'},
  {zip:'95824',city:'Sacramento',county:'Sacramento',ring:'core',minutes:25,priority:86,notes:'Close-in urban route.'},
  {zip:'95820',city:'Sacramento',county:'Sacramento',ring:'core',minutes:25,priority:86,notes:'Close-in urban route.'},
  {zip:'95819',city:'East Sacramento',county:'Sacramento',ring:'core',minutes:25,priority:88,notes:'Higher-value steak and stock-up route.'},
  {zip:'95825',city:'Arden-Arcade',county:'Sacramento',ring:'core',minutes:25,priority:88,notes:'Central demand zone.'},
  {zip:'95821',city:'Arden-Arcade',county:'Sacramento',ring:'core',minutes:28,priority:86,notes:'Central demand zone.'},
  {zip:'95864',city:'Arden-Arcade',county:'Sacramento',ring:'core',minutes:30,priority:88,notes:'Premium household potential.'},
  {zip:'95608',city:'Carmichael',county:'Sacramento',ring:'core',minutes:25,priority:90,notes:'Strong freezer-box and steak household market.'},
  {zip:'95628',city:'Fair Oaks',county:'Sacramento',ring:'core',minutes:22,priority:92,notes:'High-priority premium household market.'},
  {zip:'95662',city:'Orangevale',county:'Sacramento',ring:'core',minutes:25,priority:90,notes:'Route-friendly freezer-box market.'},
  {zip:'95630',city:'Folsom',county:'Sacramento',ring:'core',minutes:20,priority:95,notes:'Premium family and steak market.'},
  {zip:'95762',city:'El Dorado Hills',county:'El Dorado',ring:'core',minutes:30,priority:96,notes:'Premium owner-box and steak route.'},
  {zip:'95610',city:'Citrus Heights',county:'Sacramento',ring:'core',minutes:30,priority:88,notes:'Dense suburban route.'},
  {zip:'95621',city:'Citrus Heights',county:'Sacramento',ring:'core',minutes:32,priority:86,notes:'Dense suburban route.'},
  {zip:'95661',city:'Roseville',county:'Placer',ring:'near',minutes:35,priority:94,notes:'Premium freezer-box market.'},
  {zip:'95678',city:'Roseville',county:'Placer',ring:'near',minutes:38,priority:92,notes:'Dense Roseville route.'},
  {zip:'95747',city:'Roseville',county:'Placer',ring:'near',minutes:45,priority:90,notes:'West Roseville growth corridor.'},
  {zip:'95746',city:'Granite Bay',county:'Placer',ring:'near',minutes:35,priority:95,notes:'Premium steak and owner-box route.'},
  {zip:'95677',city:'Rocklin',county:'Placer',ring:'near',minutes:40,priority:90,notes:'Strong suburban route.'},
  {zip:'95765',city:'Rocklin',county:'Placer',ring:'near',minutes:45,priority:89,notes:'Strong suburban route.'},
  {zip:'95650',city:'Loomis',county:'Placer',ring:'near',minutes:45,priority:86,notes:'Extended premium suburban/rural edge.'},
  {zip:'95648',city:'Lincoln',county:'Placer',ring:'extended',minutes:55,priority:82,notes:'One-hour edge; group orders before dispatch.'},
  {zip:'95602',city:'Auburn',county:'Placer',ring:'extended',minutes:55,priority:80,notes:'One-hour foothill edge; route only with grouped demand.'},
  {zip:'95603',city:'Auburn',county:'Placer',ring:'extended',minutes:60,priority:78,notes:'Foothill edge; confirm route economics.'},
  {zip:'95682',city:'Cameron Park / Shingle Springs',county:'El Dorado',ring:'extended',minutes:45,priority:84,notes:'Foothill route; group with El Dorado Hills.'},
  {zip:'95667',city:'Placerville',county:'El Dorado',ring:'extended',minutes:60,priority:76,notes:'One-hour edge; group orders before dispatch.'},
  {zip:'95843',city:'Antelope',county:'Sacramento',ring:'near',minutes:38,priority:84,notes:'North county suburban route.'},
  {zip:'95660',city:'North Highlands',county:'Sacramento',ring:'core',minutes:32,priority:82,notes:'Route density opportunity.'},
  {zip:'95673',city:'Rio Linda',county:'Sacramento',ring:'near',minutes:38,priority:80,notes:'North county route, group stops.'},
  {zip:'95833',city:'Natomas / Sacramento',county:'Sacramento',ring:'core',minutes:30,priority:84,notes:'Good delivery density.'},
  {zip:'95834',city:'Natomas / Sacramento',county:'Sacramento',ring:'core',minutes:32,priority:84,notes:'Good delivery density.'},
  {zip:'95835',city:'Natomas / Sacramento',county:'Sacramento',ring:'near',minutes:35,priority:82,notes:'Good delivery density.'},
  {zip:'95831',city:'Pocket / Sacramento',county:'Sacramento',ring:'near',minutes:35,priority:86,notes:'Premium household route.'},
  {zip:'95822',city:'South Land Park / Sacramento',county:'Sacramento',ring:'near',minutes:32,priority:84,notes:'Good household market.'},
  {zip:'95818',city:'Land Park / Sacramento',county:'Sacramento',ring:'core',minutes:28,priority:88,notes:'Premium urban route.'},
  {zip:'95816',city:'Midtown / Sacramento',county:'Sacramento',ring:'core',minutes:28,priority:84,notes:'Urban route; coordinate parking/delivery notes.'},
  {zip:'95814',city:'Downtown Sacramento',county:'Sacramento',ring:'core',minutes:30,priority:80,notes:'Urban route; coordinate parking/delivery notes.'},
  {zip:'95624',city:'Elk Grove',county:'Sacramento',ring:'near',minutes:35,priority:88,notes:'Family freezer-box market.'},
  {zip:'95757',city:'Elk Grove',county:'Sacramento',ring:'near',minutes:42,priority:88,notes:'Family freezer-box growth corridor.'},
  {zip:'95758',city:'Elk Grove',county:'Sacramento',ring:'near',minutes:40,priority:88,notes:'Dense family freezer-box route.'},
  {zip:'95759',city:'Elk Grove',county:'Sacramento',ring:'near',minutes:42,priority:86,notes:'Elk Grove route extension.'},
  {zip:'95632',city:'Galt',county:'Sacramento',ring:'extended',minutes:55,priority:78,notes:'One-hour edge; group orders before dispatch.'},
  {zip:'95605',city:'West Sacramento',county:'Yolo',ring:'core',minutes:32,priority:82,notes:'Good bridge route.'},
  {zip:'95691',city:'West Sacramento',county:'Yolo',ring:'core',minutes:35,priority:84,notes:'Good bridge route.'},
  {zip:'95616',city:'Davis',county:'Yolo',ring:'near',minutes:45,priority:86,notes:'Premium university/household route.'},
  {zip:'95618',city:'Davis',county:'Yolo',ring:'near',minutes:45,priority:86,notes:'Premium household route.'},
  {zip:'95695',city:'Woodland',county:'Yolo',ring:'extended',minutes:52,priority:80,notes:'One-hour edge; group with Davis/West Sac.'},
  {zip:'95776',city:'Woodland',county:'Yolo',ring:'extended',minutes:55,priority:78,notes:'One-hour edge; group with Davis/West Sac.'},
  {zip:'95694',city:'Winters',county:'Yolo',ring:'extended',minutes:60,priority:74,notes:'One-hour edge; route only with grouped demand.'}
];

export function serviceZip(zip:unknown){const key=String(zip||'').trim();return SERVICE_ZIPS.find(item=>item.zip===key)||null}
export function isServiceZip(zip:unknown){return Boolean(serviceZip(zip))}
export function serviceAreaSummary(){return {hub:SERVICE_AREA_HUB,totalZips:SERVICE_ZIPS.length,rings:{hub:SERVICE_ZIPS.filter(z=>z.ring==='hub').length,core:SERVICE_ZIPS.filter(z=>z.ring==='core').length,near:SERVICE_ZIPS.filter(z=>z.ring==='near').length,extended:SERVICE_ZIPS.filter(z=>z.ring==='extended').length},zips:SERVICE_ZIPS}}
export function rankServiceDemand(rows:any[],valueKey='value'){
  const map:Record<string,any>={};
  for(const row of rows||[]){const zip=String(row.zip||'').trim()||'unknown';const service=serviceZip(zip);const key=zip;map[key]=map[key]||{zip,service,orders:0,leads:0,value:0,score:0,records:[]};map[key].value+=Number(row[valueKey]||row.value||row.estimatedValue||0);map[key].records.push(row);if(row.leadName)map[key].leads+=1;else map[key].orders+=1;map[key].score+=Number(row[valueKey]||row.value||row.estimatedValue||0)+(service?.priority||20)*10-(service?.minutes||75)*4;}
  return Object.values(map).sort((a:any,b:any)=>b.score-a.score);
}
