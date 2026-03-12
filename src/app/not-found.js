import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '120px 24px 60px',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '520px' }}>
        <div style={{
          fontSize: '120px',
          fontWeight: 900,
          lineHeight: 1,
          background: 'linear-gradient(135deg, #10b981, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '16px'
        }}>
          404
        </div>
        <h1 style={{
          color: 'white',
          fontSize: '28px',
          fontWeight: 700,
          marginBottom: '12px'
        }}>
          Page Not Found
        </h1>
        <p style={{
          color: '#94a3b8',
          fontSize: '16px',
          lineHeight: 1.7,
          marginBottom: '32px'
        }}>
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-primary">
            🏠 Go Home
          </Link>
          <Link href="/contact" className="btn btn-outline">
            📞 Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
