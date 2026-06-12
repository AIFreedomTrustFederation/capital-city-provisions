type PublicMobileStickyCTAProps={
  zipHref?:string;
  quoteHref?:string;
};

export default function PublicMobileStickyCTA({zipHref='#delivery-zone-check',quoteHref='#customer-account-journey'}:PublicMobileStickyCTAProps){
  const href=quoteHref || zipHref;
  return (
    <nav className="public-mobile-cta" aria-label="Capital City Provisions concierge">
      <a href={href} aria-label="Open Capital City Provisions guide">
        <span className="robot-head" aria-hidden="true"><span></span></span>
        <span className="robot-label">Guide</span>
      </a>
      <style>{`
        .public-mobile-cta{display:none}
        @media(max-width:760px){
          .public-mobile-cta{position:fixed;right:14px;bottom:14px;z-index:90;display:block;background:transparent;border:0;padding:0}
          .public-mobile-cta a{position:relative;display:grid;place-items:center;width:68px;height:68px;border-radius:24px;background:#e2c98f;color:#080604;text-decoration:none;border:1px solid #fff4df;box-shadow:0 18px 46px rgba(0,0,0,.6),0 0 0 6px rgba(8,6,4,.5)}
          .robot-head{position:relative;display:block;width:34px;height:28px;border-radius:12px;background:#080604;box-shadow:0 -8px 0 -5px #080604}
          .robot-head:before,.robot-head:after{content:"";position:absolute;top:9px;width:6px;height:6px;border-radius:50%;background:#e2c98f}.robot-head:before{left:8px}.robot-head:after{right:8px}
          .robot-head span{position:absolute;left:11px;right:11px;bottom:6px;height:3px;border-radius:99px;background:#e2c98f}
          .robot-label{position:absolute;left:50%;bottom:-7px;transform:translateX(-50%);border:1px solid rgba(226,201,143,.46);border-radius:999px;background:#080604;color:#fff4df;padding:2px 8px;font-size:.58rem;font-weight:900;letter-spacing:.05em;text-transform:uppercase;box-shadow:0 8px 18px rgba(0,0,0,.42)}
          body{padding-bottom:86px}
        }
      `}</style>
    </nav>
  );
}
