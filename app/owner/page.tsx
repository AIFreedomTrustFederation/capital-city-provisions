import AccessGate from '../../components/AccessGate';
import InternalOpsHub from '../../components/InternalOpsHub';
import LiveOwnerLeadDashboard from '../../components/LiveOwnerLeadDashboard';
import OwnerDailyOperationsBoard from '../../components/OwnerDailyOperationsBoard';
import OwnerInternalBoardQueues from '../../components/OwnerInternalBoardQueues';
import OwnerMoneyScheduleSalesControl from '../../components/OwnerMoneyScheduleSalesControl';
import OwnerSalesToDeliveryCommandFlow from '../../components/OwnerSalesToDeliveryCommandFlow';
import OwnerCustomerExperiencePanel from '../../components/OwnerCustomerExperiencePanel';
import OwnerCustomerOperationsPanel from '../../components/OwnerCustomerOperationsPanel';
import SiteFlowAuditMap from '../../components/SiteFlowAuditMap';
import OwnerMessageBoard from '../../components/OwnerMessageBoard';
import OwnerNeedsReviewInbox from '../../components/OwnerNeedsReviewInbox';
import ProfileSetupMini from '../../components/ProfileSetupMini';
import RoleAIWorkspace from '../../components/RoleAIWorkspace';
import { fullSystemSnapshot } from '../../lib/ccp-database';
import PortalStatusCards from '../../components/PortalStatusCards';
import DailyCloseoutChecklist from '../../components/DailyCloseoutChecklist';

export const metadata={title:'Owner Command Center | Capital City Provisions',description:'Owner workspace for live orders, route health, profit signals, restock risk, driver turn-ins, reports, exports, and AI route learning.'};

function money(value:number){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value||0)}

export default function OwnerPage(){
  const live=fullSystemSnapshot();
  const report=live.ownerReport;
  const liveCounts={customers:live.database.customers.length,orders:live.database.orders.length,turnIns:live.database.driverUpdates.length,issues:live.database.restockIssues.length,learning:live.database.learningEvents.length};
  const hasLiveData=Object.values(liveCounts).some(Boolean);
  return <AccessGate role="owner"><main className="site page-flow ops-shell"><section className="page-hero poster-frame ops-hero"><div><p className="eyebrow">Owner command</p><h1>Run the day from one clean control room.</h1><p className="lead">Live customer intake, quote requests, customer operations, delivery routes, driver turn-ins, restock issues, profit signals, ratings, recovery cases, and AI learning notes stay separated from the public site.</p><div className="actions"><a href="#internal-ops-hub">Operations Hub</a><a href="#profile-setup">Setup Profile</a><a href="#needs-review">Needs Review</a><a href="#owner-message-board">Messages</a><a href="#owner-customer-ops">Customer Ops</a><a href="#owner-ai">Open Owner AI</a><a href="#owner-report">Review Report</a></div></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions owner command center"/></section><InternalOpsHub role="owner" compact/><ProfileSetupMini/><OwnerDailyOperationsBoard snapshot={live}/><OwnerInternalBoardQueues/><OwnerMoneyScheduleSalesControl snapshot={live}/><OwnerSalesToDeliveryCommandFlow snapshot={live}/><OwnerCustomerExperiencePanel/><OwnerCustomerOperationsPanel/><SiteFlowAuditMap/><PortalStatusCards role="owner" title="Owner Portal Status" subtitle="Shared execution status across owner, driver, customer, money, route, and restock work."/><DailyCloseoutChecklist/><OwnerNeedsReviewInbox memory={live} orders={live.database.orders} turnIns={live.database.driverUpdates}/><OwnerMessageBoard/><LiveOwnerLeadDashboard snapshot={live}/><section className="section ops-grid" id="owner-report"><div className="route-list ops-cards owner-summary"><article><p className="eyebrow">Live orders</p><h3>{liveCounts.orders}</h3><p>{hasLiveData?'Real records are active in the live memory.':'Live database is ready and empty until real intake arrives.'}</p></article><article><p className="eyebrow">Revenue</p><h3>{money(report.revenue)}</h3><p>Estimated profit: {money(report.estimatedProfit)} at {report.margin}% margin.</p></article><article><p className="eyebrow">Restock risk</p><h3>{report.restockIssues}</h3><p>{report.ownerActions[0]}</p></article><article><p className="eyebrow">Training records</p><h3>{live.trainingDataset.records.length}</h3><p>Order, driver, and learning events become reviewed training material.</p></article></div><aside className="ops-side"><p className="eyebrow">Live system</p><h2>No demo records shown</h2><p>This command center only displays real intake, orders, driver updates, restock issues, sales leads, and owner-approved learning records.</p></aside></section><section className="section"><p className="eyebrow">Owner workflow</p><h2>What the system should surface first.</h2><div className="route-list ops-cards">{report.ownerActions.map(action=><article key={action}><h3>Action</h3><p>{action}</p></article>)}</div></section><section id="owner-ai"><RoleAIWorkspace role="owner" title="Owner AI Workspace" subtitle="Ask about live orders, routes, driver turn-ins, restock issues, exports, profit, daily priorities, and route-learning signals." memory={live}/></section></main></AccessGate>
}
