'use client';

type Props={
  snapshot?:Record<string,any>;
};

export default function CustomerDeliveryStatusPanel({snapshot={}}:Props){
  const db=snapshot.database||{};
  const orders=db.orders||[];
  const latest=orders[0];
  const status=latest?.status||'No live order yet';
  const deliveryWindow=latest?.deliveryWindow||'Not scheduled yet';
  const route=latest?.routeId||'Waiting for route assignment';
  const payment=status==='paid'||status==='delivered'?'Paid / confirmed':'Pending confirmation';

  const cards=[
    {label:'Order Status',value:status,detail:'Current order lifecycle from official records.'},
    {label:'Delivery Window',value:deliveryWindow,detail:'Delivery timing appears after owner confirmation.'},
    {label:'Payment Status',value:payment,detail:'Payment and receipt updates are owner-confirmed.'},
    {label:'Route Status',value:route,detail:'Route assignment appears after scheduling.'},
  ];

  return (
    <section className="section customer-delivery-status" id="customer-delivery-status">
      <p className="eyebrow">Customer Delivery Status</p>
      <h2>Your delivery information stays tied to owner-approved records.</h2>
      <div className="customer-status-grid">
        {cards.map(card=>(
          <article key={card.label}>
            <small>{card.label}</small>
            <h3>{card.value}</h3>
            <p>{card.detail}</p>
          </article>
        ))}
      </div>

      <style>{`
        .customer-delivery-status{border:1px solid rgba(248,231,176,.22);border-radius:28px;background:linear-gradient(135deg,#080503,#020202);padding:18px}
        .customer-delivery-status h2{color:#f8e7b0;margin:.25rem 0}
        .customer-status-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:14px}
        .customer-status-grid article{border:1px solid rgba(248,231,176,.16);border-radius:20px;background:#050403;padding:14px}
        .customer-status-grid small{color:#d4af37;font-weight:900}
        .customer-status-grid h3{color:#fff7ed}
        .customer-status-grid p{color:#ded2bd}
        @media(max-width:900px){.customer-status-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:560px){.customer-status-grid{grid-template-columns:1fr}}
      `}</style>
    </section>
  );
}
