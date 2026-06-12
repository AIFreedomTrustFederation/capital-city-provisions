import CustomerServiceRating from './CustomerServiceRating';

const trustCards=[
  {
    title:'Verified service feedback',
    text:'Customer ratings help the team catch recovery needs, reorder opportunities, and monthly restock interest.',
  },
  {
    title:'Recovery promise',
    text:'If a delivery or order experience is not right, a low rating creates a recovery case for owner review.',
  },
  {
    title:'Owner-approved testimonials',
    text:'Only permission-based customer praise should become public testimonial material.',
  },
  {
    title:'External reviews',
    text:'Trustpilot and Google review links can be added after the external profiles are ready.',
  },
];

const sampleTestimonials=[
  {quote:'The box was easy to understand, freezer-ready, and the team made the delivery process simple.',name:'Local freezer customer'},
  {quote:'I liked being able to ask questions before choosing the package. No pressure, just clear help.',name:'First-time quote request'},
  {quote:'The restock idea makes sense for my household. I want predictable freezer food without warehouse trips.',name:'Monthly restock prospect'},
];

export default function PublicTrustReviews(){
  return (
    <section className="section mvp-shell public-trust-reviews" id="customer-rating">
      <div className="mvp-panel">
        <p className="mvp-eyebrow">Trust + Reviews</p>
        <h1 className="mvp-title">Proof should be honest.</h1>
        <p className="mvp-subtitle">Reviews are not just decoration. They help the team improve service, recover issues, approve testimonials, and find customers ready for reorder or restock.</p>

        <div className="mvp-grid-4 trust-card-grid">
          {trustCards.map(card=>(
            <article className="mvp-card" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>

        <div className="testimonial-grid">
          {sampleTestimonials.map(item=>(
            <article key={item.quote}>
              <p>“{item.quote}”</p>
              <strong>{item.name}</strong>
            </article>
          ))}
        </div>

        <div className="external-review-panel">
          <div>
            <p className="mvp-eyebrow">External Review Profiles</p>
            <h2>Connect when ready.</h2>
            <p>Use this area for Trustpilot, Google reviews, or other public proof after the profiles are live and approved.</p>
          </div>
          <div className="mvp-actions">
            <a className="mvp-button-secondary" href="/contact">Request Review Link</a>
            <a className="mvp-button" href="#customer-rating-form">Leave Service Rating</a>
          </div>
        </div>
      </div>

      <div id="customer-rating-form" className="mvp-panel rating-panel-wrap">
        <CustomerServiceRating/>
      </div>

      <style>{`
        .trust-card-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:14px}
        .testimonial-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:14px}
        .testimonial-grid article{border:1px solid rgba(248,231,176,.16);border-radius:22px;background:#050403;padding:14px}
        .testimonial-grid p{color:#fff7ed;font-size:1.05rem}
        .testimonial-grid strong{color:#d4af37}
        .external-review-panel{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;border:1px solid rgba(248,231,176,.16);border-radius:22px;background:#050403;padding:14px;margin-top:14px}
        .external-review-panel h2{color:#f8e7b0;margin:.2rem 0}
        .external-review-panel p{color:#ded2bd}
        .rating-panel-wrap{margin-top:14px}
        @media(max-width:1100px){.trust-card-grid,.testimonial-grid,.external-review-panel{grid-template-columns:1fr}}
      `}</style>
    </section>
  );
}
