'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: 'Login successful! Redirecting...' });
        setTimeout(() => {
          window.location.href = '/services';
        }, 800);
      } else {
        setStatus({ type: 'error', message: data.message });
      }
    } catch {
      setStatus({ type: 'error', message: 'Something went wrong.' });
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 60px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '56px', display: 'block', marginBottom: '16px' }}>🌸</span>
          <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Welcome Back</h1>
          <p style={{ color: '#94a3b8' }}>Sign in to access services</p>
        </div>

        {status && <div className={`alert alert-${status.type}`}>{status.message}</div>}

        <div className="glass-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input className="form-input" type="email" required placeholder="Enter your email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input className="form-input" type="password" required placeholder="Enter your password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Link href="/forgot-password" style={{ color: '#f97316', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Forgot Password?</Link>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', color: '#94a3b8', fontSize: '14px' }}>
            Don&apos;t have an account? <Link href="/register" style={{ color: '#34d399', textDecoration: 'none', fontWeight: 600 }}>Sign Up Now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
