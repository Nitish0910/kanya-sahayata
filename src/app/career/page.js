'use client';
import Link from 'next/link';
import { FiBriefcase, FiFileText, FiUsers, FiTrendingUp, FiAward, FiBookOpen } from 'react-icons/fi';

export default function CareerPage() {
  const services = [
    { icon: <FiBriefcase size={32} />, title: 'Job Listings', desc: 'Browse latest job openings suitable for young women in your area — from government schemes to private sector opportunities.' },
    { icon: <FiFileText size={32} />, title: 'Resume Building', desc: 'Learn how to create a professional resume that stands out. Templates and tips tailored for first-time job seekers.' },
    { icon: <FiUsers size={32} />, title: 'Interview Preparation', desc: 'Mock interview sessions, common questions, and confidence-building workshops to help you ace your interviews.' },
    { icon: <FiTrendingUp size={32} />, title: 'Skill Training Programs', desc: 'Free and subsidized skill development courses — computer skills, communication, financial literacy, and more.' },
    { icon: <FiAward size={32} />, title: 'Scholarship & Internships', desc: 'Curated list of scholarships, fellowships, and internship programs for girls from underprivileged backgrounds.' },
    { icon: <FiBookOpen size={32} />, title: 'Entrepreneurship', desc: 'Guidance on starting your own business — from ideation to execution. Access to micro-financing and mentorship.' },
  ];

  return (
    <>
      <div className="page-banner">
        <h1>Career Guidance</h1>
        <div className="divider"></div>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>Building futures through employment and skill development</p>
      </div>

      <section className="section-padding">
        <div className="container">
          <div className="section-heading">
            <h6>Empowerment Through Employment</h6>
            <h2>Shape Your Career Path</h2>
          </div>

          <div className="grid-3">
            {services.map((s, i) => (
              <div key={i} className="glass-card" style={{ textAlign: 'center', padding: '40px 28px', animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both` }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#a78bfa' }}>
                  {s.icon}
                </div>
                <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>{s.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.8 }}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <Link href="/help-request" className="btn btn-primary">Request Career Help →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
