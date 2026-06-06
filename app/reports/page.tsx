import RoleAIWorkspace from '../../components/RoleAIWorkspace';
import { ownerSnapshot } from '../../lib/ops-memory';

export const metadata={title:'Reports | Capital City Provisions',description:'Daily reports, route learning, order exports, driver turn-ins, and owner priorities.'};

export default function ReportsPage(){return <RoleAIWorkspace role="owner" title="Reports And Route Learning" subtitle="Turn daily activity into clear owner reports, route training notes, exports, and next actions." memory={ownerSnapshot()}/>}
