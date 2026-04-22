'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiX } from 'react-icons/fi';

const searchData = [
  { title: 'Education', desc: 'Study materials, scholarships, notes', href: '/education', icon: '📚', category: 'Services' },
  { title: 'Medical', desc: 'Health consultations, medicines', href: '/medical', icon: '🏥', category: 'Services' },
  { title: 'Domestic', desc: 'Uniforms, school supplies, essentials', href: '/domestic', icon: '🏠', category: 'Services' },
  { title: 'Career Guidance', desc: 'Jobs, skills, resume, internships', href: '/career', icon: '💼', category: 'Services' },
  { title: 'Legal Aid', desc: 'Rights, lawyers, helplines', href: '/legal-aid', icon: '⚖️', category: 'Services' },
  { title: 'Mental Health', desc: 'Counseling, support, self-care', href: '/mental-health', icon: '💙', category: 'Services' },
  { title: 'NGO Partners', desc: 'Find trusted NGOs near you', href: '/ngos', icon: '🏢', category: 'Pages' },
  { title: 'Donate', desc: 'Donate books, medicines, essentials', href: '/donate', icon: '💝', category: 'Pages' },
  { title: 'Contact Us', desc: 'Reach us via email, phone, map', href: '/contact', icon: '📞', category: 'Pages' },
  { title: 'About Us', desc: 'Our mission, vision, team', href: '/about', icon: '🌸', category: 'Pages' },
  { title: 'Help Request', desc: 'Submit a help request form', href: '/help-request', icon: '📝', category: 'Pages' },
  { title: 'My Requests', desc: 'Track your help requests', href: '/my-requests', icon: '📋', category: 'Pages' },
  { title: 'Profile', desc: 'View and edit your profile', href: '/profile', icon: '👤', category: 'Account' },
  { title: 'Sign In', desc: 'Login to your account', href: '/login', icon: '🔑', category: 'Account' },
  { title: 'Sign Up', desc: 'Register a new account', href: '/register', icon: '✨', category: 'Account' },
  { title: 'Register NGO', desc: 'Register your NGO as partner', href: '/ngos/register', icon: '🏢', category: 'NGO' },
  { title: 'Women Helpline', desc: 'Emergency: Call 181', href: 'tel:181', icon: '🚨', category: 'Emergency' },
  { title: 'Child Helpline', desc: 'Emergency: Call 1098', href: 'tel:1098', icon: '📞', category: 'Emergency' },
  { title: 'Police', desc: 'Emergency: Call 100', href: 'tel:100', icon: '🚔', category: 'Emergency' },
];

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    setQuery('');
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); onClose(); }
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? searchData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.desc.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      )
    : searchData.slice(0, 8);

  const handleSelect = (href) => {
    onClose();
    if (href.startsWith('tel:')) {
      window.open(href, '_self');
    } else {
      router.push(href);
    }
  };

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-container" onClick={e => e.stopPropagation()}>
        <div className="search-input-wrap">
          <FiSearch size={20} style={{ color: '#94a3b8', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search services, pages, helplines..."
          />
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
            <FiX size={20} />
          </button>
        </div>
        <div className="search-results">
          {filtered.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((item, i) => (
              <div key={i} className="search-result-item" onClick={() => handleSelect(item.href)}>
                <span style={{ fontSize: '24px', flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{item.desc}</div>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(16,185,129,0.1)', color: '#34d399', fontWeight: 600, flexShrink: 0 }}>{item.category}</span>
              </div>
            ))
          )}
        </div>
        <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', color: '#475569', fontSize: '11px', textAlign: 'center' }}>
          Press <kbd style={{ padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', fontSize: '10px' }}>ESC</kbd> to close
        </div>
      </div>
    </div>
  );
}
