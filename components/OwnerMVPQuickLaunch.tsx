const links=[
  {label:'Needs Review',href:'#needs-review'},
  {label:'Customer Ops',href:'#owner-customer-ops'},
  {label:'Sales Flow',href:'#sales-to-delivery-flow'},
  {label:'Internal Board',href:'#internal-board-queues'},
  {label:'Closeout',href:'#daily-closeout'},
  {label:'Dev Status',href:'/team/dev'},
];

export default function OwnerMVPQuickLaunch(){
  return (
    <section className="section owner-mvp-quick mvp-panel">
      <p className="mvp-eyebrow">Owner MVP Controls</p>
      <h2 className="mvp-title">Run today fast.</h2>
      <p className="mvp-subtitle">Jump to the most important sections without scrolling the full command center.</p>
      <div className="mvp-actions">
        {links.map((link,index)=>(
          <a key={link.href} className={index===0?'mvp-button':index===5?'mvp-button-gold':'mvp-button-secondary'} href={link.href}>{link.label}</a>
        ))}
      </div>
    </section>
  );
}
