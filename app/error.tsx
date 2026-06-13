'use client';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="page-shell error-page">
      <section className="hero-panel">
        <p className="eyebrow">Capital City Provisions</p>
        <h1>Something needs attention.</h1>
        <p>We hit an application error while loading this page. You can retry, or return to the home page.</p>
        {error?.message && <p className="fine-print">Error: {error.message}</p>}
        <div className="actions">
          <button onClick={reset}>Try again</button>
          <a href="/">Home</a>
        </div>
      </section>
    </main>
  );
}
