'use client';
import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit3, FiSave, FiLock } from 'react-icons/fi';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });
  const [msg, setMsg] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/session').then(r => r.json()).then(d => {
      if (d.loggedIn) {
        setUser(d.user);
        setForm({ name: d.user.name || '', email: d.user.email || '', phone: d.user.phone || '', address: d.user.address || '' });
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) return setMsg('Name and email are required');
    if (form.phone && !/^\d{10}$/.test(form.phone)) return setMsg('Phone must be 10 digits');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setMsg('Invalid email format');

    const res = await fetch('/api/auth/update-profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data.success) {
      setMsg('✅ Profile updated successfully!');
      setEditing(false);
      setUser(prev => ({ ...prev, ...form }));
    } else {
      setMsg('❌ ' + (data.message || 'Update failed'));
    }
    setTimeout(() => setMsg(''), 3000);
  };

  const handlePasswordChange = async () => {
    if (!passForm.current || !passForm.newPass) return setPassMsg('Fill all fields');
    if (passForm.newPass.length < 4) return setPassMsg('Password must be at least 4 characters');
    if (passForm.newPass !== passForm.confirm) return setPassMsg('Passwords do not match');

    const res = await fetch('/api/auth/change-password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: passForm.current, newPassword: passForm.newPass })
    });
    const data = await res.json();
    if (data.success) {
      setPassMsg('✅ Password changed successfully!');
      setPassForm({ current: '', newPass: '', confirm: '' });
    } else {
      setPassMsg('❌ ' + (data.message || 'Change failed'));
    }
    setTimeout(() => setPassMsg(''), 3000);
  };

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid rgba(16,185,129,0.2)', borderTop: '4px solid #10b981', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
        <p style={{ color: '#94a3b8' }}>Loading profile...</p>
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  return (
    <>
      <div className="page-banner">
        <h1>My Profile</h1>
        <div className="divider"></div>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>Manage your account information</p>
      </div>

      <section className="section-padding">
        <div className="container" style={{ maxWidth: '800px' }}>
          {/* Profile Card */}
          <div className="glass-card" style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 700, color: 'white' }}>
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 700 }}>{user?.name || 'User'}</h2>
                  <p style={{ color: '#94a3b8', fontSize: '14px' }}>{user?.email}</p>
                </div>
              </div>
              <button onClick={() => setEditing(!editing)} className="btn btn-outline" style={{ padding: '10px 20px', fontSize: '14px' }}>
                {editing ? <><FiSave size={16} /> Cancel</> : <><FiEdit3 size={16} /> Edit Profile</>}
              </button>
            </div>

            {msg && <div className={msg.includes('✅') ? 'alert alert-success' : 'alert alert-error'}>{msg}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label><FiUser size={14} style={{ marginRight: '6px' }} />Full Name</label>
                <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} disabled={!editing} />
              </div>
              <div className="form-group">
                <label><FiMail size={14} style={{ marginRight: '6px' }} />Email</label>
                <input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} disabled={!editing} />
              </div>
              <div className="form-group">
                <label><FiPhone size={14} style={{ marginRight: '6px' }} />Phone</label>
                <input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} disabled={!editing} placeholder="10-digit number" />
              </div>
              <div className="form-group">
                <label><FiMapPin size={14} style={{ marginRight: '6px' }} />Address</label>
                <input className="form-input" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} disabled={!editing} placeholder="Your city/area" />
              </div>
            </div>

            {editing && (
              <button onClick={handleSave} className="btn btn-primary" style={{ marginTop: '16px' }}>
                <FiSave size={16} /> Save Changes
              </button>
            )}
          </div>

          {/* Change Password */}
          <div className="glass-card">
            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiLock size={20} /> Change Password
            </h3>

            {passMsg && <div className={passMsg.includes('✅') ? 'alert alert-success' : 'alert alert-error'}>{passMsg}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label>Current Password</label>
                <input className="form-input" type="password" value={passForm.current} onChange={e => setPassForm({ ...passForm, current: e.target.value })} />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input className="form-input" type="password" value={passForm.newPass} onChange={e => setPassForm({ ...passForm, newPass: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input className="form-input" type="password" value={passForm.confirm} onChange={e => setPassForm({ ...passForm, confirm: e.target.value })} />
              </div>
            </div>

            <button onClick={handlePasswordChange} className="btn btn-primary">
              <FiLock size={16} /> Update Password
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
