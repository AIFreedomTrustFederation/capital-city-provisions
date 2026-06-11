import AccessGate from '../../components/AccessGate';
import RevenuePipelineCenter from '../../components/RevenuePipelineCenter';

export const metadata={title:'Revenue Pipeline | Capital City Provisions',description:'Owner workflow for moving cold-knock and driver-sales leads into invoices, payments, receipts, and delivery follow-up.'};

export default function RevenuePipelinePage(){return <AccessGate role="owner"><main className="site page-flow ops-shell"><section className="page-hero poster-frame ops-hero"><div><p className="eyebrow">Revenue Pipeline</p><h1>From cold knock to invoice to receipt.</h1><p className="lead">A seamless owner workflow for converting real field-sales leads into email-first invoices, payment records, receipts, and next delivery steps.</p><div className="actions"><a href="#revenue-pipeline">Open Pipeline</a><a href="/field-sales">Field Sales</a><a href="/billing">Billing Center</a></div></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions revenue pipeline"/></section><RevenuePipelineCenter/></main></AccessGate>}
