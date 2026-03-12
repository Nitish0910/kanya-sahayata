'use client';
import Link from 'next/link';

const serviceItems = [
  { icon: '📖', title: 'Books', desc: 'We provide books required for your academics as well as for your enhancement. Providing books to girls is essential for promoting education.' },
  { icon: '✏️', title: 'School Supplies', desc: 'We provide stationery items required for studies — pencils, paper, backpacks, and notebooks.' },
  { icon: '🎬', title: 'Videos', desc: 'Educational videos helpful for decision making, critical thinking, and understanding complex topics.' },
  { icon: '📄', title: 'Educational Content', desc: 'PDFs, notes, and other study materials that help in your academics as well as real life.' },
  { icon: '🌾', title: 'Agricultural Knowledge', desc: 'Content for agricultural knowledge including farming techniques, crop management, and animal husbandry.' },
  { icon: '🧵', title: 'Life Skills Material', desc: 'Resources for practical life skills like cooking, sewing, and financial management.' },
];

export default function EducationPage() {
  return (
    <>
      <div className="page-banner">
        <h1>Education</h1>
        <div className="divider"></div>
      </div>

      <section className="section-padding" style={{ paddingBottom: '40px' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
            <h3 style={{ color: 'white', fontSize: '22px', fontWeight: 700, marginBottom: '16px' }}>Welcome to Our Educational Section!</h3>
            <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: '16px' }}>
              Here we provide virtual and physical content for your studies and enhancement. When you fill out the form, our team will contact you soon through email or phone to provide these items.
            </p>
            <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '24px', fontSize: '14px' }}>
              Kanya Sahayata Portal offers a range of educational facilities to support girls in their academic pursuits. We believe that education is a fundamental right for all, and we are here to help girls overcome barriers to education.
            </p>
            <Link href="/help-request" className="btn btn-primary">Fill Out Help Request Form</Link>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ paddingTop: '20px' }}>
        <div className="container">
          <div className="section-heading">
            <h6>Our Services</h6>
            <h2>What We Provide</h2>
          </div>
          <div className="grid-3">
            {serviceItems.map((item, i) => (
              <div key={i} className="glass-card" style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>{item.icon}</span>
                <h4 style={{ color: 'white', fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>{item.title}</h4>
                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/help-request" className="btn btn-secondary">Click to Access Facilities</Link>
          </div>
        </div>
      </section>
    </>
  );
}
