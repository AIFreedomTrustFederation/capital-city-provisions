import AccessGate from '../../components/AccessGate';
import RoleAIWorkspace from '../../components/RoleAIWorkspace';
import { driverSnapshot } from '../../lib/ops-memory';

export const metadata={title:'Driver Ops | Capital City Provisions',description:'Driver route workspace for orders, delivery notes, route summaries, and daily turn-ins.'};

export default function DriverPage(){return <AccessGate role="driver"><RoleAIWorkspace role="driver" title="Driver Ops" subtitle="Run the delivery day from assigned routes, stop notes, customer contact needs, and turn-ins." memory={driverSnapshot('Marco')}/></AccessGate>}
