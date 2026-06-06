import DatabaseOpsConsole from '../../components/DatabaseOpsConsole';
import { fullSystemSnapshot } from '../../lib/ccp-database';

export const metadata={title:'System Database | Capital City Provisions',description:'Order lifecycle database for customer intake, delivery status, fulfillment, restock issues, route fuel efficiency, owner reports, and AI learning.'};

export default function SystemDatabasePage(){return <DatabaseOpsConsole snapshot={fullSystemSnapshot()}/>}
