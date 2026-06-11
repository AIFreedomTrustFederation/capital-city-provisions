import AccessGate from '../../components/AccessGate';
import BillingCenter from '../../components/BillingCenter';
import EmailCommandCenter from '../../components/EmailCommandCenter';

export const metadata={title:'Billing Center | Capital City Provisions',description:'Owner invoice, payment, receipt, and customer communication workflow for Capital City Provisions.'};

export default function BillingPage(){return <AccessGate role="owner"><main className="site page-flow ops-shell"><section className="page-hero poster-frame ops-hero"><div><p className="eyebrow">Owner Billing</p><h1>Invoice first. Email the record. Confirm payment before fulfillment.</h1><p className="lead">Create invoices after route and inventory review, queue customer invoice records, record approved payments, issue receipts, and prepare customer follow-up messages.</p><div className="actions"><a href="#billing-center">Open Billing Center</a><a href="#email-command">Messages</a><a href="/owner">Owner Command</a></div></div><img src="/images/capital-city-hero.png" alt="Capital City Provisions billing center"/></section><BillingCenter/><EmailCommandCenter/></main></AccessGate>}
