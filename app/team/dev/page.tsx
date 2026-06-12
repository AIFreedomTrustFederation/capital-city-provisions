import AccessGate from '../../../components/AccessGate';
import DevOnlyAIStatusBoard from '../../../components/DevOnlyAIStatusBoard';

export const metadata={
  title:'Dev Only AI Status | Capital City Provisions',
  description:'Owner/team-gated diagnostics for AI context, recursive customer operations, API health, persistence, and public language safety.'
};

export default function TeamDevPage(){
  return (
    <AccessGate role="owner">
      <main className="site page-flow ops-shell">
        <DevOnlyAIStatusBoard/>
      </main>
    </AccessGate>
  );
}
