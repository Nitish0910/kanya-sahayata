'use client';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import styles from './Footer.module.css';

export default function Footer() {
  const { t } = useI18n();

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
            <h4>{t('quickLinks')}</h4>
            <Link href="/">{t('home')}</Link>
            <Link href="/about">{t('about')}</Link>
            <Link href="/services">{t('services')}</Link>
            <Link href="/ngos">{t('ngoPartners')}</Link>
            <Link href="/contact">{t('contact')}</Link>
            <Link href="/donate">{t('donate')}</Link>
          </div>
          <div className={styles.links}>
            <h4>{t('ourServices')}</h4>
            <Link href="/education">📚 {t('education')}</Link>
            <Link href="/medical">🏥 {t('medical')}</Link>
            <Link href="/domestic">🏠 {t('domestic')}</Link>
            <Link href="/career">💼 {t('careerGuidance')}</Link>
            <Link href="/legal-aid">⚖️ {t('legalAid')}</Link>
            <Link href="/mental-health">💙 {t('mentalHealth')}</Link>
          </div>
          <div className={styles.links}>
            <h4>{t('contactInfo')}</h4>
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
