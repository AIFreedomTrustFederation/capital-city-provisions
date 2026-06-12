type PublicMobileStickyCTAProps={
  zipHref?:string;
  quoteHref?:string;
};

export default function PublicMobileStickyCTA({zipHref='#delivery-zone-check',quoteHref='#customer-account-journey'}:PublicMobileStickyCTAProps){
  return (
    <nav className="public-mobile-cta" aria-label="Quick actions">
      <a href={zipHref}>ZIP</a>
      <a href={quoteHref}>Quote</a>
      <a href="/pay">Pay</a>
      <a href="/reviews">Reviews</a>
      <a href="/giveaway">Free</a>
      <style>{`
        .public-mobile-cta{display:none}
        @media(max-width:760px){
          .public-mobile-cta{position:fixed;left:10px;right:10px;bottom:10px;z-index:80;display:grid;grid-template-columns:repeat(5,1fr);gap:6px;background:rgba(2,2,2,.88);backdrop-filter:blur(12px);border:1px solid rgba(248,231,176,.34);border-radius:18px;padding:7px;box-shadow:0 16px 44px rgba(0,0,0,.55)}
          .public-mobile-cta a{display:grid;place-items:center;min-height:42px;border-radius:13px;background:#0b0704;color:#fff7ed;text-decoration:none;font-weight:900;font-size:.78rem;text-transform:uppercase;border:1px solid rgba(248,231,176,.18)}
          .public-mobile-cta a:nth-child(3){background:linear-gradient(135deg,#b40d0d,#df1717)}
          body{padding-bottom:74px}
        }
      `}</style>
    </nav>
  );
}