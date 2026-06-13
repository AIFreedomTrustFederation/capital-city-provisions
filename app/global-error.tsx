'use client';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px', background: '#080604', color: '#fff4df', fontFamily: 'Arial, sans-serif' }}>
          <section style={{ width: 'min(720px, 100%)', border: '1px solid rgba(226,201,143,.34)', borderRadius: '24px', padding: '24px', background: '#120b07' }}>
            <p style={{ color: '#e2c98f', textTransform: 'uppercase', letterSpacing: '.18em', fontWeight: 900 }}>Capital City Provisions</p>
            <h1 style={{ margin: '0 0 12px', fontSize: 'clamp(2rem, 8vw, 4rem)', lineHeight: 1 }}>Application recovery screen</h1>
            <p>The application hit a top-level error while rendering. This fallback is safe for production builds and local builds.</p>
            {error?.message && <p style={{ color: '#d8c9ad' }}>Error: {error.message}</p>}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '18px' }}>
              <button onClick={reset} style={{ border: '1px solid #e2c98f', borderRadius: '999px', background: '#e2c98f', color: '#080604', padding: '12px 16px', fontWeight: 900 }}>Try again</button>
              <a href="/" style={{ border: '1px solid rgba(226,201,143,.34)', borderRadius: '999px', color: '#fff4df', padding: '12px 16px', fontWeight: 900, textDecoration: 'none' }}>Home</a>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
