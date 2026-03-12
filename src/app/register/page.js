'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const states = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Jharkhand','Himachal Pradesh','Madhya Pradesh','Rajasthan','Uttar Pradesh','Uttarakhand'];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', date: '', email: '', gender: '', mobile_number: '', age: '',
    id_name: '', id_number: '', id_issued_state: '', income: '', pwd_candidate: '',
    address: '', nationality: '', state: '', district: '', house_number: '', pincode: '',
    father_name: '', mother_name: '', password: '', confirm_pass: ''
  });
  
  // OTP Verification States
  const [verified, setVerified] = useState({ email: false, mobile: false, id: false });
  const [otpModal, setOtpModal] = useState({ show: false, type: '', value: '', otp: '' });
  
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Reset verification if user changes a previously verified field
    if (field === 'email') setVerified(p => ({ ...p, email: false }));
    if (field === 'mobile_number') setVerified(p => ({ ...p, mobile: false }));
    if ((field === 'id_number' || field === 'id_name') && form.id_name && form.id_number) setVerified(p => ({ ...p, id: false }));
  };

  const handleIdNumberChange = (e) => {
    let val = e.target.value;
    if (form.id_name === 'Aadhar Card') val = val.replace(/[^0-9]/g, '').slice(0, 12);
    else if (form.id_name === 'PAN Number') val = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    update('id_number', val);
  };

  const sendOtp = async (type, value) => {
    if (!value) return setStatus({ type: 'error', message: 'Please enter the value first!' });
    if (type === 'email' && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) return setStatus({ type: 'error', message: 'Invalid email format' });
    if (type === 'mobile' && value.length < 10) return setStatus({ type: 'error', message: 'Enter a valid mobile number' });
    
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, value })
      });
      const data = await res.json();
      
      if (data.success) {
        setOtpModal({ show: true, type, value, otp: '', simulatedOtp: data.dev_otp });
      } else {
        setStatus({ type: 'error', message: data.message });
      }
    } catch { 
      setStatus({ type: 'error', message: 'Failed to send OTP' }); 
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: otpModal.type, value: otpModal.value, otp: otpModal.otp })
      });
      const data = await res.json();
      if (data.success) {
        if (otpModal.type === 'email') setVerified(p => ({ ...p, email: true }));
        else if (otpModal.type === 'mobile') setVerified(p => ({ ...p, mobile: true }));
        else setVerified(p => ({ ...p, id: true }));
        setOtpModal({ show: false, type: '', value: '', otp: '', simulatedOtp: '' });
        alert('Verified Successfully!');
      } else {
        alert(data.message);
      }
    } catch { alert('Verification failed'); }
    setLoading(false);
  };

  const handleNextStep1 = () => {
    if (!verified.email || !verified.mobile) {
      setStatus({ type: 'error', message: 'You must verify both Email and Mobile Number to proceed.' });
      return;
    }
    if ((form.id_name === 'Aadhar Card' || form.id_name === 'PAN Number') && !verified.id) {
      setStatus({ type: 'error', message: `You must verify your ${form.id_name} to proceed.` });
      return;
    }
    if (form.id_name === 'Aadhar Card' && form.id_number.length !== 12) {
      setStatus({ type: 'error', message: 'Aadhar Card number must be exactly 12 digits' });
      return;
    }
    if (form.id_name === 'PAN Number' && form.id_number.length !== 10) {
      setStatus({ type: 'error', message: 'PAN Number must be exactly 10 alphanumeric characters' });
      return;
    }
    setStatus(null);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm_pass) {
      setStatus({ type: 'error', message: 'Passwords do not match' });
      return;
    }
    if (form.password.length < 6) {
      setStatus({ type: 'error', message: 'Password should be minimum 6 characters' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: 'Registration successful! Redirecting...' });
        setTimeout(() => { window.location.href = '/services'; }, 800);
      } else {
        setStatus({ type: 'error', message: data.message });
      }
    } catch {
      setStatus({ type: 'error', message: 'Something went wrong.' });
    }
    setLoading(false);
  };

  const inputStyle = { marginBottom: '16px' };
  const verifyBtnStyle = { whiteSpace: 'nowrap', padding: '0 16px', borderRadius: '8px', background: 'rgba(52, 211, 153, 0.1)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.2)', cursor: 'pointer', fontWeight: 600 };
  const verifyBadgeStyle = { whiteSpace: 'nowrap', padding: '0 16px', display: 'flex', alignItems: 'center', color: '#10b981', fontWeight: 600, fontSize: '14px' };

  return (
    <div style={{ minHeight: '100vh', padding: '120px 24px 60px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Registration</h1>
          <p style={{ color: '#94a3b8' }}>Step {step} of 3</p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '16px' }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{ width: '80px', height: '4px', borderRadius: '2px', background: s <= step ? 'linear-gradient(135deg, #10b981, #34d399)' : 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }}></div>
            ))}
          </div>
        </div>

        {status && <div className={`alert alert-${status.type}`}>{status.message}</div>}

        <div className="glass-card">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <h4 style={{ color: '#34d399', fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Personal Details</h4>
                <div className="grid-2">
                  <div style={inputStyle}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '6px' }}>Full Name</label>
                    <input className="form-input" required placeholder="Enter your name" value={form.name} onChange={e => update('name', e.target.value)} />
                  </div>
                  <div style={inputStyle}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '6px' }}>Date of Birth</label>
                    <input className="form-input" type="date" required value={form.date} onChange={e => update('date', e.target.value)} />
                  </div>
                  <div style={inputStyle}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '6px' }}>Email</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input className="form-input" type="email" required placeholder="Enter your email" value={form.email} onChange={e => update('email', e.target.value)} disabled={verified.email} />
                      {verified.email ? <span style={verifyBadgeStyle}>✅ Verified</span> : <button type="button" onClick={() => sendOtp('email', form.email)} style={verifyBtnStyle} disabled={loading}>Verify</button>}
                    </div>
                  </div>
                  <div style={inputStyle}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '6px' }}>Gender</label>
                    <select className="form-input" required value={form.gender} onChange={e => update('gender', e.target.value)}>
                      <option value="">Select gender</option>
                      <option>Female</option>
                    </select>
                  </div>
                  <div style={inputStyle}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '6px' }}>Mobile Number</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input className="form-input" type="number" required placeholder="Enter mobile number" value={form.mobile_number} onChange={e => update('mobile_number', e.target.value)} disabled={verified.mobile} />
                      {verified.mobile ? <span style={verifyBadgeStyle}>✅ Verified</span> : <button type="button" onClick={() => sendOtp('mobile', form.mobile_number)} style={verifyBtnStyle} disabled={loading}>Verify</button>}
                    </div>
                  </div>
                  <div style={inputStyle}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '6px' }}>Age Group</label>
                    <select className="form-input" required value={form.age} onChange={e => update('age', e.target.value)}>
                      <option value="">Select age group</option>
                      <option value="8-12">8-12</option>
                      <option value="12-16">12-16</option>
                      <option value="16-20">16-20</option>
                    </select>
                  </div>
                </div>

                <h4 style={{ color: '#34d399', fontSize: '16px', fontWeight: 600, margin: '24px 0 20px' }}>Identity & Income Details</h4>
                <div className="grid-2">
                  <div style={inputStyle}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '6px' }}>ID Type</label>
                    <select className="form-input" required value={form.id_name} onChange={e => { update('id_name', e.target.value); update('id_number', ''); }}>
                      <option value="">Select ID type</option>
                      <option>Aadhar Card</option>
                      <option>Birth Certificate no.</option>
                      <option>PAN Number</option>
                    </select>
                  </div>
                  <div style={inputStyle}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '6px' }}>ID Number</label>
                    {['Aadhar Card', 'PAN Number'].includes(form.id_name) ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input className="form-input" type="text" required placeholder="Enter ID number" value={form.id_number} onChange={handleIdNumberChange} disabled={verified.id} />
                        {verified.id ? <span style={verifyBadgeStyle}>✅ Verified</span> : <button type="button" onClick={() => sendOtp(form.id_name, form.id_number)} style={verifyBtnStyle} disabled={loading}>Verify</button>}
                      </div>
                    ) : (
                      <input className="form-input" type="text" required placeholder="Enter ID number" value={form.id_number} onChange={handleIdNumberChange} />
                    )}
                  </div>
                  <div style={inputStyle}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '6px' }}>ID Issued State</label>
                    <select className="form-input" required value={form.id_issued_state} onChange={e => update('id_issued_state', e.target.value)}>
                      <option value="">Select state</option>
                      {states.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div style={inputStyle}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '6px' }}>Family Income</label>
                    <select className="form-input" required value={form.income} onChange={e => update('income', e.target.value)}>
                      <option value="">Select income</option>
                      <option>Upto 50000</option>
                      <option>50000-100000</option>
                      <option>More than 100000</option>
                    </select>
                  </div>
                  <div style={inputStyle}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '6px' }}>PwD Candidate?</label>
                    <select className="form-input" required value={form.pwd_candidate} onChange={e => update('pwd_candidate', e.target.value)}>
                      <option value="">Select</option>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                </div>
                <button type="button" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleNextStep1}>Next →</button>
              </>
            )}

            {step === 2 && (
              <>
                <h4 style={{ color: '#34d399', fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Address Details</h4>
                <div className="grid-2">
                  <div style={inputStyle}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '6px' }}>Address Type</label>
                    <input className="form-input" required placeholder="Permanent or Temporary" value={form.address} onChange={e => update('address', e.target.value)} />
                  </div>
                  <div style={inputStyle}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '6px' }}>Nationality</label>
                    <input className="form-input" required placeholder="Enter nationality" value={form.nationality} onChange={e => update('nationality', e.target.value)} />
                  </div>
                  <div style={inputStyle}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '6px' }}>State</label>
                    <select className="form-input" required value={form.state} onChange={e => update('state', e.target.value)}>
                      <option value="">Select state</option>
                      {states.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div style={inputStyle}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '6px' }}>District</label>
                    <input className="form-input" required placeholder="Enter district" value={form.district} onChange={e => update('district', e.target.value)} />
                  </div>
                  <div style={inputStyle}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '6px' }}>Block/House Number</label>
                    <input className="form-input" type="number" required placeholder="Enter block/house number" value={form.house_number} onChange={e => update('house_number', e.target.value)} />
                  </div>
                  <div style={inputStyle}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '6px' }}>Pincode</label>
                    <input className="form-input" type="number" required placeholder="Enter pincode" value={form.pincode} onChange={e => update('pincode', e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep(1)}>← Back</button>
                  <button type="button" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep(3)}>Next →</button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h4 style={{ color: '#34d399', fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Other Details</h4>
                <div className="grid-2">
                  <div style={inputStyle}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '6px' }}>Father Name</label>
                    <input className="form-input" required placeholder="Enter father name" value={form.father_name} onChange={e => update('father_name', e.target.value)} />
                  </div>
                  <div style={inputStyle}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '6px' }}>Mother Name</label>
                    <input className="form-input" required placeholder="Enter mother name" value={form.mother_name} onChange={e => update('mother_name', e.target.value)} />
                  </div>
                  <div style={inputStyle}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '6px' }}>Password</label>
                    <input className="form-input" type="password" required placeholder="Minimum 6 characters" value={form.password} onChange={e => update('password', e.target.value)} />
                  </div>
                  <div style={inputStyle}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '6px' }}>Confirm Password</label>
                    <input className="form-input" type="password" required placeholder="Re-enter password" value={form.confirm_pass} onChange={e => update('confirm_pass', e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep(2)}>← Back</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={loading}>
                    {loading ? 'Registering...' : 'Submit'}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#94a3b8', fontSize: '14px' }}>
          Already have an account? <Link href="/login" style={{ color: '#34d399', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>

      {/* OTP Verification Modal */}
      {otpModal.show && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div className="glass-card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
            <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Verification Required</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px' }}>Enter the 6-digit OTP sent to <strong style={{ color: '#34d399' }}>{otpModal.value}</strong></p>
            
            {otpModal.simulatedOtp && (
              <div style={{ background: 'rgba(52, 211, 153, 0.1)', border: '1px dashed #34d399', padding: '12px', borderRadius: '8px', marginBottom: '24px' }}>
                <span style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>SIMULATED OTP FOR TESTING:</span>
                <strong style={{ color: '#34d399', fontSize: '24px', letterSpacing: '4px' }}>{otpModal.simulatedOtp}</strong>
              </div>
            )}
            
            <input 
              className="form-input" 
              type="text" 
              placeholder="000000" 
              maxLength={6}
              style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px', fontWeight: 700, marginBottom: '24px' }}
              value={otpModal.otp}
              onChange={e => setOtpModal(p => ({ ...p, otp: e.target.value.replace(/\D/g, '') }))}
            />
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" className="btn" style={{ flex: 1, background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }} onClick={() => setOtpModal({ show: false, type: '', value: '', otp: '' })}>Cancel</button>
              <button type="button" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={verifyOtp} disabled={loading || otpModal.otp.length !== 6}>
                {loading ? 'Verifying...' : 'Verify Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
