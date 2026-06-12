const steps=[
  {title:'Check ZIP',text:'Confirm delivery fit before choosing a package.',href:'#delivery-zone-check'},
  {title:'Choose Box',text:'Pick the freezer package that fits your household.',href:'#build-your-box'},
  {title:'Request Quote',text:'Send ZIP, freezer space, favorite cuts, and timing.',href:'#customer-account-journey'},
  {title:'Get Follow-Up',text:'The team confirms details before anything is final.',href:'/customer'},
];

export default function MVPFlowStrip(){
  return (
    <section className="section mvp-flow-strip mvp-anchor-section" id="mvp-start">
      <div className="mvp-panel">
        <p className="mvp-eyebrow">Simple MVP Path</p>
        <h2 className="mvp-title">Start here.</h2>
        <p className="mvp-subtitle">Four clean steps: check your ZIP, choose a freezer box, request a quote, and get a delivery follow-up.</p>
        <div className="mvp-grid-4">
          {steps.map((step,index)=>(
            <a className="mvp-step-card" href={step.href} key={step.title}>
              <span className="mvp-number">{index+1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </a>
          ))}
        </div>
      </div>
      <style>{`
        .mvp-flow-strip{margin-top:clamp(1rem,3vw,2rem)}
        .mvp-grid-4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.85rem;margin-top:1rem}
        .mvp-step-card{display:grid;gap:.55rem;align-content:start;min-height:190px;border:1px solid rgba(248,231,176,.18);border-radius:22px;background:linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.02)),#050403;color:#fff7ed;text-decoration:none;padding:1rem;transition:transform .18s ease,border-color .18s ease,filter .18s ease}
        .mvp-step-card:hover{transform:translateY(-2px);border-color:rgba(248,231,176,.55);filter:brightness(1.08)}
        .mvp-step-card h3{color:#f8e7b0;margin:0;font-size:1.2rem}
        .mvp-step-card p{color:#ded2bd;margin:0}
        @media(max-width:980px){.mvp-grid-4{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:620px){.mvp-grid-4{grid-template-columns:1fr}.mvp-step-card{min-height:auto}}
      `}</style>
    </section>
  );
}
