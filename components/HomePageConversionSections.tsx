'use client';

const boxes=[
  {name:'Starter Family Box',best:'New customers and smaller households',size:'5 cu ft friendly',mix:'Ground beef, chicken, pork basics',note:'A clean first stock-up with useful proteins instead of random filler.'},
  {name:'Premium Steak Box',best:'Steak lovers and weekend grilling',size:'7-10 cu ft friendly',mix:'Steaks, roasts, burger, specialty cuts',note:'Beef-forward value for grill nights, hosting, and freezer confidence.'},
  {name:'Monthly Restock Box',best:'Families who cook at home weekly',size:'Flexible refill',mix:'Balanced beef, chicken, pork, seafood',note:'Built for repeat delivery and practical household planning.'},
  {name:'Freezer Fill-Up Box',best:'Large families and food security',size:'10-22 cu ft friendly',mix:'Bulk premium proteins and freezer planning',note:'Best after ZIP, freezer space, and delivery timing are confirmed.'},
  {name:'Wholesale Trial Box',best:'Events, churches, food service, and bulk buyers',size:'Bulk case planning',mix:'Chef-friendly larger quantity proteins',note:'A team member confirms volume, timing, and route fit.'},
];

const why=[
  {title:'No warehouse run',text:'Skip the long trip and start with a delivery-area check.'},
  {title:'Freezer-ready packaging',text:'Cryovac packed for cleaner storage and easier meal planning.'},
  {title:'Simple follow-up',text:'Your ZIP, box fit, and delivery details are confirmed before anything is final.'},
  {title:'Family-sized value',text:'Choose around how your home actually cooks, grills, and restocks.'},
];

const questions=[
  'What box fits my family?',
  'Do you deliver to my ZIP?',
  'How much freezer space do I need?',
  'Can I enter the giveaway free?',
  'Can I get monthly restocks?',
  'Do you sell wholesale?',
];

