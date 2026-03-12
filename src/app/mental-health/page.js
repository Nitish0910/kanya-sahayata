'use client';
import Link from 'next/link';
import { FiHeart, FiPhone, FiSmile, FiSun, FiUsers, FiBookOpen } from 'react-icons/fi';

export default function MentalHealthPage() {
  const services = [
    { icon: <FiPhone size={32} />, title: 'Counseling Helplines', desc: 'Toll-free counseling numbers: iCall (9152987821), Vandrevala Foundation (1860-2662-345). Speak to trained counselors 24/7.' },
    { icon: <FiHeart size={32} />, title: 'Emotional Support', desc: 'Safe, confidential space to talk about your feelings. Peer support groups and one-on-one sessions with trained volunteers.' },
    { icon: <FiSmile size={32} />, title: 'Stress Management', desc: 'Practical techniques for managing stress, anxiety, and pressure — guided meditation, breathing exercises, and journaling.' },
    { icon: <FiSun size={32} />, title: 'Self-Care Resources', desc: 'Curated guides on building healthy habits, maintaining positive mental health, and recognizing warning signs early.' },
    { icon: <FiUsers size={32} />, title: 'Support Groups', desc: 'Join community support groups where you can share experiences, find solidarity, and heal together in a safe environment.' },
    { icon: <FiBookOpen size={32} />, title: 'Mental Health Education', desc: 'Breaking stigma through awareness. Learn about depression, anxiety, PTSD, and when to seek professional help.' },
  ];

  return (
    <>
      <div className="page-banner">
        <h1>Mental Health</h1>
        <div className="divider"></div>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>Your mental health matters — you are not alone</p>
      </div>

      <section className="section-padding">
        <div className="container">
          <div className="section-heading">
            <h6>Mind & Wellness</h6>
            <h2>Take Care of Your Mind</h2>
          </div>

          {/* Counseling Banner */}
          <div className="glass-card" style={{ marginBottom: '50px', padding: '30px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(16,185,129,0.05), rgba(59,130,246,0.05))' }}>
            <h3 style={{ color: '#60a5fa', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>💙 Need someone to talk to?</h3>
            <p style={{ color: '#94a3b8', marginBottom: '16px' }}>It&apos;s okay to ask for help. Reach out to a counselor — it&apos;s free and confidential.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ padding: '12px 24px', background: 'rgba(59,130,246,0.1)', borderRadius: '10px', color: '#60a5fa', fontWeight: 600 }}>📞 iCall: 9152987821</div>
              <div style={{ padding: '12px 24px', background: 'rgba(59,130,246,0.1)', borderRadius: '10px', color: '#60a5fa', fontWeight: 600 }}>📞 Vandrevala: 1860-2662-345</div>
            </div>
          </div>

          <div className="grid-3">
            {services.map((s, i) => (
              <div key={i} className="glass-card" style={{ textAlign: 'center', padding: '40px 28px', animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both` }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#60a5fa' }}>
                  {s.icon}
                </div>
                <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>{s.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.8 }}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <Link href="/help-request" className="btn btn-primary">Request Mental Health Support →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
