import AccessGate from '../../components/AccessGate';
import RoleAIWorkspace from '../../components/RoleAIWorkspace';
import { fullSystemSnapshot } from '../../lib/ccp-database';

export const metadata={title:'Reports | Capital City Provisions',description:'Daily reports, route learning, order exports, driver turn-ins, profit, loss, restock, and owner priorities.'};

export default function ReportsPage(){return <AccessGate role="owner"><RoleAIWorkspace role="owner" title="Reports And Route Learning" subtitle="Turn daily database activity into clear owner reports, route training notes, exports, restock planning, and next actions." memory={fullSystemSnapshot()}/></AccessGate>}
