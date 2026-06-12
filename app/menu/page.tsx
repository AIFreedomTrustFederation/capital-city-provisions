const menuUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://capital-city-provisions.vercel.app'}/menu`;
const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=520x520&margin=20&data=${encodeURIComponent(menuUrl)}`;

const menuGraphics = [
  {
    src: '/menu/guarantee-menu.png',
    alt: 'Capital City Provisions toll free guarantee, free delivery, quality promise, QR code, and payment acceptance menu graphic',
  },
  {
    src: '/menu/premium-steak-box.png',
    alt: 'Capital City Provisions premium steak box menu with included steaks, box deal pricing, free freezer offer, free delivery, and phone number',
  },
];

const highlights = ['Premium Steak Box', 'Free Local Delivery', 'Cryovac Packed', 'Freezer-Ready Value'];

export const metadata = {
  title: 'Premium Steak Box Menu | Capital City Provisions',
  description: 'Full graphic premium steak box menu for Capital City Provisions with a hero QR code, free delivery, premium steak box pricing, and call-to-order details.',
};

export default function MenuPage() {
  return (
    <main className="graphic-menu-page">
      <section className="qr-hero" id="qr-menu" aria-label="Customer QR code for Capital City Provisions menu">
        <div className="qr-hero-copy">
          <p>Capital City Provisions</p>
          <h1>Scan QR for the Menu</h1>
          <span>{menuUrl}</span>
          <div>
            <a href="tel:+19165345716">Call +1 916 534 5716</a>
            <a href={qrSrc} target="_blank" rel="noreferrer">Open Printable QR</a>
          </div>
        </div>
        <figure className="qr-hero-code">
          <img src={qrSrc} alt="QR code to open the Capital City Provisions premium steak box menu" />
          <figcaption>Point your camera here.</figcaption>
        </figure>
      </section>

      <section className="menu-sales-strip" aria-label="Capital City Provisions menu highlights">
        <div>
          <p>Premium Steak Box</p>
          <h2>Steaks, freezer value, and local delivery in one simple menu.</h2>
          <span>Use this page for quick customer sharing, QR scans, phone orders, and premium steak-box presentation.</span>
        </div>
        <nav aria-label="Menu page actions">
          <a href="/freezer-boxes">See Boxes</a>
          <a href="/#quick-route">Check ZIP</a>
          <a href="/customer-concierge">Start Quote</a>
        </nav>
      </section>

      <section className="menu-highlight-grid" aria-label="Menu offer highlights">
        {highlights.map(item => <article key={item}>{item}</article>)}
      </section>

      <section className="graphic-menu-header">
        <p>Premium Steak Box</p>
        <h2>Full Menu Graphics</h2>
      </section>

      <section className="graphic-menu-stack" aria-label="Capital City Provisions full-page menu graphics">
        {menuGraphics.map((graphic) => (
          <figure className="graphic-menu-sheet" key={graphic.src}>
            <img src={graphic.src} alt={graphic.alt} />
          </figure>
        ))}
      </section>

      <style>{`
        .graphic-menu-page{min-height:100vh;background:#070504;color:#fff3de;font-family:Inter,system-ui,sans-serif;padding:clamp(.8rem,2vw,1.4rem) 0 3rem}
        .qr-hero,.graphic-menu-header,.graphic-menu-stack,.menu-sales-strip,.menu-highlight-grid{width:min(1120px,94vw);margin:0 auto}
        .qr-hero{display:grid;grid-template-columns:1fr minmax(190px,280px);gap:clamp(1rem,3vw,1.8rem);align-items:center;min-height:0;padding:clamp(1rem,3vw,1.65rem);background:radial-gradient(circle at 78% 22%,rgba(215,161,79,.22),transparent 18rem),linear-gradient(135deg,#1d100b,#080504 62%,#2a0907);border:1px solid rgba(215,161,79,.55);border-radius:24px;box-shadow:0 18px 56px rgba(0,0,0,.42);overflow:hidden;position:relative}
        .qr-hero:before{content:'';position:absolute;inset:auto -10% -45% auto;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(177,19,13,.32),transparent 67%)}
        .qr-hero-copy,.qr-hero-code{position:relative;z-index:1}.qr-hero-copy p,.graphic-menu-header p,.menu-sales-strip p{margin:0 0 .45rem;color:#d7a14f;text-transform:uppercase;letter-spacing:.18em;font-weight:950;font-size:.72rem}.qr-hero-copy h1{margin:0;font-family:Georgia,serif;text-transform:uppercase;font-size:clamp(1.9rem,4.6vw,3.6rem);line-height:.94;text-shadow:0 4px 0 #2d0907}.qr-hero-copy span{display:block;margin:.7rem 0 1rem;color:#d8c7af;word-break:break-word;font-weight:750;font-size:.9rem}.qr-hero-copy div{display:flex;gap:.65rem;flex-wrap:wrap}.qr-hero-copy a,.menu-sales-strip a{color:white;text-decoration:none;background:linear-gradient(135deg,#b1130d,#74110c);border:1px solid #d7a14f;border-radius:999px;padding:.72rem .95rem;font-weight:950;box-shadow:0 10px 24px rgba(0,0,0,.3);font-size:.92rem}
        .qr-hero-code{margin:0;text-align:center}.qr-hero-code img{display:block;width:100%;max-width:280px;margin:0 auto;background:white;padding:.65rem;border-radius:20px;border:2px solid #d7a14f;box-shadow:0 14px 38px rgba(0,0,0,.38)}.qr-hero-code figcaption{margin-top:.65rem;color:#ffe2a7;font-weight:950;text-transform:uppercase;letter-spacing:.08em;font-size:.78rem}
        .menu-sales-strip{display:grid;grid-template-columns:1fr auto;gap:1rem;align-items:center;margin-top:1rem;padding:1.1rem 1.2rem;border:1px solid rgba(215,161,79,.45);border-radius:22px;background:linear-gradient(135deg,#160d09,#080504);box-shadow:0 18px 46px rgba(0,0,0,.32)}
        .menu-sales-strip h2{margin:.15rem 0 .45rem;font-family:Georgia,serif;text-transform:uppercase;font-size:clamp(1.6rem,3.6vw,3rem);line-height:.96}.menu-sales-strip span{display:block;color:#d8c7af;line-height:1.5;font-weight:750}.menu-sales-strip nav{display:flex;gap:.6rem;flex-wrap:wrap;justify-content:flex-end}.menu-sales-strip a:nth-child(2),.menu-sales-strip a:nth-child(3){background:#090604;color:#ffe2a7}
        .menu-highlight-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:.65rem;margin-top:.8rem}.menu-highlight-grid article{border:1px solid rgba(215,161,79,.38);border-radius:16px;background:rgba(0,0,0,.42);padding:.9rem;text-align:center;color:#ffe2a7;font-weight:950;text-transform:uppercase;letter-spacing:.08em;font-size:.78rem}
        .graphic-menu-header{display:flex;align-items:end;justify-content:space-between;gap:1rem;flex-wrap:wrap;padding:1.5rem 0 1rem}.graphic-menu-header h2{margin:.2rem 0 0;font-family:Georgia,serif;text-transform:uppercase;font-size:clamp(1.55rem,3.2vw,2.7rem);line-height:1}
        .graphic-menu-stack{display:grid;gap:1.5rem}.graphic-menu-sheet{margin:0;background:#120d0a;border:1px solid rgba(215,161,79,.45);border-radius:24px;overflow:hidden;box-shadow:0 18px 60px rgba(0,0,0,.42)}.graphic-menu-sheet img{display:block;width:100%;height:auto}
        @media(max-width:820px){.qr-hero{grid-template-columns:1fr;text-align:center;border-radius:18px}.qr-hero-copy div{justify-content:center}.qr-hero-copy a{width:100%;text-align:center}.qr-hero-code{order:-1}.qr-hero-code img{max-width:220px}.menu-sales-strip{grid-template-columns:1fr;text-align:center}.menu-sales-strip nav{display:grid;grid-template-columns:1fr;justify-content:stretch}.menu-sales-strip a{text-align:center}.menu-highlight-grid{grid-template-columns:1fr 1fr}.graphic-menu-header{display:block}.graphic-menu-sheet{border-radius:14px}}
      `}</style>
    </main>
  );
}