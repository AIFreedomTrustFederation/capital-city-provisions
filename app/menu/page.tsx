const menuUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://capital-city-provisions.vercel.app'}/menu`;
const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=720x720&margin=24&data=${encodeURIComponent(menuUrl)}`;

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
          <h1>Scan QR for the Premium Steak Box Menu</h1>
          <span>{menuUrl}</span>
          <div>
            <a href="tel:+19165345716">Call +1 916 534 5716</a>
            <a href={qrSrc} target="_blank" rel="noreferrer">Open Printable QR</a>
          </div>
        </div>
        <figure className="qr-hero-code">
          <img src={qrSrc} alt="Large QR code to open the Capital City Provisions premium steak box menu" />
          <figcaption>Point your camera here to open the menu.</figcaption>
        </figure>
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
        .graphic-menu-page{min-height:100vh;background:#070504;color:#fff3de;font-family:Inter,system-ui,sans-serif;padding:clamp(1rem,3vw,2rem) 0 3rem}
        .qr-hero,.graphic-menu-header,.graphic-menu-stack{width:min(1120px,94vw);margin:0 auto}
        .qr-hero{display:grid;grid-template-columns:1fr minmax(280px,430px);gap:clamp(1.2rem,4vw,2.5rem);align-items:center;min-height:clamp(560px,78vh,760px);padding:clamp(1.4rem,4vw,3rem);background:radial-gradient(circle at 78% 22%,rgba(215,161,79,.28),transparent 25rem),linear-gradient(135deg,#1d100b,#080504 62%,#2a0907);border:1px solid rgba(215,161,79,.55);border-radius:34px;box-shadow:0 24px 80px rgba(0,0,0,.5);overflow:hidden;position:relative}
        .qr-hero:before{content:'';position:absolute;inset:auto -10% -30% auto;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(177,19,13,.38),transparent 67%)}
        .qr-hero-copy,.qr-hero-code{position:relative;z-index:1}.qr-hero-copy p,.graphic-menu-header p{margin:0 0 .65rem;color:#d7a14f;text-transform:uppercase;letter-spacing:.18em;font-weight:950;font-size:.78rem}.qr-hero-copy h1{margin:0;font-family:Georgia,serif;text-transform:uppercase;font-size:clamp(2.5rem,7vw,5.9rem);line-height:.9;text-shadow:0 5px 0 #2d0907}.qr-hero-copy span{display:block;margin:1rem 0 1.35rem;color:#d8c7af;word-break:break-word;font-weight:750}.qr-hero-copy div{display:flex;gap:.75rem;flex-wrap:wrap}.qr-hero-copy a{color:white;text-decoration:none;background:linear-gradient(135deg,#b1130d,#74110c);border:1px solid #d7a14f;border-radius:999px;padding:.9rem 1.1rem;font-weight:950;box-shadow:0 12px 30px rgba(0,0,0,.32)}
        .qr-hero-code{margin:0;text-align:center}.qr-hero-code img{display:block;width:100%;max-width:430px;margin:0 auto;background:white;padding:clamp(.7rem,2vw,1.15rem);border-radius:28px;border:2px solid #d7a14f;box-shadow:0 18px 54px rgba(0,0,0,.45)}.qr-hero-code figcaption{margin-top:.85rem;color:#ffe2a7;font-weight:950;text-transform:uppercase;letter-spacing:.08em}
        .graphic-menu-header{display:flex;align-items:end;justify-content:space-between;gap:1rem;flex-wrap:wrap;padding:2rem 0 1.25rem}.graphic-menu-header h2{margin:.2rem 0 0;font-family:Georgia,serif;text-transform:uppercase;font-size:clamp(1.7rem,4vw,3.2rem);line-height:1}
        .graphic-menu-stack{display:grid;gap:1.5rem}.graphic-menu-sheet{margin:0;background:#120d0a;border:1px solid rgba(215,161,79,.45);border-radius:24px;overflow:hidden;box-shadow:0 18px 60px rgba(0,0,0,.42)}.graphic-menu-sheet img{display:block;width:100%;height:auto}
        @media(max-width:820px){.qr-hero{grid-template-columns:1fr;min-height:auto;text-align:center;border-radius:22px}.qr-hero-copy div{justify-content:center}.qr-hero-copy a{width:100%;text-align:center}.qr-hero-code{order:-1}.qr-hero-code img{max-width:320px}.graphic-menu-header{display:block}.graphic-menu-sheet{border-radius:14px}}
      `}</style>
    </main>
  );
}
