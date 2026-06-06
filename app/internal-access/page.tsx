import AccessGate from '../../components/AccessGate';

export const metadata={title:'Internal Access | Capital City Provisions',description:'Secure access for Capital City Provisions driver and owner workspaces.'};

type PageProps={searchParams?:Promise<{role?:string;returnTo?:string}>};

export default async function InternalAccessPage({searchParams}:PageProps){
  const params=await searchParams;
  const role=params?.role==='driver'?'driver':'owner';
  const returnTo=params?.returnTo|| (role==='driver'?'/driver':'/owner');
  return <AccessGate role={role} returnTo={returnTo}/>;
}
