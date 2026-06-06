import RoleAIWorkspace from '../../components/RoleAIWorkspace';
import { customerSnapshot } from '../../lib/ops-memory';

export const metadata={title:'Customer AI Concierge | Capital City Provisions',description:'Customer-facing AI for freezer boxes, delivery routes, coupons, and giveaway clarity.'};

export default function CustomerConciergePage(){return <RoleAIWorkspace role="customer" title="Customer AI Concierge" subtitle="Help customers choose a freezer box, understand delivery, and ask clean questions before they submit a lead." memory={customerSnapshot('95661')}/>}
