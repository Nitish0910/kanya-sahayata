'use client';
import { useState } from 'react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 'verify', email, id_number: idNumber })
      });
      const data = await res.json();
      if (data.success) {
        setStep(2);
        setUserName(data.userName);
        setMessage(data.message);
      } else {
        setError(data.message);
      }
    } catch {
      setError('Something went wrong. Try again.');
    }
    setLoading(false);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 'reset', email, id_number: idNumber, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setStep(3);
        setMessage(data.message);
      } else {
        setError(data.message);
      }
    } catch {
      setError('Something went wrong. Try again.');
    }
    setLoading(false);
  };

  return (
    <>
      <div className="page-banner">
        <h1>Forgot Password</h1>
        <div className="divider"></div>
      </div>
      <section className="section-padding">
        <div className="container" style={{ maxWidth: '500px' }}>
          <div className="glass-card" style={{ padding: '40px' }}>

            {step === 1 && (
              <>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <span style={{ fontSize: '48px' }}>🔐</span>
                  <h3 style={{ color: 'white', fontSize: '22px', fontWeight: 700, marginTop: '12px' }}>Verify Your Identity</h3>
                  <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px' }}>Enter your registered email and government ID number</p>
                </div>
                <form onSubmit={handleVerify}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: 500, marginBottom: '8px', display: 'block' }}>Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Enter your registered email" className="form-input" />
                  </div>
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: 500, marginBottom: '8px', display: 'block' }}>Government ID Number (Aadhar/PAN)</label>
                    <input type="text" value={idNumber} onChange={e => setIdNumber(e.target.value)} required placeholder="Enter your ID number" className="form-input" />
                  </div>
                  {error && <p style={{ color: '#f87171', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>❌ {error}</p>}
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify Identity →'}
                  </button>
                </form>
              </>
            )}

            {step === 2 && (
              <>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <span style={{ fontSize: '48px' }}>✅</span>
                  <h3 style={{ color: 'white', fontSize: '22px', fontWeight: 700, marginTop: '12px' }}>Welcome back, {userName}!</h3>
                  <p style={{ color: '#34d399', fontSize: '14px', marginTop: '8px' }}>{message}</p>
                </div>
                <form onSubmit={handleReset}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: 500, marginBottom: '8px', display: 'block' }}>New Password</label>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required placeholder="Enter new password (min 6 chars)" className="form-input" />
                  </div>
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: 500, marginBottom: '8px', display: 'block' }}>Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="Confirm new password" className="form-input" />
                  </div>
                  {error && <p style={{ color: '#f87171', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>❌ {error}</p>}
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                    {loading ? 'Resetting...' : '🔑 Reset Password'}
                  </button>
                </form>
              </>
            )}

            {step === 3 && (
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '64px' }}>🎉</span>
                <h3 style={{ color: 'white', fontSize: '22px', fontWeight: 700, marginTop: '16px' }}>Password Reset Successfully!</h3>
                <p style={{ color: '#34d399', fontSize: '14px', marginTop: '8px', marginBottom: '24px' }}>{message}</p>
                <Link href="/login" className="btn btn-primary" style={{ justifyContent: 'center' }}>→ Go to Login</Link>
              </div>
            )}

            {step !== 3 && (
              <p style={{ textAlign: 'center', marginTop: '24px', color: '#94a3b8', fontSize: '14px' }}>
                Remember your password? <Link href="/login" style={{ color: '#34d399' }}>Sign In</Link>
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
