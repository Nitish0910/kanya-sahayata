'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function NGORegisterPage() {
  const [form, setForm] = useState({
    name: '', description: '', services: [], phone: '', email: '', website: '',
    address: '', city: '', state: '', lat: '', lng: ''
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const toggleService = (service) => {
    setForm(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm(prev => ({ ...prev, lat: pos.coords.latitude.toFixed(4), lng: pos.coords.longitude.toFixed(4) }));
        },
        () => alert('Unable to detect location. Please enter manually.')
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.services.length === 0) {
      setStatus({ type: 'error', message: 'Please select at least one service type.' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/ngos/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setStatus({ type: data.success ? 'success' : 'error', message: data.message });
      if (data.success) setForm({ name: '', description: '', services: [], phone: '', email: '', website: '', address: '', city: '', state: '', lat: '', lng: '' });
    } catch {
      setStatus({ type: 'error', message: 'Something went wrong.' });
    }
    setLoading(false);
  };

  const services = [
    { key: 'education', icon: '📚', label: 'Education' },
    { key: 'medical', icon: '🏥', label: 'Medical' },
    { key: 'domestic', icon: '🏠', label: 'Domestic' },
  ];

  return (
    <>
      <div className="page-banner">
        <h1>Register Your NGO</h1>
        <div className="divider"></div>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>Partner with us to help rural girls</p>
      </div>

      <section className="section-padding">
        <div className="container" style={{ maxWidth: '700px' }}>

          {status && <div className={`alert alert-${status.type}`}>{status.message}</div>}

          <div className="glass-card">
            <form onSubmit={handleSubmit}>
              <h4 style={{ color: '#34d399', fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Organization Details</h4>
              <div className="form-group">
                <label>NGO Name</label>
                <input className="form-input" required placeholder="Enter your organization name" value={form.name} onChange={e => update('name', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-input" rows="4" required placeholder="Describe your NGO's mission and activities..." value={form.description} onChange={e => update('description', e.target.value)}></textarea>
              </div>

              <div className="form-group">
                <label>Services You Provide</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {services.map(s => (
                    <button key={s.key} type="button" onClick={() => toggleService(s.key)} style={{
                      padding: '12px 24px', borderRadius: '12px', cursor: 'pointer',
                      fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: 600,
                      background: form.services.includes(s.key) ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.06)',
                      color: form.services.includes(s.key) ? 'white' : '#94a3b8',
                      border: form.services.includes(s.key) ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      transition: 'all 0.3s'
                    }}>
                      {s.icon} {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <h4 style={{ color: '#34d399', fontSize: '16px', fontWeight: 600, margin: '24px 0 20px' }}>Contact Information</h4>
              <div className="grid-2">
                <div className="form-group">
                  <label>Phone</label>
                  <input className="form-input" type="tel" required placeholder="Contact number" value={form.phone} onChange={e => update('phone', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input className="form-input" type="email" required placeholder="Organization email" value={form.email} onChange={e => update('email', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Website (optional)</label>
                <input className="form-input" placeholder="https://www.your-ngo.org" value={form.website} onChange={e => update('website', e.target.value)} />
              </div>

              <h4 style={{ color: '#34d399', fontSize: '16px', fontWeight: 600, margin: '24px 0 20px' }}>Location</h4>
              <div className="form-group">
                <label>Address</label>
                <input className="form-input" required placeholder="Full address" value={form.address} onChange={e => update('address', e.target.value)} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>City</label>
                  <input className="form-input" required placeholder="City" value={form.city} onChange={e => update('city', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input className="form-input" required placeholder="State" value={form.state} onChange={e => update('state', e.target.value)} />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Latitude</label>
                  <input className="form-input" type="number" step="any" placeholder="e.g. 28.6139" value={form.lat} onChange={e => update('lat', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Longitude</label>
                  <input className="form-input" type="number" step="any" placeholder="e.g. 77.2090" value={form.lng} onChange={e => update('lng', e.target.value)} />
                </div>
              </div>
              <button type="button" onClick={detectLocation} className="btn btn-outline" style={{ marginBottom: '24px', fontSize: '13px' }}>
                📍 Auto-detect Location
              </button>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>

          <p style={{ textAlign: 'center', marginTop: '24px', color: '#94a3b8', fontSize: '14px' }}>
            <Link href="/ngos" style={{ color: '#34d399', textDecoration: 'none', fontWeight: 600 }}>← Back to NGO Partners</Link>
          </p>
        </div>
      </section>
    </>
  );
}
