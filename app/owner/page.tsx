import RoleAIWorkspace from '../../components/RoleAIWorkspace';
import { ownerSnapshot } from '../../lib/ops-memory';

export const metadata={title:'Owner Command Center | Capital City Provisions',description:'Owner AI workspace for orders, routes, reports, driver turn-ins, lead priority, and route learning.'};

export default function OwnerPage(){return <RoleAIWorkspace role="owner" title="Owner Command Center" subtitle="Chat with orders, routes, reports, turn-ins, route learning notes, and daily priorities from one place." memory={ownerSnapshot()}/>}
