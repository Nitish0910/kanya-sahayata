'use client';
import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit3, FiSave, FiLock, FiCalendar, FiActivity, FiAward } from 'react-icons/fi';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });
  const [msg, setMsg] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch('/api/auth/session').then(r => r.json()).then(d => {
      if (d.loggedIn) {
        setUser(d.user);
        setForm({ name: d.user.name || '', email: d.user.email || '', phone: d.user.phone || '', address: d.user.address || '' });
      }
      setLoading(false);
    });
    // Fetch user requests for activity timeline
    fetch('/api/my-requests').then(r => r.json()).then(d => {
      if (d.success) setRequests(d.data || []);
    }).catch(() => {});
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

  const statusIcon = { pending: '⏳', verified: '✅', assigned: '🤝', completed: '🎉', rejected: '❌' };
  const statusColor = { pending: '#facc15', verified: '#60a5fa', assigned: '#34d399', completed: '#a78bfa', rejected: '#f87171' };

  return (
    <>
      <div className="page-banner">
        <h1>My Profile</h1>
        <div className="divider"></div>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>Manage your account information</p>
      </div>

      <section className="section-padding">
        <div className="container" style={{ maxWidth: '900px' }}>
          {/* Profile Header Card */}
          <div className="glass-card" style={{ marginBottom: '30px', textAlign: 'center', paddingTop: '40px', paddingBottom: '40px' }}>
            <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: 700, color: 'white', margin: '0 auto 16px', boxShadow: '0 8px 30px rgba(16,185,129,0.3)' }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 700 }}>{user?.name || 'User'}</h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>{user?.email}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>{requests.length}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Requests</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#f97316' }}>{requests.filter(r => r.status === 'completed').length}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Completed</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#60a5fa' }}>
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '2025'}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Member Since</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }} className="profile-grid">
            {/* Left Column - Edit Profile */}
            <div>
              <div className="glass-card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiUser size={18} /> Personal Info
                  </h3>
                  <button onClick={() => setEditing(!editing)} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '13px' }}>
                    {editing ? <><FiSave size={14} /> Cancel</> : <><FiEdit3 size={14} /> Edit</>}
                  </button>
                </div>

                {msg && <div className={msg.includes('✅') ? 'alert alert-success' : 'alert alert-error'}>{msg}</div>}

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

                {editing && (
                  <button onClick={handleSave} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
                    <FiSave size={16} /> Save Changes
                  </button>
                )}
              </div>

              {/* Change Password */}
              <div className="glass-card">
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiLock size={18} /> Change Password
                </h3>
                {passMsg && <div className={passMsg.includes('✅') ? 'alert alert-success' : 'alert alert-error'}>{passMsg}</div>}
                <div className="form-group">
                  <label>Current Password</label>
                  <input className="form-input" type="password" value={passForm.current} onChange={e => setPassForm({ ...passForm, current: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input className="form-input" type="password" value={passForm.newPass} onChange={e => setPassForm({ ...passForm, newPass: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input className="form-input" type="password" value={passForm.confirm} onChange={e => setPassForm({ ...passForm, confirm: e.target.value })} />
                </div>
                <button onClick={handlePasswordChange} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <FiLock size={16} /> Update Password
                </button>
              </div>
            </div>

            {/* Right Column - Activity Timeline #9 */}
            <div>
              <div className="glass-card">
                <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiActivity size={18} /> Activity Timeline
                </h3>
                {requests.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                    <FiAward size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                    <p>No activity yet</p>
                    <p style={{ fontSize: '13px', marginTop: '4px' }}>Submit a help request to get started!</p>
                  </div>
                ) : (
                  <div style={{ position: 'relative', paddingLeft: '24px' }}>
                    {/* Timeline line */}
                    <div style={{ position: 'absolute', left: '8px', top: '8px', bottom: '8px', width: '2px', background: 'rgba(16,185,129,0.2)' }}></div>
                    
                    {requests.slice(0, 8).map((req, i) => (
                      <div key={i} style={{ position: 'relative', marginBottom: '20px', paddingLeft: '16px' }}>
                        {/* Timeline dot */}
                        <div style={{ position: 'absolute', left: '-20px', top: '4px', width: '14px', height: '14px', borderRadius: '50%', background: statusColor[req.status] || '#64748b', border: '3px solid #0f172a' }}></div>
                        
                        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '14px 16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0', textTransform: 'capitalize' }}>
                              {statusIcon[req.status] || '📋'} {req.service_type}
                            </span>
                            <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: `${statusColor[req.status]}15`, color: statusColor[req.status], fontWeight: 600, textTransform: 'capitalize' }}>
                              {req.status}
                            </span>
                          </div>
                          <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>
                            {req.description?.slice(0, 80)}{req.description?.length > 80 ? '...' : ''}
                          </p>
                          {req.assigned_ngo && <p style={{ fontSize: '11px', color: '#34d399', marginTop: '4px' }}>🏢 {req.assigned_ngo}</p>}
                          {req.createdAt && <p style={{ fontSize: '10px', color: '#475569', marginTop: '4px' }}>{new Date(req.createdAt).toLocaleDateString('en-IN')}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
