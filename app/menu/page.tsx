const menuUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://capital-city-provisions.vercel.app'}/menu`;
const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=420x420&margin=20&data=${encodeURIComponent(menuUrl)}`;

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
  description: 'Full graphic premium steak box menu for Capital City Provisions with QR code, free delivery, premium steak box pricing, and call-to-order details.',
};

export default function MenuPage() {
  return (
    <main className="graphic-menu-page">
      <section className="graphic-menu-header">
        <p>Capital City Provisions</p>
        <h1>Premium Steak Box Menu</h1>
        <div>
          <a href="tel:+19165345716">Call +1 916 534 5716</a>
          <a href="#qr-menu">Customer QR</a>
        </div>
      </section>

      <section className="graphic-menu-stack" aria-label="Capital City Provisions full-page menu graphics">
        {menuGraphics.map((graphic) => (
          <figure className="graphic-menu-sheet" key={graphic.src}>
            <img src={graphic.src} alt={graphic.alt} />
          </figure>
        ))}
      </section>

      <section className="graphic-menu-qr" id="qr-menu">
        <div>
          <p>Scan QR for this menu</p>
          <h2>Customer Menu QR</h2>
          <span>{menuUrl}</span>
        </div>
        <img src={qrSrc} alt="QR code to open the Capital City Provisions premium steak box menu" />
        <a href={qrSrc} target="_blank" rel="noreferrer">Open printable QR</a>
      </section>

      <style>{`
        .graphic-menu-page{min-height:100vh;background:#070504;color:#fff3de;font-family:Inter,system-ui,sans-serif;padding:clamp(1rem,3vw,2rem) 0 3rem}
        .graphic-menu-header,.graphic-menu-stack,.graphic-menu-qr{width:min(1120px,94vw);margin:0 auto}
        .graphic-menu-header{display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;padding:1rem 0 1.35rem}
        .graphic-menu-header p{margin:0;color:#d7a14f;text-transform:uppercase;letter-spacing:.18em;font-weight:900;font-size:.78rem}
        .graphic-menu-header h1{margin:.2rem 0 0;font-family:Georgia,serif;text-transform:uppercase;font-size:clamp(1.7rem,4vw,3.2rem);line-height:1}
        .graphic-menu-header div{display:flex;gap:.7rem;flex-wrap:wrap}
        .graphic-menu-header a,.graphic-menu-qr a{color:white;text-decoration:none;background:linear-gradient(135deg,#b1130d,#74110c);border:1px solid #d7a14f;border-radius:999px;padding:.82rem 1rem;font-weight:950;box-shadow:0 12px 30px rgba(0,0,0,.32)}
        .graphic-menu-stack{display:grid;gap:1.5rem}
        .graphic-menu-sheet{margin:0;background:#120d0a;border:1px solid rgba(215,161,79,.45);border-radius:24px;overflow:hidden;box-shadow:0 18px 60px rgba(0,0,0,.42)}
        .graphic-menu-sheet img{display:block;width:100%;height:auto}
        .graphic-menu-qr{margin-top:1.5rem;display:grid;grid-template-columns:1fr auto auto;align-items:center;gap:1rem;background:linear-gradient(135deg,#1b100b,#090605);border:1px solid rgba(215,161,79,.5);border-radius:24px;padding:1.2rem;box-shadow:0 18px 60px rgba(0,0,0,.32)}
        .graphic-menu-qr p{margin:0 0 .2rem;color:#d7a14f;text-transform:uppercase;letter-spacing:.16em;font-size:.75rem;font-weight:900}.graphic-menu-qr h2{font-family:Georgia,serif;text-transform:uppercase;margin:.15rem 0;font-size:clamp(1.5rem,3vw,2.4rem)}.graphic-menu-qr span{display:block;color:#d8c7af;word-break:break-word}.graphic-menu-qr img{width:160px;max-width:38vw;background:white;padding:.55rem;border-radius:16px;border:1px solid #d7a14f}
        @media(max-width:820px){.graphic-menu-header{display:block}.graphic-menu-header div{margin-top:1rem}.graphic-menu-header a{width:100%;text-align:center}.graphic-menu-qr{grid-template-columns:1fr;text-align:center}.graphic-menu-qr img{margin:0 auto;width:220px}.graphic-menu-qr a{display:block;text-align:center}.graphic-menu-sheet{border-radius:14px}}
      `}</style>
    </main>
  );
}
