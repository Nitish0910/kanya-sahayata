'use client';
import { useState } from 'react';

export default function DonatePage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', donation_type: '', donation_description: '', donation_quantity: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [thankYou, setThankYou] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setThankYou(data.data);
        setStatus({ type: 'success', message: data.message });
        setForm({ name: '', email: '', phone: '', donation_type: '', donation_description: '', donation_quantity: '' });
      } else {
        setStatus({ type: 'error', message: data.message });
      }
    } catch {
      setStatus({ type: 'error', message: 'Something went wrong.' });
    }
    setLoading(false);
  };

  if (thankYou) {
    const receiptNo = `KS-${Date.now().toString(36).toUpperCase()}`;
    const receiptDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    return (
      <>
        <div className="page-banner">
          <h1>Thank You!</h1>
          <div className="divider"></div>
        </div>
        <section className="section-padding">
          <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
            <div className="glass-card receipt-card" id="receipt">
              <span style={{ fontSize: '64px', display: 'block', marginBottom: '20px' }}>🎉</span>
              <h2 style={{ color: 'white', marginBottom: '8px' }}>Thank you, {thankYou.name}!</h2>
              <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '24px' }}>Receipt No: <strong style={{ color: '#34d399' }}>{receiptNo}</strong> | Date: {receiptDate}</p>
              
              <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '12px', padding: '20px', textAlign: 'left', marginBottom: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                  <div><span style={{ color: '#64748b' }}>Donor:</span><br/><strong style={{ color: '#cbd5e1' }}>{thankYou.name}</strong></div>
                  <div><span style={{ color: '#64748b' }}>Email:</span><br/><strong style={{ color: '#cbd5e1' }}>{thankYou.email}</strong></div>
                  <div><span style={{ color: '#64748b' }}>Type:</span><br/><strong style={{ color: '#34d399', textTransform: 'capitalize' }}>{thankYou.donation_type}</strong></div>
                  <div><span style={{ color: '#64748b' }}>Quantity:</span><br/><strong style={{ color: '#34d399' }}>{thankYou.donation_quantity}</strong></div>
                </div>
                <div style={{ marginTop: '12px' }}><span style={{ color: '#64748b', fontSize: '14px' }}>Description:</span><br/><em style={{ color: '#cbd5e1', fontSize: '14px' }}>{thankYou.donation_description}</em></div>
              </div>

              <p style={{ color: '#94a3b8', marginBottom: '20px' }}>We will contact you soon to arrange pickup or delivery.</p>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => window.print()} className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '14px' }}>
                  🖨️ Print Receipt
                </button>
                <button onClick={() => { setThankYou(null); setStatus(null); }} className="btn btn-outline" style={{ padding: '10px 24px', fontSize: '14px' }}>
                  Donate Again
                </button>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <div className="page-banner">
        <h1>Donate</h1>
        <div className="divider"></div>
      </div>

      <section className="section-padding">
        <div className="container" style={{ maxWidth: '700px' }}>
          <div className="section-heading">
            <h6>Help Others</h6>
            <h2>Donate Old Books & Medicines</h2>
          </div>

          {status && <div className={`alert alert-${status.type}`}>{status.message}</div>}

          <div className="glass-card">
            <form onSubmit={handleSubmit}>
              <h4 style={{ color: '#34d399', fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Personal Information</h4>
              <div className="grid-2">
                <div className="form-group">
                  <label>Name</label>
                  <input className="form-input" required placeholder="Your name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input className="form-input" type="email" required placeholder="Your email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input className="form-input" required placeholder="Your phone number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>

              <h4 style={{ color: '#34d399', fontSize: '16px', fontWeight: 600, margin: '24px 0 20px' }}>Donation Information</h4>
              <div className="form-group">
                <label>Type of Donation</label>
                <select className="form-input" required value={form.donation_type} onChange={e => setForm({...form, donation_type: e.target.value})}>
                  <option value="">Select Type</option>
                  <option value="books">Books</option>
                  <option value="medicines">Medicines</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-input" rows="4" required placeholder="Describe your donation" value={form.donation_description} onChange={e => setForm({...form, donation_description: e.target.value})}></textarea>
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input className="form-input" type="number" min="1" required placeholder="How many items?" value={form.donation_quantity} onChange={e => setForm({...form, donation_quantity: e.target.value})} />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Donation'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
