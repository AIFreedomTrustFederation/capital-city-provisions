import RoleAIWorkspace from '../../components/RoleAIWorkspace';
import { customerSnapshot } from '../../lib/ops-memory';

export const metadata={title:'CCP Concierge | Capital City Provisions',description:'CCP customer concierge for freezer boxes, delivery routes, bonuses, and giveaway clarity.'};

export default function CustomerConciergePage(){return <RoleAIWorkspace role="customer" title="CCP Concierge" subtitle="Let CCP help match your freezer box, ZIP route, and delivery plan before anything is final." memory={customerSnapshot('95661')}/>}