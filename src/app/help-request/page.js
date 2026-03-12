'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiNavigation } from 'react-icons/fi';

export default function HelpRequestPage() {
  const [form, setForm] = useState({ name: '', age: '', phone: '', email: '', address: '', aadhar: '', category: 'education', description: '', lat: '', lng: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locStatus, setLocStatus] = useState('detecting');
  const router = useRouter();

  // Auto-detect user location on page load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm(p => ({ ...p, lat: pos.coords.latitude, lng: pos.coords.longitude }));
          setLocStatus('found');
        },
        () => setLocStatus('denied'),
        { timeout: 10000 }
      );
    } else {
      setLocStatus('unsupported');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/help-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: data.message });
        setTimeout(() => router.push('/my-requests'), 2000);
      } else {
        setStatus({ type: 'error', message: data.message });
      }
    } catch {
      setStatus({ type: 'error', message: 'Something went wrong.' });
    }
    setLoading(false);
  };

  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));

  return (
    <>
      <div className="page-banner">
        <h1>Help Request Form</h1>
        <div className="divider"></div>
      </div>

      <section className="section-padding">
        <div className="container" style={{ maxWidth: '700px' }}>

          {/* Location status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', marginBottom: '24px', background: locStatus === 'found' ? 'rgba(16,185,129,0.08)' : 'rgba(249,115,22,0.08)', border: `1px solid ${locStatus === 'found' ? 'rgba(16,185,129,0.2)' : 'rgba(249,115,22,0.2)'}`, borderRadius: '10px', fontSize: '13px' }}>
            <FiNavigation size={14} color={locStatus === 'found' ? '#34d399' : '#fb923c'} />
            <span style={{ color: locStatus === 'found' ? '#34d399' : '#fb923c' }}>
              {locStatus === 'detecting' ? '📍 Detecting your location to find nearby NGOs...' :
               locStatus === 'found' ? '📍 Location captured — we\'ll assign the closest NGO to you!' :
               '📍 Location not detected — admin will manually assign an NGO'}
            </span>
          </div>

          {status && <div className={`alert alert-${status.type}`}>{status.message}</div>}

          <div className="glass-card">
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Name</label>
                  <input className="form-input" required placeholder="Your name" value={form.name} onChange={e => update('name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input className="form-input" type="number" required placeholder="Your age" value={form.age} onChange={e => update('age', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input className="form-input" type="tel" required placeholder="Phone number" value={form.phone} onChange={e => update('phone', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input className="form-input" type="email" required placeholder="Email address" value={form.email} onChange={e => update('email', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <input className="form-input" required placeholder="Your address" value={form.address} onChange={e => update('address', e.target.value)} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Aadhar Number</label>
                  <input className="form-input" required placeholder="Aadhar number" value={form.aadhar} onChange={e => update('aadhar', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Service Type</label>
                  <select className="form-input" value={form.category} onChange={e => update('category', e.target.value)}>
                    <option value="education">Education</option>
                    <option value="medical">Medical</option>
                    <option value="domestic">Domestic</option>
                    <option value="career">Career Guidance</option>
                    <option value="legal-aid">Legal Aid</option>
                    <option value="mental-health">Mental Health</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-input" rows="4" required placeholder="Describe what help you need..." value={form.description} onChange={e => update('description', e.target.value)}></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
