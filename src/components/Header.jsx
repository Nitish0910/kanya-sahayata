'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMenu, FiX } from 'react-icons/fi';
import { ThemeToggle } from './ThemeProvider';
import { LanguageToggle } from '@/lib/i18n';
import NotificationBell from './NotificationBell';
import styles from './Header.module.css';
import Image from 'next/image';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (data.loggedIn) setUser(data.user);
      } catch {}
    };
    checkSession();

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
    router.refresh();
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && menuOpen) setMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [menuOpen]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`} role="banner">
      <div className={styles.container}>
        <Link href="/" className={styles.logo} aria-label="Kanya Sahayata - Go to homepage">
          <Image src="/logo.png" alt="Kanya Sahayata Logo" width={48} height={48} style={{ borderRadius: '8px', objectFit: 'cover' }} />
          <span className={styles.logoText}>Kanya <span>Sahayata</span></span>
        </Link>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`} role="navigation" aria-label="Main navigation">
          <Link href="/" className={styles.navLink} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/about" className={styles.navLink} onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/services" className={styles.navLink} onClick={() => setMenuOpen(false)}>Services</Link>
          <Link href="/contact" className={styles.navLink} onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link href="/ngos" className={styles.navLink} onClick={() => setMenuOpen(false)}>NGO Partners</Link>
          <Link href="/donate" className={styles.navLink} onClick={() => setMenuOpen(false)}>Donate</Link>
          
          {user ? (
            <div className={styles.authSection}>
              <Link href="/my-requests" className={styles.navLink} onClick={() => setMenuOpen(false)} style={{ color: '#34d399', fontWeight: 600 }}>My Requests</Link>
              <NotificationBell />
              <Link href="/profile" className={styles.welcome} onClick={() => setMenuOpen(false)} style={{ cursor: 'pointer', textDecoration: 'none' }} aria-label={`Profile for ${user.name}`}>Hi, {user.name}!</Link>
              <button onClick={handleLogout} className={styles.logoutBtn} aria-label="Logout from your account">Logout</button>
            </div>
          ) : (
            <div className={styles.authSection}>
              <Link href="/login" className={styles.signInBtn} onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link href="/register" className={`btn btn-primary ${styles.signUpBtn}`} onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
          <ThemeToggle />
          <LanguageToggle />
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className={styles.mobileTheme}><ThemeToggle /></div>
          <button
            className={styles.menuToggle}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
