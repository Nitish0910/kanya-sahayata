import { Poppins } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClientProviders from '@/components/ClientProviders';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata = {
  title: {
    default: 'Kanya Sahayata — Empowering Rural Girls with Education, Medical & Career Support',
    template: '%s | Kanya Sahayata',
  },
  description: 'Kanya Sahayata helps rural girls by providing education, medical, career guidance, legal aid, and mental health support through 22+ NGO partners across India.',
  keywords: ['kanya sahayata', 'girl empowerment', 'rural education', 'NGO India', 'women empowerment', 'girl child support'],
  manifest: '/manifest.json',
  openGraph: {
    title: 'Kanya Sahayata — Empowering Rural Girls',
    description: 'Education, medical, career guidance, legal aid, and mental health support for rural girls.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Kanya Sahayata',
  },
};

export const viewport = {
  themeColor: '#10b981',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body>
        <ClientProviders>
          <Header />
          <main>{children}</main>
          <Footer />
        </ClientProviders>
        {/* PWA Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
