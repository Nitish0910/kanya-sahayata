import Link from 'next/link';

export const metadata = {
  title: 'Domestic Material',
  description: 'Get school uniforms, shoes, bags, stationery and daily essentials through Kanya Sahayata domestic support services.',
};

const domesticItems = [
  { icon: '👔', title: 'Uniform', desc: 'Get school uniforms to support your education.', link: '/help-request' },
  { icon: '👟', title: 'School Shoes', desc: 'Get school shoes to complete your school attire.', link: '/help-request' },
  { icon: '🎒', title: 'School Bag', desc: 'Get a school bag for carrying your books and supplies.', link: '/help-request' },
  { icon: '📝', title: 'Stationery', desc: 'Get essential stationery items for your studies.', link: '/help-request' },
];

export default function DomesticPage() {
  return (
    <>
      <div className="page-banner">
        <h1>Domestic Material</h1>
        <div className="divider"></div>
      </div>

      <section className="section-padding">
        <div className="container">
          <div className="section-heading">
            <h6>Daily Essentials</h6>
            <h2>Domestic Material We Provide</h2>
          </div>
          <div className="grid-4">
            {domesticItems.map((item, i) => (
              <div key={i} className="glass-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '56px', display: 'block', marginBottom: '16px' }}>{item.icon}</span>
                <h4 style={{ color: 'white', fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>{item.title}</h4>
                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.7, flex: 1, marginBottom: '20px' }}>{item.desc}</p>
                <Link href={item.link} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Fill Form</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
