'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiClock, FiCheckCircle, FiXCircle, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

export default function MyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch('/api/my-requests');
        const data = await res.json();
        if (data.success) setRequests(data.data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchRequests();
  }, []);

  const statusConfig = {
    pending: { icon: <FiClock />, label: 'Pending Review', color: '#facc15', bg: 'rgba(234,179,8,0.1)', desc: 'Your request is being reviewed by our team.' },
    verified: { icon: <FiCheckCircle />, label: 'Verified', color: '#60a5fa', bg: 'rgba(59,130,246,0.1)', desc: 'Your request has been verified. We are finding the right NGO for you.' },
    assigned: { icon: <FiCheckCircle />, label: 'NGO Assigned', color: '#34d399', bg: 'rgba(16,185,129,0.1)', desc: 'An NGO has been assigned to help you!' },
    completed: { icon: <FiCheckCircle />, label: 'Completed', color: '#a78bfa', bg: 'rgba(139,92,246,0.1)', desc: 'Your request has been fulfilled. Thank you!' },
    rejected: { icon: <FiXCircle />, label: 'Rejected', color: '#f87171', bg: 'rgba(239,68,68,0.1)', desc: 'Unfortunately, your request could not be processed.' },
  };

  const getProgress = (status) => {
    const steps = ['pending', 'verified', 'assigned', 'completed'];
    if (status === 'rejected') return 0;
    return ((steps.indexOf(status) + 1) / steps.length) * 100;
  };

  return (
    <>
      <div className="page-banner">
        <h1>My Requests</h1>
        <div className="divider"></div>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>Track the status of your help requests</p>
      </div>

      <section className="section-padding">
        <div className="container" style={{ maxWidth: '800px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading your requests...</div>
          ) : requests.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
              <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>No Requests Yet</h3>
              <p style={{ color: '#94a3b8', marginBottom: '24px' }}>You haven&apos;t submitted any help requests yet.</p>
              <Link href="/help-request" className="btn btn-primary">Submit a Request →</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '24px' }}>
              {requests.map((r, i) => {
                const sc = statusConfig[r.status] || statusConfig.pending;
                return (
                  <div key={i} className="glass-card" style={{ padding: '32px', animation: `fadeInUp 0.5s ease-out ${i * 0.08}s both` }}>
                    {/* Header Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <span style={{ color: '#64748b', fontSize: '12px', fontFamily: 'monospace' }}>{r.id}</span>
                        <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 700, marginTop: '4px' }}>{r.service_type} Request</h3>
                      </div>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 16px', borderRadius: '50px', background: sc.bg, color: sc.color, fontSize: '13px', fontWeight: 600 }}>
                        {sc.icon} {sc.label}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    {r.status !== 'rejected' && (
                      <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          {['Submitted', 'Verified', 'NGO Assigned', 'Completed'].map((step, idx) => (
                            <span key={step} style={{ fontSize: '11px', color: getProgress(r.status) >= ((idx + 1) / 4) * 100 ? '#34d399' : '#475569', fontWeight: 600 }}>{step}</span>
                          ))}
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${getProgress(r.status)}%`, background: 'linear-gradient(90deg, #10b981, #059669)', borderRadius: '3px', transition: 'width 0.5s ease' }}></div>
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px' }}>{r.description}</p>
                    <p style={{ color: '#64748b', fontSize: '13px', fontStyle: 'italic' }}>{sc.desc}</p>

                    {/* Admin Remarks */}
                    {r.admin_remarks && (
                      <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(59,130,246,0.05)', borderLeft: '3px solid #60a5fa', borderRadius: '0 8px 8px 0' }}>
                        <span style={{ color: '#60a5fa', fontSize: '12px', fontWeight: 600 }}>Admin Remarks:</span>
                        <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>{r.admin_remarks}</p>
                      </div>
                    )}

                    {/* Assigned NGO Details */}
                    {r.assigned_ngo && r.ngo_details && (
                      <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.1)', borderRadius: '12px' }}>
                        <h4 style={{ color: '#34d399', fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>🤝 Assigned NGO</h4>
                        <h4 style={{ color: 'white', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{r.ngo_details.name}</h4>
                        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '12px' }}>{r.ngo_details.description}</p>
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', color: '#94a3b8', fontSize: '13px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiMapPin size={14} color="#34d399" /> {r.ngo_details.address}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiPhone size={14} color="#34d399" /> {r.ngo_details.phone}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiMail size={14} color="#34d399" /> {r.ngo_details.email}</span>
                        </div>
                      </div>
                    )}

                    {r.assigned_ngo && !r.ngo_details && (
                      <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(16,185,129,0.05)', borderRadius: '8px' }}>
                        <span style={{ color: '#34d399', fontSize: '14px', fontWeight: 600 }}>🤝 Assigned to: {r.assigned_ngo}</span>
                      </div>
                    )}

                    {/* Submitted date */}
                    {r.submitted_at && (
                      <p style={{ color: '#475569', fontSize: '12px', marginTop: '16px' }}>
                        Submitted: {new Date(r.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
