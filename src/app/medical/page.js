'use client';
import Link from 'next/link';

const medicalServices = [
  { icon: '📞', title: 'Tele Consultations', desc: 'Find contact numbers of doctors and get consultations and prescriptions over the phone.', link: '/help-request' },
  { icon: '🏥', title: 'Healthcare Information', desc: 'Access important health information including menstrual hygiene guidance and wellness resources.', link: '/help-request' },
  { icon: '🧴', title: 'Sanitary Products', desc: 'Get sanitizers, sanitary pads, and other hygiene products by filling out a request form.', link: '/help-request' },
  { icon: '💊', title: 'Medicines', desc: 'Get general medicines for fever, cough, etc. Fill out the form to request available medicines.', link: '/help-request' },
];

export default function MedicalPage() {
  return (
    <>
      <div className="page-banner">
        <h1>Medical Services</h1>
        <div className="divider"></div>
      </div>

      <section className="section-padding">
        <div className="container">
          <div className="section-heading">
            <h6>Healthcare</h6>
            <h2>Medical Services We Provide</h2>
          </div>
          <div className="grid-4">
            {medicalServices.map((item, i) => (
              <div key={i} className="glass-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '56px', display: 'block', marginBottom: '16px' }}>{item.icon}</span>
                <h4 style={{ color: 'white', fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>{item.title}</h4>
                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.7, flex: 1, marginBottom: '20px' }}>{item.desc}</p>
                <Link href={item.link} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Request Help</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
