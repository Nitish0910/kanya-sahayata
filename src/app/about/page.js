'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const [openAccordion, setOpenAccordion] = useState(0);

  const accordions = [
    { title: 'Who We Are', content: 'We are a team of dedicated members promoting girl\'s safety, education, and health. We provide various services to girls for their better future.' },
    { title: 'Our Mission', content: 'Our Mission is to provide the basic needs of every underprivileged girl. In our country, each girl must get her basic health and education needs fulfilled.' },
    { title: 'Our Vision', content: 'A world where every girl is able to use her voice, make her own decisions, and engage in economic opportunities.' },
  ];

  const steps = [
    { num: '01', title: 'Register', desc: 'Register yourself by filling some details like government ID, email, password, and more.' },
    { num: '02', title: 'Login', desc: 'After registering, login using your email ID and password.' },
    { num: '03', title: 'Fill Form', desc: 'Fill the form for the service you need — education, medical, or domestic.' },
    { num: '04', title: 'Get Help', desc: 'Then you can take benefits of the services which are available.' },
  ];

  return (
    <>
      <div className="page-banner">
        <h1>About Us</h1>
        <div className="divider"></div>
      </div>

      <section className="section-padding">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', alignItems: 'start' }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(249,115,22,0.05))', borderRadius: '20px', padding: '40px', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '80px' }}>🌸</span>
                <h3 style={{ color: 'white', marginTop: '16px', fontSize: '24px' }}>Kanya Sahayata</h3>
                <p style={{ color: '#94a3b8', marginTop: '8px' }}>Empowering Girls Since 2025</p>
              </div>
            </div>
            <div>
              {accordions.map((item, i) => (
                <div key={i} className="glass-card" style={{ marginBottom: '16px', cursor: 'pointer', padding: '24px' }} onClick={() => setOpenAccordion(openAccordion === i ? -1 : i)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ color: 'white', fontSize: '18px', fontWeight: 600 }}>{item.title}</h4>
                    <span style={{ color: '#34d399', fontSize: '20px', transform: openAccordion === i ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>▶</span>
                  </div>
                  {openAccordion === i && (
                    <p style={{ color: '#94a3b8', marginTop: '16px', lineHeight: 1.8, animation: 'fadeIn 0.3s ease-out' }}>{item.content}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(249,115,22,0.05))', borderTop: '1px solid rgba(16,185,129,0.1)', borderBottom: '1px solid rgba(16,185,129,0.1)', padding: '50px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          <h3 style={{ color: 'white', fontSize: '24px' }}>Helping the <em style={{ color: '#34d399', fontStyle: 'normal' }}>Girls</em> of <strong>Rural</strong> Areas</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/services" className="btn btn-primary">Our Services</Link>
            <Link href="/contact" className="btn btn-secondary">Contact Us</Link>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '50px', alignItems: 'start' }}>
            <div>
              <h3 style={{ color: 'white', fontSize: '28px', fontWeight: 700, marginBottom: '16px' }}>How to Become Part of This?</h3>
              <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: '24px' }}>To take benefit of these services, follow these simple steps:</p>
              <Link href="/register" className="btn btn-primary">Register Now</Link>
            </div>
            <div className="grid-2">
              {steps.map((step, i) => (
                <div key={i} className="glass-card" style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '36px', fontWeight: 900, background: 'linear-gradient(135deg, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'block', marginBottom: '12px' }}>{step.num}</span>
                  <h4 style={{ color: 'white', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{step.title}</h4>
                  <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
