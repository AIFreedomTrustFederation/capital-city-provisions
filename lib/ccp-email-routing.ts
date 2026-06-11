export type CcpEmailDepartment='sales'|'billing'|'delivery'|'support'|'owner';

export const CCP_BASE_GMAIL='aifreedomtrust@gmail.com';
export const CCP_DEPARTMENT_EMAILS:Record<CcpEmailDepartment,string>={
  sales:'aifreedomtrust+ccp-sales@gmail.com',
  billing:'aifreedomtrust+ccp-billing@gmail.com',
  delivery:'aifreedomtrust+ccp-delivery@gmail.com',
  support:'aifreedomtrust+ccp-support@gmail.com',
  owner:'aifreedomtrust+ccp-owner@gmail.com'
};

export function departmentForStage(stage?:string):CcpEmailDepartment{
  if(stage?.includes('invoice')||stage?.includes('receipt'))return 'billing';
  if(stage?.includes('appointment')||stage?.includes('delivery'))return 'delivery';
  if(stage?.includes('quote')||stage?.includes('lead'))return 'sales';
  return 'support';
}

function enc(value:string){return encodeURIComponent(value)}

export function mailtoUrl(input:{to:string;subject:string;body:string;department?:CcpEmailDepartment}){
  const dept=input.department||'support';
  const reply=CCP_DEPARTMENT_EMAILS[dept];
  const body=[input.body,'',`---`, `Reply-to department: ${reply}`].join('\n');
  return `mailto:${enc(input.to)}?subject=${enc(input.subject)}&body=${enc(body)}`;
}

export function gmailComposeUrl(input:{to:string;subject:string;body:string;department?:CcpEmailDepartment}){
  const dept=input.department||'support';
  const reply=CCP_DEPARTMENT_EMAILS[dept];
  const body=[input.body,'',`---`, `CCP Department Route: ${reply}`].join('\n');
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${enc(input.to)}&su=${enc(input.subject)}&body=${enc(body)}`;
}

export function inboundForwardingAddress(department:CcpEmailDepartment){return CCP_DEPARTMENT_EMAILS[department]}
