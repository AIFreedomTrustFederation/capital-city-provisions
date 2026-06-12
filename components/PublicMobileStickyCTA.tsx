type PublicMobileStickyCTAProps={
  zipHref?:string;
  quoteHref?:string;
};

export default function PublicMobileStickyCTA({zipHref='#delivery-zone-check',quoteHref='#customer-account-journey'}:PublicMobileStickyCTAProps){
  return (
    <nav className="public-mobile-cta" aria-label="Quick actions">
      <a href={zipHref}>Check ZIP</a>
      <a href="/freezer-boxes">Boxes</a>
      <a href={quoteHref}>Guide</a>
      <style>{`
        .public-mobile-cta{display:none}
        @media(max-width:760px){
          .public-mobile-cta{position:fixed;left:12px;right:12px;bottom:12px;z-index:80;display:grid;grid-template-columns:1.4fr .8fr .8fr;gap:8px;background:#080604;border:1px solid rgba(226,201,143,.34);border-radius:28px;padding:8px;box-shadow:0 18px 50px rgba(0,0,0,.62)}
          .public-mobile-cta a{display:grid;place-items:center;min-height:46px;border-radius:22px;background:#15110d;color:#fff4df;text-decoration:none;font-weight:900;font-size:.78rem;text-transform:uppercase;border:1px solid rgba(226,201,143,.2)}
          .public-mobile-cta a:first-child{background:#e2c98f;color:#080604;border-color:#fff4df}
          body{padding-bottom:82px}
        }
      `}</style>
    </nav>
  );
}