export default function HomePageConversionSections(){
  return (
    <section className="home-conversion" id="build-your-box">
      <div className="conversion-heading">
        <p className="ccp-section-kicker">Build Your Freezer Box</p>
        <h2>Choose the freezer package that fits your home.</h2>
        <p>Start with your ZIP, choose the style of box that matches your household, and let the team confirm the right fit before anything is final.</p>
      </div>

      <div className="conversion-box-grid">
        {boxes.map(box=>(
          <article className="ccp-premium-card" key={box.name}>
            <small>{box.best}</small>
            <h3>{box.name}</h3>
            <strong>{box.size}</strong>
            <p><b>Suggested mix:</b> {box.mix}</p>
            <p>{box.note}</p>
            <a href="#customer-account-journey">Request Quote</a>
          </article>
        ))}
      </div>

      <div className="conversion-flow">
        {['Check ZIP','Choose Box','Confirm Details','Schedule Delivery','Stock Freezer'].map((step,index)=>(
          <article key={step}>
            <span>{index+1}</span>
            <h3>{step}</h3>
          </article>
        ))}
      </div>

      <div className="conversion-split">
        <article>
          <p className="ccp-section-kicker">Why customers choose us</p>
          <h2>Premium protein without the pressure.</h2>
          <div>
            {why.map(item=>(
              <span key={item.title}><b>{item.title}</b>{item.text}</span>
            ))}
          </div>
        </article>

        <article>
          <p className="ccp-section-kicker">Delivery Promise</p>
          <h2>We confirm before we promise.</h2>
          <p>ZIP, timing, package fit, route availability, and delivery details are checked before the order is treated as final.</p>
          <div className="conversion-actions">
            <a className="ccp-button-primary" href="#delivery-zone-check">Check My ZIP</a>
            <a className="ccp-button-secondary" href="#customer-account-journey">Build My Box</a>
          </div>
        </article>
      </div>

      <div className="conversion-promo-row">
        <article>
          <p className="ccp-section-kicker">Freezer Giveaway</p>
          <h2>Free entry stays free.</h2>
          <p>No purchase necessary. Buying does not improve odds.</p>
          <a className="ccp-button-secondary" href="/giveaway">Enter Giveaway</a>
        </article>

        <article>
          <p className="ccp-section-kicker">Monthly Restock Club</p>
          <h2>Keep your freezer ready.</h2>
          <p>Choose your box size, delivery area, and household needs for simple repeat restocks.</p>
          <a className="ccp-button-secondary" href="#customer-account-journey">Join Restock List</a>
        </article>
      </div>

      <div className="customer-question-chips">
        <p className="ccp-section-kicker">Customer Questions</p>
        {questions.map(question=><a href="/customer-concierge" key={question}>{question}</a>)}
      </div>

      <style>{`
        .home-conversion{background:radial-gradient(circle at top right,rgba(212,175,55,.16),transparent 32%),linear-gradient(135deg,#080503,#020202);border-top:1px solid rgba(216,174,100,.28);border-bottom:1px solid rgba(216,174,100,.28);padding:clamp(3rem,7vw,6rem) clamp(1rem,5vw,5rem)}
        .conversion-heading{text-align:center;max-width:980px;margin:0 auto 2rem}
        .conversion-heading h2,.conversion-split h2,.conversion-promo-row h2{font-family:var(--ccp-display);font-size:clamp(2.6rem,6vw,5.2rem);line-height:.92;text-transform:uppercase;margin:.25rem 0 .8rem;color:var(--ccp-cream)}
        .conversion-heading p,.conversion-split p,.conversion-promo-row p{color:var(--ccp-muted);font-size:1.08rem;line-height:1.6}
        .conversion-box-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:1rem}
        .conversion-box-grid article{padding:1.2rem;display:flex;flex-direction:column;min-height:340px}
        .conversion-box-grid small{color:var(--ccp-gold);font-weight:900;letter-spacing:.08em;text-transform:uppercase}
        .conversion-box-grid h3{font-family:var(--ccp-display);font-size:2rem;line-height:.95;color:var(--ccp-cream)}
        .conversion-box-grid strong{color:var(--ccp-soft-gold);margin-bottom:.65rem}
        .conversion-box-grid p{color:var(--ccp-muted);line-height:1.5}
        .conversion-box-grid b{color:var(--ccp-cream)}
        .conversion-box-grid a{margin-top:auto;background:var(--ccp-red);color:#fff;text-align:center;text-decoration:none;font-weight:900;padding:.85rem 1rem;text-transform:uppercase}
        .conversion-flow{display:grid;grid-template-columns:repeat(5,1fr);gap:1px;background:rgba(216,174,100,.28);padding:1px;margin:2rem 0}
        .conversion-flow article{background:#090604;padding:1.2rem;text-align:center}
        .conversion-flow span{display:inline-grid;place-items:center;width:38px;height:38px;border-radius:999px;background:linear-gradient(135deg,var(--ccp-gold),var(--ccp-brass));color:#160b04;font-weight:900}
        .conversion-flow h3{font-family:var(--ccp-display);color:var(--ccp-cream);font-size:1.55rem}
        .conversion-split,.conversion-promo-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1rem}
        .conversion-split article,.conversion-promo-row article,.customer-question-chips{border:1px solid rgba(248,231,176,.22);border-radius:24px;background:rgba(0,0,0,.62);padding:1.4rem}
        .conversion-split div{display:grid;gap:.8rem;margin-top:1rem}
        .conversion-split span{display:grid;gap:.2rem;color:var(--ccp-muted);border-bottom:1px solid rgba(216,174,100,.18);padding-bottom:.65rem}
        .conversion-split b{color:var(--ccp-soft-gold)}
        .conversion-actions{display:flex;flex-wrap:wrap;gap:.8rem;margin-top:1rem}
        .conversion-promo-row a{margin-top:.8rem}
        .customer-question-chips{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:1rem}
        .customer-question-chips .ccp-section-kicker{width:100%;margin:0}
        .customer-question-chips a{border:1px solid rgba(212,175,55,.32);border-radius:999px;background:#0b0704;color:#fff7ed;text-decoration:none;padding:.75rem 1rem;font-weight:800}
        @media(max-width:1180px){.conversion-box-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.conversion-flow{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:760px){.conversion-box-grid,.conversion-split,.conversion-promo-row,.conversion-flow{grid-template-columns:1fr}.home-conversion{padding:3rem 1rem}.conversion-heading h2,.conversion-split h2,.conversion-promo-row h2{font-size:2.7rem}}
      `}</style>
    </section>
  );
}