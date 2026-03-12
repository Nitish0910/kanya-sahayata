'use client';
import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setStatus({ type: data.success ? 'success' : 'error', message: data.message });
      if (data.success) setForm({ name: '', phone: '', email: '', subject: '', message: '' });
    } catch {
      setStatus({ type: 'error', message: 'Something went wrong.' });
    }
    setLoading(false);
  };

  const infos = [
    { icon: '📧', title: 'Email Address', value: 'kanyasahayata@gmail.com' },
    { icon: '📞', title: 'Phone Number', value: '9100200340' },
    { icon: '📍', title: 'Address', value: 'Moradabad, India' },
  ];

  return (
    <>
      <div className="page-banner">
        <h1>Contact Us</h1>
        <div className="divider"></div>
      </div>

      <section className="section-padding">
        <div className="container">
          <div style={{ borderRadius: '20px', overflow: 'hidden', marginBottom: '40px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <iframe
              src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDH_jnEo6CrtYaMgTDxIdptsPRN30X3RNs&q=Moradabad+UP"
              width="100%" height="350" style={{ border: 0 }} allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div className="grid-3" style={{ marginBottom: '60px' }}>
            {infos.map((info, i) => (
              <div key={i} className="glass-card" style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '36px', display: 'block', marginBottom: '12px' }}>{info.icon}</span>
                <h4 style={{ color: 'white', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{info.title}</h4>
                <p style={{ color: '#34d399', fontSize: '15px' }}>{info.value}</p>
              </div>
            ))}
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="section-heading">
              <h6>Contact Us</h6>
              <h2>Feel Free to Message Us</h2>
            </div>

            {status && <div className={`alert alert-${status.type}`}>{status.message}</div>}

            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Your Name</label>
                  <input className="form-input" placeholder="Enter your name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input className="form-input" placeholder="Enter phone number" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input className="form-input" type="email" placeholder="Enter email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <input className="form-input" placeholder="Subject" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Your Message</label>
                <textarea className="form-input" placeholder="Write your message here..." rows="5" required value={form.message} onChange={e => setForm({...form, message: e.target.value})}></textarea>
              </div>
              <button type="submit" className="btn btn-secondary" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
