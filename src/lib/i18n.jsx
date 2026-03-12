'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const translations = {
  en: {
    // Header
    home: 'Home',
    about: 'About',
    services: 'Services',
    contact: 'Contact',
    ngoPartners: 'NGO Partners',
    donate: 'Donate',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    logout: 'Logout',
    myRequests: 'My Requests',
    // Hero
    heroTag: 'Empowering Girls Since 2025',
    heroTitle: 'Get Ready to Encourage and Support Girls',
    heroDesc: 'Kanya Sahayata helps rural girls by providing education, medical, career guidance, legal aid, and mental health support through 22+ NGO partners.',
    donateNow: 'Donate Now →',
    contactUs: 'Contact Us',
    // Services
    education: 'Education',
    medical: 'Medical',
    domestic: 'Domestic',
    careerGuidance: 'Career Guidance',
    legalAid: 'Legal Aid',
    mentalHealth: 'Mental Health',
    whatWeDo: 'WHAT WE DO',
    ourServices: 'Our Services',
    // Stats
    girlsHelped: 'Girls Helped',
    partnerNgos: 'Partner NGOs',
    serviceCount: 'Services',
    statesCovered: 'States Covered',
    // Common
    fillForm: 'Fill Form',
    knowMore: 'Know More',
    learnMore: 'Learn More',
    submit: 'Submit',
    cancel: 'Cancel',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    // Footer
    quickLinks: 'Quick Links',
    contactInfo: 'Contact Info',
    // Notifications
    notifications: 'Notifications',
    noNotifications: 'No notifications yet',
    markAllRead: 'Mark all read',
    // Profile
    profile: 'Profile',
    changePassword: 'Change Password',
    updateProfile: 'Update Profile',
  },
  hi: {
    // Header
    home: 'होम',
    about: 'हमारे बारे में',
    services: 'सेवाएं',
    contact: 'संपर्क',
    ngoPartners: 'NGO साझेदार',
    donate: 'दान करें',
    signIn: 'लॉगिन',
    signUp: 'रजिस्टर',
    logout: 'लॉगआउट',
    myRequests: 'मेरे अनुरोध',
    // Hero
    heroTag: '2025 से लड़कियों को सशक्त बना रहे हैं',
    heroTitle: 'लड़कियों को प्रोत्साहित और समर्थन करें',
    heroDesc: 'कन्या सहायता ग्रामीण लड़कियों को शिक्षा, चिकित्सा, करियर मार्गदर्शन, कानूनी सहायता और मानसिक स्वास्थ्य सहायता 22+ NGO भागीदारों के माध्यम से प्रदान करती है।',
    donateNow: 'अभी दान करें →',
    contactUs: 'संपर्क करें',
    // Services
    education: 'शिक्षा',
    medical: 'चिकित्सा',
    domestic: 'घरेलू सामग्री',
    careerGuidance: 'करियर मार्गदर्शन',
    legalAid: 'कानूनी सहायता',
    mentalHealth: 'मानसिक स्वास्थ्य',
    whatWeDo: 'हम क्या करते हैं',
    ourServices: 'हमारी सेवाएं',
    // Stats
    girlsHelped: 'लड़कियों की मदद',
    partnerNgos: 'साझेदार NGO',
    serviceCount: 'सेवाएं',
    statesCovered: 'राज्य शामिल',
    // Common
    fillForm: 'फॉर्म भरें',
    knowMore: 'और जानें',
    learnMore: 'विस्तार से',
    submit: 'जमा करें',
    cancel: 'रद्द करें',
    loading: 'लोड हो रहा है...',
    success: 'सफल',
    error: 'त्रुटि',
    // Footer
    quickLinks: 'त्वरित लिंक',
    contactInfo: 'संपर्क जानकारी',
    // Notifications
    notifications: 'सूचनाएं',
    noNotifications: 'कोई सूचना नहीं',
    markAllRead: 'सब पढ़ा हुआ',
    // Profile
    profile: 'प्रोफ़ाइल',
    changePassword: 'पासवर्ड बदलें',
    updateProfile: 'प्रोफ़ाइल अपडेट',
  }
};

const I18nContext = createContext(null);

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
}

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('kanya-lang');
    if (saved === 'hi' || saved === 'en') setLocale(saved);
  }, []);

  const switchLocale = useCallback((lang) => {
    setLocale(lang);
    localStorage.setItem('kanya-lang', lang);
  }, []);

  const t = useCallback((key) => {
    return translations[locale]?.[key] || translations.en[key] || key;
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, switchLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function LanguageToggle() {
  const { locale, switchLocale } = useI18n();
  return (
    <button
      onClick={() => switchLocale(locale === 'en' ? 'hi' : 'en')}
      aria-label={`Switch to ${locale === 'en' ? 'Hindi' : 'English'}`}
      title={`Switch to ${locale === 'en' ? 'हिंदी' : 'English'}`}
      style={{
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '12px',
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: 600,
        color: '#cbd5e1',
        transition: 'all 0.3s ease',
        flexShrink: 0,
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      {locale === 'en' ? '🇮🇳 हिं' : '🇬🇧 EN'}
    </button>
  );
}
