const sections=[
  {
    title:'Shop By Need',
    links:[
      ['Freezer Boxes','/freezer-boxes'],
      ['Family Freezer Boxes','/family-freezer-boxes'],
      ['Steak Delivery','/steak-delivery'],
      ['Food Security Plans','/food-security-freezer-boxes']
    ]
  },
  {
    title:'Delivery And Routes',
    links:[
      ['How Delivery Works','/how-delivery-works'],
      ['Delivery Area','/delivery-map'],
      ['Meat Delivery Sacramento','/meat-delivery-sacramento'],
      ['Beef Delivery Sacramento','/beef-delivery-sacramento']
    ]
  },
  {
    title:'Business Accounts',
    links:[
      ['Wholesale Supply','/wholesale'],
      ['Wholesale Sacramento','/wholesale-meat-supplier-sacramento'],
      ['Contact Wholesale','/contact']
    ]
  },
  {
    title:'Trust And Help',
    links:[
      ['About / Founder Story','/about'],
      ['Reviews','/reviews'],
      ['FAQ','/faq'],
      ['Contact','/contact']
    ]
  },
  {
    title:'Promotions',
    links:[
      ['Freezer Giveaway','/giveaway'],
      ['Official Rules','/official-rules'],
      ['Box Concierge','/customer-concierge']
    ]
  },
  {
    title:'Team Access',
    links:[
      ['Driver Gate','/internal-access?role=driver&returnTo=/driver'],
      ['Owner Gate','/internal-access?role=owner&returnTo=/owner'],
      ['Reports Gate','/internal-access?role=owner&returnTo=/reports']
    ]
  }
];

export default function Footer(){return <footer className="footer">
  <div className="footer-inner">
    <section className="footer-brand" aria-label="Capital City Provisions summary">
      <p className="footer-logo">Capital City Provisions</p>
      <p>Premium ranch quality, modern convenience, practical food security, and ethical local route incentives for Sacramento-area families and partners.</p>
      <p className="footer-note">No purchase necessary for giveaway entry. Cheesecake order bonuses are separate from giveaway odds.</p>
    </section>
    <nav className="footer-grid" aria-label="Footer navigation">
      {sections.map(section=><section className="footer-column" key={section.title} aria-label={section.title}>
        <h3>{section.title}</h3>
        <ul>
          {section.links.map(([label,href])=><li key={href}><a href={href}>{label}</a></li>)}
        </ul>
      </section>)}
    </nav>
  </div>
</footer>}
