const menuUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://capital-city-provisions.vercel.app'}/menu`;
const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=360x360&margin=20&data=${encodeURIComponent(menuUrl)}`;

const cuts = [
  { qty: '6', name: 'Filet Steaks', value: '$140' },
  { qty: '4', name: 'Ribeye Steaks', value: '$120' },
  { qty: '4', name: 'New York Steaks', value: '$120' },
  { qty: '6', name: 'Pepper Steaks', value: '$111' },
  { qty: '2', name: 'T-Bone Steaks', value: '$89' },
  { qty: '8', name: 'Steak Burgers', value: '$79' },
];

const deals = [
  { amount: '1 Box', discount: '25% OFF', price: '$494.25', note: 'per box' },
  { amount: '2–3 Boxes', discount: '30% OFF', price: '$461.30', note: 'per box' },
  { amount: '4 or More Boxes', discount: 'Up to 40% OFF', price: '$395.40', note: 'as low as per box' },
];

const trust = [
  'Pasture-born quality positioning',
  'Triple-trimmed premium beef',
  'Cryovac packed and freezer-ready',
  'Flash-frozen for long-lasting freshness',
  'Free local delivery',
  'Cash, check, and credit cards accepted',
];

export const metadata = {
  title: 'Premium Steak Box Menu | Capital City Provisions',
  description: 'Premium steak box menu with filet steaks, ribeyes, New York steaks, pepper steaks, T-bones, steak burgers, free delivery, and bulk box pricing.',
};

export default function MenuPage() {
  return (
    <main className="menu-page">
      <section className="menu-hero">
        <div className="menu-hero-copy">
          <p className="menu-kicker">Capital City Provisions</p>
          <h1>Premium Steak Box Menu</h1>
          <p className="menu-subtitle">Retail Value $659 Per Box</p>
          <p className="menu-lead">Stock your freezer with premium steaks and save more when you buy more. Free local delivery available in active route areas.</p>
          <div className="menu-actions">
            <a href="tel:+19165345716">Call +1 916 534 5716</a>
            <a href="#pricing">See Box Deal Pricing</a>
            <a href="#qr-menu">Scan QR</a>
          </div>
        </div>
        <div className="menu-guarantee-card">
          <span>100%</span>
          <strong>Pasture Born Guaranteed</strong>
          <p>Premium selection. Standard quality. Free delivery.</p>
        </div>
      </section>

      <section className="menu-grid" aria-label="Premium steak box menu details">
        <article className="menu-panel box-includes">
          <p className="menu-kicker">Each Box Includes</p>
          <h2>Premium Steak Box</h2>
          <div className="cut-list">
            {cuts.map((cut) => (
              <div className="cut-row" key={cut.name}>
                <span className="cut-icon">🥩</span>
                <strong>{cut.qty} {cut.name}</strong>
                <span>{cut.value}</span>
              </div>
            ))}
          </div>
          <div className="total-value">Total Retail Value: $659</div>
        </article>

        <article className="menu-panel pricing-panel" id="pricing">
          <p className="menu-kicker">Box Deal Pricing</p>
          <h2>Buy More. Save More.</h2>
          <div className="deal-list">
            {deals.map((deal) => (
              <div className="deal-row" key={deal.amount}>
                <strong>{deal.amount}</strong>
                <span>{deal.discount}</span>
                <em>{deal.price}<small>{deal.note}</small></em>
              </div>
            ))}
          </div>
          <div className="freezer-offer">Free freezer with 4 or more boxes</div>
        </article>

        <article className="menu-panel guarantee-panel">
          <p className="menu-kicker">Guaranteed</p>
          <h2>Fresh, Freezer-Ready, Recently Packaged</h2>
          <p>We ensure our products are fresh and recently packaged. All products are flash-frozen, supporting a one-year freshness guarantee from the packaging date.</p>
          <ul>
            {trust.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p className="confidence">Enjoy with confidence.</p>
        </article>

        <article className="menu-panel qr-panel" id="qr-menu">
          <p className="menu-kicker">Scan QR for the Menu</p>
          <h2>Customer Menu QR</h2>
          <img src={qrSrc} alt="QR code for Capital City Provisions premium steak box menu" />
          <p className="qr-url">{menuUrl}</p>
          <a href={qrSrc} target="_blank" rel="noreferrer">Open printable QR</a>
        </article>
      </section>

      <section className="menu-bottom-cta">
        <p className="menu-kicker">Call Now</p>
        <h2>Free Delivery • Premium Selection • Standard Quality</h2>
        <a href="tel:+19165345716">+1 916 534 5716</a>
        <p>We proudly accept cash, check, and credit cards.</p>
      </section>

      <style>{`
        .menu-page{min-height:100vh;background:#080604;color:#f7ead5;font-family:Inter,system-ui,sans-serif;overflow:hidden}
        .menu-page:before{content:'';position:fixed;inset:0;pointer-events:none;background:radial-gradient(circle at 80% 8%,rgba(171,24,18,.35),transparent 28rem),radial-gradient(circle at 10% 18%,rgba(199,148,64,.22),transparent 24rem),linear-gradient(135deg,rgba(255,255,255,.05) 0,transparent 32%);opacity:.9}
        .menu-hero,.menu-grid,.menu-bottom-cta{position:relative;z-index:1;width:min(1180px,92vw);margin:0 auto}
        .menu-hero{display:grid;grid-template-columns:1fr 320px;gap:2rem;padding:5rem 0 2.2rem;align-items:center}
        .menu-kicker{text-transform:uppercase;letter-spacing:.18em;color:#d6a34e;font-weight:900;font-size:.78rem;margin:0 0 .7rem}
        .menu-hero h1{font-size:clamp(3.1rem,8vw,7.7rem);line-height:.86;margin:0;text-transform:uppercase;font-family:Georgia,serif;text-shadow:0 4px 0 #2d0907}
        .menu-subtitle{font-family:Georgia,serif;color:#f3d28b;font-size:clamp(1.4rem,3vw,2.3rem);font-weight:900;margin:1rem 0}
        .menu-lead{max-width:720px;color:#eadfce;font-size:1.08rem;line-height:1.7}
        .menu-actions{display:flex;flex-wrap:wrap;gap:.85rem;margin-top:1.6rem}
        .menu-actions a,.qr-panel a,.menu-bottom-cta a{background:linear-gradient(135deg,#b1130d,#74110c);color:white;text-decoration:none;font-weight:950;border:1px solid #e4b15c;border-radius:999px;padding:.9rem 1.2rem;box-shadow:0 10px 28px rgba(0,0,0,.35)}
        .menu-guarantee-card{border:2px solid #d9a052;border-radius:50%;aspect-ratio:1;padding:2rem;display:grid;place-items:center;text-align:center;background:radial-gradient(circle,#f1c46c,#8c4f11 70%,#3b1506);color:#130a04;box-shadow:0 16px 60px rgba(0,0,0,.55)}
        .menu-guarantee-card span{font-size:4rem;font-weight:1000}.menu-guarantee-card strong{text-transform:uppercase;font-size:1.3rem}.menu-guarantee-card p{font-weight:800}
        .menu-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:1.2rem;padding:1rem 0 3rem}
        .menu-panel{background:linear-gradient(180deg,rgba(21,17,14,.96),rgba(8,7,6,.96));border:1px solid rgba(222,171,92,.55);border-radius:28px;padding:1.6rem;box-shadow:0 18px 54px rgba(0,0,0,.38);position:relative;overflow:hidden}
        .menu-panel:after{content:'';position:absolute;inset:auto -12% -40% auto;width:340px;height:340px;border-radius:50%;background:radial-gradient(circle,rgba(190,22,17,.22),transparent 66%)}
        .menu-panel h2{font-family:Georgia,serif;text-transform:uppercase;font-size:clamp(1.75rem,3vw,2.8rem);margin:.15rem 0 1.2rem;color:#fff4df}
        .cut-list,.deal-list{display:grid;gap:.7rem;position:relative;z-index:1}.cut-row,.deal-row{display:grid;grid-template-columns:auto 1fr auto;gap:.75rem;align-items:center;border-bottom:1px dashed rgba(237,205,151,.32);padding:.72rem 0;font-size:1.08rem}.cut-icon{font-size:1.35rem}.cut-row strong{font-family:Georgia,serif;font-size:1.25rem}.cut-row span:last-child{font-weight:950;color:white}.total-value,.freezer-offer{margin-top:1.1rem;background:#7c140f;color:#ffe6b4;border:1px solid #d9a052;border-radius:18px;padding:1rem;text-transform:uppercase;font-family:Georgia,serif;font-weight:950;font-size:1.45rem;text-align:center}
        .deal-row{grid-template-columns:1fr auto auto;background:rgba(255,255,255,.035);border:1px solid rgba(237,205,151,.18);border-radius:18px;padding:1rem}.deal-row strong{text-transform:uppercase;font-size:1.2rem}.deal-row span{color:#e2b253;font-size:1.45rem;font-weight:1000}.deal-row em{font-style:normal;font-size:2rem;font-weight:1000}.deal-row small{display:block;text-transform:uppercase;font-size:.68rem;color:#f2d7a4;text-align:right}
        .guarantee-panel p{color:#e8dfd2;line-height:1.65}.guarantee-panel ul{display:grid;grid-template-columns:1fr 1fr;gap:.7rem;margin:1rem 0 0;padding:0;list-style:none}.guarantee-panel li{background:rgba(214,163,78,.1);border:1px solid rgba(214,163,78,.25);border-radius:14px;padding:.8rem;font-weight:800}.confidence{font-family:Georgia,serif;color:#e8bd62!important;font-size:1.35rem;font-weight:900;text-align:center}
        .qr-panel{text-align:center}.qr-panel img{width:min(270px,80vw);background:white;padding:1rem;border-radius:24px;border:1px solid #e4b15c}.qr-url{word-break:break-word;color:#d7c8b5;font-size:.9rem}.qr-panel a{display:inline-block;margin-top:.7rem}
        .menu-bottom-cta{text-align:center;margin-bottom:3rem;background:linear-gradient(135deg,#8b130e,#220a08);border:1px solid #d9a052;border-radius:30px;padding:2rem}.menu-bottom-cta h2{font-family:Georgia,serif;text-transform:uppercase;margin:.2rem 0 1.2rem}.menu-bottom-cta a{display:inline-block;font-size:1.25rem}.menu-bottom-cta p:last-child{color:#eadfce;font-weight:800}
        @media(max-width:880px){.menu-hero,.menu-grid{grid-template-columns:1fr}.menu-hero{padding-top:3rem}.menu-guarantee-card{max-width:280px;margin:auto}.guarantee-panel ul{grid-template-columns:1fr}.cut-row,.deal-row{grid-template-columns:auto 1fr}.cut-row span:last-child,.deal-row em{grid-column:2}.deal-row span{font-size:1.15rem}.menu-panel{padding:1.1rem}.menu-actions a{width:100%;text-align:center}}
      `}</style>
    </main>
  );
}
