'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiBookOpen, FiHeart, FiHome, FiBriefcase, FiShield, FiSmile } from 'react-icons/fi';

export default function ServicesPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/auth/session').then(r => r.json()).then(d => { if (d.loggedIn) setUser(d.user); });
  }, []);

  const services = [
    { icon: <FiBookOpen size={40} />, title: 'Education', desc: 'Find education related material here — videos, notes, and study resources for your academic growth.', href: '/education', color: '#10b981', emoji: '📚' },
    { icon: <FiHeart size={40} />, title: 'Medical', desc: 'Get medical and health related help through tele-consultations, medicines, and health information.', href: '/medical', color: '#f97316', emoji: '🏥' },
    { icon: <FiHome size={40} />, title: 'Domestic', desc: 'Get basic domestic material required in your daily life — uniforms, shoes, and school supplies.', href: '/domestic', color: '#8b5cf6', emoji: '🏠' },
    { icon: <FiBriefcase size={40} />, title: 'Career Guidance', desc: 'Job listings, skill training, resume building, scholarship info, and entrepreneurship guidance for a better future.', href: '/career', color: '#a78bfa', emoji: '💼' },
    { icon: <FiShield size={40} />, title: 'Legal Aid', desc: 'Know your rights, report abuse, access free legal counsel, and connect with helplines for immediate help.', href: '/legal-aid', color: '#f87171', emoji: '⚖️' },
    { icon: <FiSmile size={40} />, title: 'Mental Health', desc: 'Counseling helplines, emotional support groups, stress management techniques, and self-care resources.', href: '/mental-health', color: '#60a5fa', emoji: '💙' },
  ];

  return (
    <>
      <div className="page-banner">
        {user && <p style={{ color: '#34d399', fontSize: '16px', marginBottom: '8px' }}>Welcome, {user.name}! 🌸</p>}
        <h1>Our Services</h1>
        <div className="divider"></div>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>6 comprehensive services to support every aspect of your life</p>
      </div>

      <section className="section-padding">
        <div className="container">
          <div style={{ display: 'grid', gap: '40px' }}>
            {services.map((service, i) => (
              <div key={i} className="glass-card" style={{ padding: '40px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center', direction: i % 2 !== 0 ? 'rtl' : 'ltr' }}>
                  <div style={{ direction: 'ltr' }}>
                    <div style={{ width: '72px', height: '72px', borderRadius: '18px', background: `${service.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: service.color, marginBottom: '20px' }}>
                      {service.icon}
                    </div>
                    <h3 style={{ color: 'white', fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>
                      <Link href={service.href} style={{ color: 'white', textDecoration: 'none' }}>{service.title}</Link>
                    </h3>
                    <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: '24px' }}>{service.desc}</p>
                    <Link href={service.href} className="btn btn-primary">Explore →</Link>
                  </div>
                  <div style={{ direction: 'ltr', background: `linear-gradient(135deg, ${service.color}10, ${service.color}05)`, borderRadius: '20px', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '80px' }}>{service.emoji}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(249,115,22,0.05))', borderTop: '1px solid rgba(16,185,129,0.1)', padding: '50px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          <h3 style={{ color: 'white', fontSize: '22px' }}>Get <em style={{ color: '#34d399', fontStyle: 'normal' }}>ready</em> to encourage and support Girls</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/about" className="btn btn-primary">Know More</Link>
            <Link href="/contact" className="btn btn-secondary">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
