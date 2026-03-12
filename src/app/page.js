'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiBookOpen, FiHeart, FiShield, FiHeadphones, FiBriefcase, FiSmile } from 'react-icons/fi';
import styles from './page.module.css';

const services = [
  { icon: <FiBookOpen size={32} />, title: 'Education', desc: 'Study materials, scholarships, notes, and videos for academic growth.', href: '/education', color: '#10b981' },
  { icon: <FiHeart size={32} />, title: 'Medical', desc: 'Tele-consultations, medicines, health info, and medical camps.', href: '/medical', color: '#f97316' },
  { icon: <FiShield size={32} />, title: 'Domestic', desc: 'Uniforms, school supplies, sanitary products, and daily essentials.', href: '/domestic', color: '#8b5cf6' },
  { icon: <FiBriefcase size={32} />, title: 'Career Guidance', desc: 'Job listings, skill training, resume building, and internships.', href: '/career', color: '#a78bfa' },
  { icon: <FiShield size={32} />, title: 'Legal Aid', desc: 'Know your rights, free legal counsel, and emergency helplines.', href: '/legal-aid', color: '#f87171' },
  { icon: <FiSmile size={32} />, title: 'Mental Health', desc: 'Counseling, emotional support, stress management, and self-care.', href: '/mental-health', color: '#60a5fa' },
];

const aboutTabs = [
  {
    title: 'Education',
    items: [
      { heading: 'Education Material', details: ["PDF's", 'Videos', 'Notes'] },
      { heading: 'Agricultural Knowledge', details: ['Basic knowledge', 'Videos', 'Pdf for crops and agriculture'] },
      { heading: 'Motivational Stories', details: ['Motivational videos', 'Positive stories', 'Thoughts'] },
    ],
  },
  {
    title: 'Domestic',
    items: [
      { heading: 'Domestic Material', details: ['Bag', 'School Supplies', 'Uniform'] },
    ],
  },
  {
    title: 'Medical',
    items: [
      { heading: 'Medical Consultations', details: ['Tele consultations', 'Phone numbers', 'Medicines'] },
      { heading: 'Health Knowledge', details: ['Basic knowledge', 'Videos', 'Pdf for hygiene'] },
      { heading: 'Medicines & Sanitary', details: ['Provide Medicine', 'Provide sanitary products'] },
    ],
  },
];

const successStories = [
  {
    name: 'Meena Kumari',
    location: 'Rampur, UP',
    story: 'Meena ko education scholarship mili Saheli Foundation se. Pehle school jaana mushkil tha, ab woh class 10 me topper hai aur teacher banna chahti hai.',
    service: 'Education',
    color: '#10b981',
    emoji: '📚',
  },
  {
    name: 'Pooja Devi',
    location: 'Bilaspur, CG',
    story: 'Pooja ki beti ko rare blood disease tha. Jan Swasthya Sahyog ne free surgery ki. Ab woh poori tarah se healthy hai aur school jaati hai.',
    service: 'Medical',
    color: '#f97316',
    emoji: '🏥',
  },
  {
    name: 'Ritu Singh',
    location: 'Ajmer, Rajasthan',
    story: 'Ritu ne Barefoot College se solar engineering sikhi. Ab woh apne gaon me solar panels install karti hai aur Rs. 15,000 monthly kamati hai.',
    service: 'Career',
    color: '#a78bfa',
    emoji: '💼',
  },
];

const testimonials = [
  { text: "It's a very good website which helps us by providing several services. They sent the help immediately whenever required. I am very grateful for the benefits they provide.", name: 'Priya', role: 'A rural area girl' },
  { text: "The education materials and support provided have been life-changing. I can now access study materials that were never available in my village before.", name: 'Anita', role: 'Student' },
  { text: "The medical facilities and hygiene products we received have made a significant difference in our community. Thank you Kanya Sahayata!", name: 'Sunita', role: 'Community member' },
];

