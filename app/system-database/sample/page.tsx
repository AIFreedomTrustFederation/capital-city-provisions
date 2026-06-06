import AccessGate from '../../../components/AccessGate';
import DatabaseOpsConsole from '../../../components/DatabaseOpsConsole';
import { fullSystemSnapshot } from '../../../lib/ccp-database';

export const metadata={title:'Sample System Database | Capital City Provisions',description:'Sample order lifecycle database for testing customer intake, driver updates, restock issues, reports, and AI learning.'};

export default function SampleSystemDatabasePage(){return <AccessGate role="owner"><DatabaseOpsConsole snapshot={fullSystemSnapshot({mode:'sample'})}/></AccessGate>}
