'use client';

const links=[
  ['Menu','/menu'],
  ['Boxes','/freezer-boxes'],
  ['How It Works','/how-delivery-works'],
  ['Delivery','/delivery-map'],
  ['Offer','/giveaway'],
  ['Contact','/contact']
];

function Brand(){
  return <a className="brand ccp-wordmark" href="/">
    <span className="brand-seal">CCP</span>
    <span className="brand-copy"><strong>Capital City</strong><em>Provisions</em></span>
  </a>;
}

export default function Navbar(){
  return <nav className="nav ccp-brand-nav" aria-label="Main navigation">
    <Brand />
    <div className="desktop-nav-links" aria-label="Primary links">{links.map(([label,href])=><a key={href} href={href}>{label}</a>)}</div>
    <details className="nav-menu">
      <summary className="menu-button">Menu</summary>
      <div id="main-navigation" className="nav-links">{links.map(([label,href])=><a key={href} href={href}>{label}</a>)}</div>
    </details>
    <style>{`
      .ccp-wordmark{display:inline-flex;align-items:center;gap:.7rem;text-decoration:none}
      .brand-seal{display:grid;place-items:center;width:44px;height:44px;border-radius:16px;background:linear-gradient(135deg,#fff8ed,#e8c878);color:#2b1a12;border:1px solid #fff8ed;box-shadow:0 8px 22px rgba(69,39,20,.12);font-size:.74rem;font-weight:950;letter-spacing:.08em}
      .brand-copy{display:grid;line-height:1}
      .brand-copy strong{font-family:Georgia,'Times New Roman',serif;font-size:1.08rem;color:#2b1a12}
      .brand-copy em{font-style:normal;color:#8a3a22;font-size:.72rem;font-weight:900;letter-spacing:.22em;text-transform:uppercase}
      .desktop-nav-links{display:flex;align-items:center;justify-content:flex-end;gap:18px;flex-wrap:wrap}
      .desktop-nav-links a{color:#2b1a12;text-decoration:none;font-weight:900;letter-spacing:.03em}
      .desktop-nav-links a:hover{color:#8a3a22}
      .nav-menu{display:none}
      .nav-menu summary{list-style:none}
      .nav-menu summary::-webkit-details-marker{display:none}
      .menu-button{border-color:rgba(138,58,34,.38)!important;color:#8a3a22!important;background:#fff8ed!important;box-shadow:0 8px 22px rgba(69,39,20,.1)!important}
      @media(max-width:760px){
        .nav{align-items:center}
        .brand-seal{width:40px;height:40px;border-radius:14px}
        .brand-copy strong{font-size:.98rem}
        .brand-copy em{font-size:.62rem}
        .desktop-nav-links{display:none}
        .nav-menu{display:block}
        .nav-links{position:absolute;left:10px;right:10px;top:calc(100% + 8px);display:none!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;padding:10px!important;border:1px solid rgba(184,137,45,.3);border-radius:18px;background:#fff8ed;box-shadow:0 16px 44px rgba(69,39,20,.18)}
        .nav-menu[open] .nav-links{display:grid!important;max-height:min(330px,42vh)!important;overflow-y:auto!important;opacity:1!important}
        .nav-links a{display:grid!important;place-items:center;min-height:44px!important;border:1px solid rgba(184,137,45,.32)!important;border-radius:999px!important;background:#fffaf3!important;color:#2b1a12!important;text-align:center;font-size:.8rem!important;font-weight:900!important;line-height:1.05!important;text-decoration:none!important}
        .nav-links a:nth-child(3),.nav-links a:nth-child(6){grid-column:span 2}
        .menu-button{display:inline-flex;cursor:pointer}
      }
    `}</style>
  </nav>;
}
