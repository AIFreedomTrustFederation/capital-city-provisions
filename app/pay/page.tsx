import CustomerDepositIntent from '../../components/CustomerDepositIntent';

export const metadata={
  title:'Deposit / Invoice Request | Capital City Provisions',
  description:'Request a freezer box deposit or manual invoice after quote review.'
};

export default function PayPage(){
  return (
    <main className="site page-flow mvp-shell">
      <section className="section mvp-panel">
        <p className="mvp-eyebrow">Payment Next Step</p>
        <h1 className="mvp-title">Deposit or invoice request.</h1>
        <p className="mvp-subtitle">Use this page after starting a quote. The team confirms delivery timing, inventory, final total, and payment instructions before fulfillment.</p>
        <div className="mvp-actions">
          <a className="mvp-button" href="#pay-deposit">Save Deposit Request</a>
          <a className="mvp-button-gold" href="/customer#customer-account-journey">Start Quote First</a>
          <a className="mvp-button-secondary" href="/reviews">Read Reviews</a>
        </div>
      </section>
      <CustomerDepositIntent/>
    </main>
  );
}
