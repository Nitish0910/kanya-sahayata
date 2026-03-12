import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>🌸</span>
              <span>Kanya Sahayata</span>
            </div>
            <p>A mission to encourage and help girls in rural areas with education, medical, career, legal, and mental health support through 22+ partner NGOs.</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              {['📧', '📞', '📍'].map((e, i) => (
                <span key={i} style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{e}</span>
              ))}
            </div>
          </div>
          <div className={styles.links}>
            <h4>Quick Links</h4>
            <Link href="/">Home</Link>
            <Link href="/about">About Us</Link>
            <Link href="/services">Services</Link>
            <Link href="/ngos">NGO Partners</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/donate">Donate</Link>
          </div>
          <div className={styles.links}>
            <h4>Our Services</h4>
            <Link href="/education">📚 Education</Link>
            <Link href="/medical">🏥 Medical</Link>
            <Link href="/domestic">🏠 Domestic</Link>
            <Link href="/career">💼 Career Guidance</Link>
            <Link href="/legal-aid">⚖️ Legal Aid</Link>
            <Link href="/mental-health">💙 Mental Health</Link>
          </div>
          <div className={styles.links}>
            <h4>Contact Info</h4>
            <p>📧 kanyasahayata@gmail.com</p>
            <p>📞 9100200340</p>
            <p>📍 Moradabad, India</p>
            <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
              <p style={{ color: '#f87171', fontSize: '12px', fontWeight: 600 }}>🚨 Emergency: 181 | 1098</p>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>Copyright © 2025 Kanya Sahayata — Empowering rural girls through education, healthcare & support. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
