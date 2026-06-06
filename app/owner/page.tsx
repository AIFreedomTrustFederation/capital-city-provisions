import RoleAIWorkspace from '../../components/RoleAIWorkspace';
import { fullSystemSnapshot } from '../../lib/ccp-database';

export const metadata={title:'Owner Command Center | Capital City Provisions',description:'Owner AI workspace for orders, routes, reports, driver turn-ins, lead priority, route learning, and system database records.'};

export default function OwnerPage(){return <RoleAIWorkspace role="owner" title="Owner Command Center" subtitle="Chat with orders, routes, reports, turn-ins, lifecycle records, restock issues, route learning notes, and daily priorities from one place." memory={fullSystemSnapshot()}/>}