// Animated counter hook
function useCounter(end, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return [count, ref];
}

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const [girlsHelped, girlsRef] = useCounter(500);
  const [ngosCount, ngosRef] = useCounter(22);
  const [servicesCount, servicesRef] = useCounter(6);
  const [statesCount, statesRef] = useCounter(8);

  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBg}></div>
        <div className={styles.heroContent}>
          <div className="container">
            <div className={styles.heroText}>
              <span className={styles.heroBadge}>🌸 Empowering Girls Since 2025</span>
              <h1>
                Get <em>Ready</em> to Encourage<br />
                and Support <span className={styles.highlight}>Girls</span>
              </h1>
              <p>Kanya Sahayata helps rural girls by providing education, medical, career guidance, legal aid, and mental health support through 22+ NGO partners.</p>
              <div className={styles.heroButtons}>
                <Link href="/donate" className="btn btn-primary">
                  Donate Now <FiArrowRight />
                </Link>
                <Link href="/contact" className="btn btn-outline">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(139,92,246,0.05))', borderBottom: '1px solid rgba(16,185,129,0.1)', padding: '40px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', textAlign: 'center' }}>
            {[
              { label: 'Girls Helped', value: girlsHelped, suffix: '+', ref: girlsRef, color: '#10b981', icon: '👧' },
              { label: 'Partner NGOs', value: ngosCount, suffix: '+', ref: ngosRef, color: '#f97316', icon: '🏢' },
              { label: 'Services', value: servicesCount, suffix: '', ref: servicesRef, color: '#8b5cf6', icon: '🎯' },
              { label: 'States Covered', value: statesCount, suffix: '+', ref: statesRef, color: '#60a5fa', icon: '📍' },
            ].map((stat, i) => (
              <div key={i} ref={stat.ref} style={{ padding: '24px' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
                <div style={{ fontSize: '40px', fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}{stat.suffix}</div>
                <div style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px', fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section — 6 services now */}
      <section className={`section-padding ${styles.services}`}>
        <div className="container">
          <div className="section-heading">
            <h6>What We Do</h6>
            <h2>Our Services</h2>
          </div>
          <div className="grid-3">
            {services.map((service, i) => (
              <Link href={service.href} key={i} style={{ textDecoration: 'none' }}>
                <div className={`glass-card ${styles.serviceCard}`} style={{ animationDelay: `${i * 0.1}s`, textAlign: 'center' }}>
                  <div className={styles.serviceIcon} style={{ color: service.color, background: `${service.color}15` }}>{service.icon}</div>
                  <h4 style={{ color: 'white' }}>{service.title}</h4>
                  <p>{service.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaBanner}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h3>Helping the <em>Girls</em> of <strong>Rural</strong> Areas</h3>
            <div className={styles.ctaButtons}>
              <Link href="/about" className="btn btn-primary">Know More</Link>
              <Link href="/contact" className="btn btn-secondary">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="section-padding" style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1a1f3a 100%)' }}>
        <div className="container">
          <div className="section-heading">
            <h6>Impact Stories</h6>
            <h2>Lives We Changed</h2>
          </div>
          <div className="grid-3">
            {successStories.map((story, i) => (
              <div key={i} className="glass-card" style={{ padding: '32px', borderTop: `3px solid ${story.color}`, animation: `fadeInUp 0.6s ease-out ${i * 0.15}s both` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '32px' }}>{story.emoji}</span>
                  <div>
                    <h4 style={{ color: 'white', fontSize: '18px', fontWeight: 700 }}>{story.name}</h4>
                    <span style={{ color: '#94a3b8', fontSize: '13px' }}>{story.location}</span>
                  </div>
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.9, marginBottom: '16px' }}>&ldquo;{story.story}&rdquo;</p>
                <span style={{ padding: '4px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: 600, background: `${story.color}15`, color: story.color, border: `1px solid ${story.color}30` }}>
                  {story.service}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About / Tabs Section */}
      <section className={`section-padding ${styles.aboutSection}`}>
        <div className="container">
          <div className="section-heading">
            <h6>About Us</h6>
            <h2>Know Us Better</h2>
          </div>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutTabs}>
              <div className={styles.tabButtons}>
                {aboutTabs.map((tab, i) => (
                  <button
                    key={i}
                    className={`${styles.tabBtn} ${activeTab === i ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab(i)}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>
              <div className={styles.tabContent}>
                {aboutTabs[activeTab].items.map((item, i) => (
                  <div key={i} className={styles.tabItem}>
                    <h5>{item.heading}</h5>
                    <ul>
                      {item.details.map((d, j) => (
                        <li key={j}>{d}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.aboutRight}>
              <h4>Please be free to contact us for help</h4>
              <p>You can contact us for accessing our services. Reach us through email, phone, or visit our location.</p>
              <div className={styles.aboutButtons}>
                <Link href="/about" className="btn btn-primary">Know More</Link>
                <Link href="/contact" className="btn btn-outline">Contact</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`section-padding ${styles.testimonials}`}>
        <div className="container">
          <div className="section-heading">
            <h6>Let&apos;s See</h6>
            <h2>What They Say</h2>
          </div>
          <div className="grid-3">
            {testimonials.map((t, i) => (
              <div key={i} className={`glass-card ${styles.testimonialCard}`}>
                <div className={styles.quoteIcon}>&ldquo;</div>
                <p>{t.text}</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar}>{t.name[0]}</div>
                  <div>
                    <h5>{t.name}</h5>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer CTA */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(16,185,129,0.06))', borderTop: '1px solid rgba(139,92,246,0.1)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'white', fontSize: '36px', fontWeight: 800, marginBottom: '16px' }}>Want to Make a <span style={{ color: '#34d399' }}>Difference</span>?</h2>
          <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0 auto 32px', lineHeight: 1.8 }}>
            Join us as a volunteer, partner NGO, or donor. Every contribution helps a girl build a better future.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/donate" className="btn btn-primary">💝 Donate Now</Link>
            <Link href="/ngos/register" className="btn btn-secondary">🏢 Register Your NGO</Link>
            <Link href="/contact" className="btn btn-outline">📞 Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
