'use client';

const links=[
  ['Home','/'],
  ['Menu','/menu'],
  ['Delivery','/how-delivery-works'],
  ['About','/about'],
  ['Contact','/contact'],
  ['Account','/customer']
];

function Brand(){
  return <a className="brand ccp-wordmark" href="/" aria-label="Capital City Provisions home">
    <span className="brand-heart" aria-hidden="true"><span>🥩</span></span>
    <span className="brand-copy"><strong>Capital City</strong><em>Provisions</em><small>CCP DBA</small></span>
  </a>;
}

export default function Navbar(){
  return <nav className="nav ccp-brand-nav" aria-label="Main navigation">
    <Brand />
    <div className="desktop-nav-links" aria-label="Primary links">{links.map(([label,href])=><a key={href} href={href}>{label}</a>)}</div>
    <a className="order-now-link" href="/menu" aria-label="Order now">🚚 Order Now</a>
    <a className="cart-link" href="/customer" aria-label="Cart">🛒 <span>0</span></a>
    <details className="nav-menu">
      <summary className="menu-button">Menu</summary>
      <div id="main-navigation" className="nav-links">{links.map(([label,href])=><a key={href} href={href}>{label}</a>)}<a href="/menu">Order Now</a></div>
    </details>
    <style>{`
      .ccp-brand-nav{position:sticky;top:0;z-index:50;display:grid;grid-template-columns:auto 1fr auto auto;align-items:center;gap:1.4rem;padding:1.05rem clamp(1rem,4vw,3rem)!important;background:rgba(0,0,0,.94)!important;border-bottom:1px solid rgba(212,175,55,.28)!important;box-shadow:0 16px 38px rgba(0,0,0,.55)!important;backdrop-filter:blur(12px)}
      .ccp-wordmark{display:inline-flex;align-items:center;gap:.78rem;text-decoration:none;min-width:230px}
      .brand-heart{position:relative;display:grid;place-items:center;width:58px;height:48px;color:#fff;border-top:1px solid #d4af37;border-bottom:1px solid #d4af37}
      .brand-heart:before,.brand-heart:after{content:"";position:absolute;left:-26px;right:-26px;top:50%;height:1px;background:linear-gradient(90deg,transparent,#d4af37,transparent)}
      .brand-heart span{position:relative;z-index:1;font-size:2.1rem;filter:drop-shadow(0 0 10px rgba(195,20,20,.7))}
      .brand-copy{display:grid;line-height:1;text-align:left;text-transform:uppercase}
      .brand-copy strong{font-family:Georgia,'Times New Roman',serif;font-size:1.55rem;color:#f3d37a;letter-spacing:.04em;font-weight:700;text-shadow:0 0 16px rgba(212,175,55,.35)}
      .brand-copy em{font-family:Georgia,'Times New Roman',serif;font-style:normal;color:#fff4dd;font-size:.75rem;font-weight:900;letter-spacing:.5em;margin-top:.18rem}
      .brand-copy small{color:#fff4dd;font-family:Georgia,'Times New Roman',serif;font-size:.78rem;letter-spacing:.22em;margin-top:.35rem;text-align:center}
      .desktop-nav-links{display:flex;align-items:center;justify-content:center;gap:2.05rem;flex-wrap:wrap}
      .desktop-nav-links a{color:#fffaf0;text-decoration:none;font-family:Arial,sans-serif;font-size:.78rem;font-weight:900;letter-spacing:.07em;text-transform:uppercase}
      .desktop-nav-links a:first-child{color:#d4af37}
      .desktop-nav-links a:hover{color:#f3d37a}
      .order-now-link{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:.78rem 1.35rem;border:1px solid #d4af37;border-radius:4px;color:#fff7e8!important;background:rgba(0,0,0,.25);font-family:Arial,sans-serif;font-size:.78rem;font-weight:950;letter-spacing:.06em;text-decoration:none;text-transform:uppercase;white-space:nowrap}
      .cart-link{font-family:Arial,sans-serif;font-weight:900;color:#fff!important;text-decoration:none;white-space:nowrap}
      .nav-menu{display:none}.nav-menu summary{list-style:none}.nav-menu summary::-webkit-details-marker{display:none}
      .menu-button{border-color:rgba(212,175,55,.7)!important;color:#fff7e8!important;background:rgba(0,0,0,.4)!important;box-shadow:0 8px 22px rgba(0,0,0,.35)!important}
      @media(max-width:920px){.ccp-brand-nav{grid-template-columns:auto 1fr auto}.desktop-nav-links,.order-now-link,.cart-link{display:none}.nav-menu{display:block;justify-self:end}.ccp-wordmark{min-width:0}.brand-heart{width:46px}.brand-copy strong{font-size:1.1rem}.brand-copy em{font-size:.58rem}.brand-copy small{font-size:.62rem}.nav-links{position:absolute;left:10px;right:10px;top:calc(100% + 8px);display:none!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;padding:10px!important;border:1px solid rgba(212,175,55,.42);border-radius:18px;background:#050301;box-shadow:0 16px 44px rgba(0,0,0,.55)}.nav-menu[open] .nav-links{display:grid!important}.nav-links a{display:grid!important;place-items:center;min-height:44px!important;border:1px solid rgba(212,175,55,.35)!important;border-radius:999px!important;background:#100805!important;color:#fff7e8!important;text-align:center;font-size:.8rem!important;font-weight:900!important;line-height:1.05!important;text-decoration:none!important;text-transform:uppercase}.nav-links a:last-child{grid-column:span 2;background:linear-gradient(135deg,#f5d976,#b8892d)!important;color:#120a05!important}}
    `}</style>
  </nav>;
}
