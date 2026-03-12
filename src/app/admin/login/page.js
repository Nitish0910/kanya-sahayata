'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [form, setForm] = useState({ userid: '', password: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: 'Login successful! Redirecting...' });
        setTimeout(() => { router.push('/admin/dashboard'); router.refresh(); }, 800);
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
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(139,92,246,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '36px' }}>🔐</div>
          <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Admin Login</h1>
          <p style={{ color: '#94a3b8' }}>Access the admin dashboard</p>
        </div>

        {status && <div className={`alert alert-${status.type}`}>{status.message}</div>}

        <div className="glass-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Admin ID</label>
              <input className="form-input" required placeholder="Enter Admin ID (e.g. ADMIN-001)" value={form.userid} onChange={e => setForm({...form, userid: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input className="form-input" type="password" required placeholder="Enter password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
