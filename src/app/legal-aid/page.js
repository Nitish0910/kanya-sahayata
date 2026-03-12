'use client';
import Link from 'next/link';
import { FiShield, FiPhone, FiAlertTriangle, FiBookOpen, FiHeart, FiUsers } from 'react-icons/fi';

export default function LegalAidPage() {
  const services = [
    { icon: <FiShield size={32} />, title: 'Know Your Rights', desc: 'Learn about your constitutional rights — right to education, protection from child marriage, dowry prohibition, and workplace safety.' },
    { icon: <FiPhone size={32} />, title: 'Helpline Numbers', desc: 'Women Helpline (181), Child Helpline (1098), Police (100), NCW (7827-170-170) — call anytime for immediate help.' },
    { icon: <FiAlertTriangle size={32} />, title: 'Report Abuse', desc: 'Confidential reporting mechanism for domestic violence, harassment, or any form of abuse. Your identity stays protected.' },
    { icon: <FiBookOpen size={32} />, title: 'Legal Awareness', desc: 'Workshops on POCSO Act, Domestic Violence Act, Sexual Harassment at Workplace Act, and other protective laws for women.' },
    { icon: <FiHeart size={32} />, title: 'Victim Support', desc: 'Rehabilitation support, shelter homes, and counseling for survivors of violence and abuse. You are not alone.' },
    { icon: <FiUsers size={32} />, title: 'Free Legal Counsel', desc: 'Connect with pro-bono lawyers and legal aid organizations who provide free legal assistance to women in need.' },
  ];

  return (
    <>
      <div className="page-banner">
        <h1>Legal Aid</h1>
        <div className="divider"></div>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>Protecting rights and ensuring justice for every girl</p>
      </div>

      <section className="section-padding">
        <div className="container">
          <div className="section-heading">
            <h6>Safety & Justice</h6>
            <h2>Your Rights, Your Strength</h2>
          </div>

          {/* Emergency Helplines Banner */}
          <div className="glass-card" style={{ marginBottom: '50px', padding: '30px', background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(249,115,22,0.08))', border: '1px solid rgba(239,68,68,0.2)' }}>
            <h3 style={{ color: '#f87171', fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>🚨 Emergency Helplines</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {[
                { num: '181', label: 'Women Helpline' },
                { num: '1098', label: 'Child Helpline' },
                { num: '100', label: 'Police' },
                { num: '112', label: 'Emergency' },
              ].map(h => (
                <div key={h.num} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 800, color: '#f87171' }}>{h.num}</span>
                  <span style={{ color: '#94a3b8', fontSize: '14px' }}>{h.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid-3">
            {services.map((s, i) => (
              <div key={i} className="glass-card" style={{ textAlign: 'center', padding: '40px 28px', animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both` }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#f87171' }}>
                  {s.icon}
                </div>
                <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>{s.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.8 }}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <Link href="/help-request" className="btn btn-primary">Request Legal Help →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
