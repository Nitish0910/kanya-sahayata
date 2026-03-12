'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

const ITEMS_PER_PAGE = 8;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('queries');
  const [queries, setQueries] = useState([]);
  const [helpRequests, setHelpRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [ngoApps, setNgoApps] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyModal, setReplyModal] = useState(null);
  const [replyForm, setReplyForm] = useState({ email: '', message: '' });
  const [assignModal, setAssignModal] = useState(null);
  const [selectedNgo, setSelectedNgo] = useState('');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const fetchAll = async () => {
    try {
      const [q, h, d, n, ngoList] = await Promise.all([
        fetch('/api/admin/queries').then(r => r.json()),
        fetch('/api/admin/help-requests').then(r => r.json()),
        fetch('/api/admin/donations').then(r => r.json()),
        fetch('/api/ngos/register').then(r => r.json()),
        fetch('/api/ngos').then(r => r.json()),
      ]);
      if (q.success) setQueries(q.data);
      if (h.success) setHelpRequests(h.data);
      if (d.success) setDonations(d.data);
      if (n.success) setNgoApps(n.data);
      if (ngoList.success) setNgos(ngoList.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  // Reset page when tab changes
  useEffect(() => { setCurrentPage(1); }, [activeTab]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const updateRequest = async (id, action, ngoName = null, remarks = '') => {
    try {
      const res = await fetch('/api/admin/help-requests/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action, assigned_ngo: ngoName, admin_remarks: remarks }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAll();
        setAssignModal(null);
        setSelectedNgo('');
        setAdminRemarks('');
      } else {
        alert(data.message);
      }
    } catch { alert('Error updating request'); }
  };

  const updateNgoStatus = async (ngoId, newStatus) => {
    try {
      const res = await fetch('/api/admin/ngo-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ngoId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) fetchAll();
      else alert(data.message);
    } catch { alert('Error updating NGO status'); }
  };

  const openReply = (email) => { setReplyForm({ email, message: '' }); setReplyModal(true); };

  // Analytics data
  const analytics = useMemo(() => ({
    totalUsers: 0, // Would need a separate API
    totalHelpRequests: helpRequests.length,
    totalDonations: donations.length,
    totalQueries: queries.length,
    totalNgos: ngos.length,
    ngoApps: ngoApps.length,
    pendingRequests: helpRequests.filter(r => r.status === 'pending').length,
    verifiedRequests: helpRequests.filter(r => r.status === 'verified').length,
    assignedRequests: helpRequests.filter(r => r.status === 'assigned').length,
    completedRequests: helpRequests.filter(r => r.status === 'completed').length,
    rejectedRequests: helpRequests.filter(r => r.status === 'rejected').length,
  }), [helpRequests, donations, queries, ngos, ngoApps]);

  // Pagination helper
  const paginate = (items) => {
    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedItems = items.slice(start, start + ITEMS_PER_PAGE);
    return { items: paginatedItems, totalPages, total: items.length };
  };

  const statusBadge = (status) => {
    const colors = {
      pending: { bg: 'rgba(234,179,8,0.1)', color: '#facc15' },
      verified: { bg: 'rgba(59,130,246,0.1)', color: '#60a5fa' },
      assigned: { bg: 'rgba(16,185,129,0.1)', color: '#34d399' },
      completed: { bg: 'rgba(139,92,246,0.1)', color: '#a78bfa' },
      rejected: { bg: 'rgba(239,68,68,0.1)', color: '#f87171' },
      approved: { bg: 'rgba(16,185,129,0.1)', color: '#34d399' },
    };
    const c = colors[status] || colors.pending;
    return { padding: '4px 12px', borderRadius: '6px', background: c.bg, color: c.color, fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' };
  };

  const tabStyle = (tab) => ({
    padding: '10px 24px', border: 'none', borderRadius: '10px', cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: 600, transition: 'all 0.3s',
    background: activeTab === tab ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.06)',
    color: activeTab === tab ? 'white' : '#94a3b8',
    boxShadow: activeTab === tab ? '0 4px 20px rgba(16,185,129,0.3)' : 'none',
  });

  const thStyle = { textAlign: 'left', padding: '14px 16px', color: '#34d399', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.08)' };
  const tdStyle = { padding: '12px 16px', color: '#cbd5e1', fontSize: '14px', borderBottom: '1px solid rgba(255,255,255,0.04)' };
  const actionBtnStyle = (bg, clr) => ({ padding: '5px 12px', border: 'none', borderRadius: '6px', background: bg, color: clr, cursor: 'pointer', fontFamily: 'Poppins', fontSize: '12px', fontWeight: 600, transition: 'all 0.2s' });

  // Pagination component
  const PaginationBar = ({ totalPages, total }) => {
    if (totalPages <= 1) return null;
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ color: '#64748b', fontSize: '13px' }}>
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, total)} of {total}
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{ ...actionBtnStyle('rgba(255,255,255,0.06)', '#94a3b8'), opacity: currentPage === 1 ? 0.4 : 1 }}
          >← Prev</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i + 1} onClick={() => setCurrentPage(i + 1)}
              style={{ ...actionBtnStyle(currentPage === i + 1 ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)', currentPage === i + 1 ? '#34d399' : '#94a3b8'), minWidth: '36px' }}>
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{ ...actionBtnStyle('rgba(255,255,255,0.06)', '#94a3b8'), opacity: currentPage === totalPages ? 0.4 : 1 }}
          >Next →</button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="page-banner">
        <h1>Admin Dashboard</h1>
        <div className="divider"></div>
      </div>

      <section className="section-padding">
        <div className="container">

          {/* ====== ANALYTICS CARDS ====== */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '30px' }}>
            {[
              { label: 'Help Requests', count: analytics.totalHelpRequests, icon: '📋', color: '#60a5fa' },
              { label: 'Pending', count: analytics.pendingRequests, icon: '⏳', color: '#facc15' },
              { label: 'Assigned', count: analytics.assignedRequests, icon: '✅', color: '#34d399' },
              { label: 'Completed', count: analytics.completedRequests, icon: '🎉', color: '#a78bfa' },
              { label: 'NGO Partners', count: analytics.totalNgos, icon: '🏢', color: '#fb923c' },
              { label: 'Donations', count: analytics.totalDonations, icon: '💝', color: '#f87171' },
              { label: 'Queries', count: analytics.totalQueries, icon: '💬', color: '#38bdf8' },
              { label: 'NGO Apps', count: analytics.ngoApps, icon: '📝', color: '#2dd4bf' },
            ].map(s => (
              <div key={s.label} className="glass-card" style={{ padding: '20px', textAlign: 'center', cursor: 'default' }}>
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>{s.icon}</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: s.color }}>{s.count}</div>
                <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={() => setActiveTab('queries')} style={tabStyle('queries')}>Queries ({queries.length})</button>
              <button onClick={() => setActiveTab('help')} style={tabStyle('help')}>Help Requests ({helpRequests.length})</button>
              <button onClick={() => setActiveTab('donations')} style={tabStyle('donations')}>Donations ({donations.length})</button>
              <button onClick={() => setActiveTab('ngos')} style={tabStyle('ngos')}>NGO Apps ({ngoApps.length})</button>
            </div>
            <button onClick={handleLogout} style={{ padding: '10px 24px', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', color: '#f87171', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: 500 }}>
              Logout
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading data...</div>
          ) : (
            <div className="glass-card" style={{ padding: '0', overflow: 'auto' }}>

              {/* ====== QUERIES TAB ====== */}
              {activeTab === 'queries' && (() => {
                const { items, totalPages, total } = paginate(queries);
                return (
                  <>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                      <thead><tr>
                        <th style={thStyle}>Name</th><th style={thStyle}>Phone</th><th style={thStyle}>Email</th>
                        <th style={thStyle}>Field</th><th style={thStyle}>Message</th><th style={thStyle}>Action</th>
                      </tr></thead>
                      <tbody>
                        {items.length === 0 ? (
                          <tr><td colSpan="6" style={{ ...tdStyle, textAlign: 'center', color: '#64748b' }}>No queries found</td></tr>
                        ) : items.map((q, i) => (
                          <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                            <td style={tdStyle}>{q.name}</td><td style={tdStyle}>{q.phone_no}</td>
                            <td style={tdStyle}>{q.email_id}</td><td style={tdStyle}>{q.field}</td>
                            <td style={tdStyle}>{q.message}</td>
                            <td style={tdStyle}><button className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '13px' }} onClick={() => openReply(q.email_id)}>Reply</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <PaginationBar totalPages={totalPages} total={total} />
                  </>
                );
              })()}

              {/* ====== HELP REQUESTS TAB ====== */}
              {activeTab === 'help' && (() => {
                const { items, totalPages, total } = paginate(helpRequests);
                return (
                  <>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1100px' }}>
                      <thead><tr>
                        <th style={thStyle}>ID</th><th style={thStyle}>Name</th><th style={thStyle}>Service</th>
                        <th style={thStyle}>Phone</th><th style={thStyle}>Description</th><th style={thStyle}>Status</th>
                        <th style={thStyle}>Assigned NGO</th><th style={thStyle}>Actions</th>
                      </tr></thead>
                      <tbody>
                        {items.length === 0 ? (
                          <tr><td colSpan="8" style={{ ...tdStyle, textAlign: 'center', color: '#64748b' }}>No help requests found</td></tr>
                        ) : items.map((h, i) => (
                          <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                            <td style={{ ...tdStyle, fontSize: '12px', fontFamily: 'monospace', color: '#64748b' }}>{h.id || '—'}</td>
                            <td style={tdStyle}>{h.name}</td>
                            <td style={tdStyle}><span style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(16,185,129,0.1)', color: '#34d399', fontSize: '12px', fontWeight: 600 }}>{h.service_type}</span></td>
                            <td style={tdStyle}>{h.phone}</td>
                            <td style={{ ...tdStyle, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.description}</td>
                            <td style={tdStyle}><span style={statusBadge(h.status || 'pending')}>{h.status || 'pending'}</span></td>
                            <td style={tdStyle}>{h.assigned_ngo || <span style={{ color: '#64748b' }}>Not assigned</span>}</td>
                            <td style={{ ...tdStyle, minWidth: '220px' }}>
                              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                {(!h.status || h.status === 'pending') && (
                                  <>
                                    <button style={actionBtnStyle('rgba(59,130,246,0.15)', '#60a5fa')} onClick={() => updateRequest(h.id, 'verify')}>✓ Verify</button>
                                    <button style={actionBtnStyle('rgba(239,68,68,0.15)', '#f87171')} onClick={() => updateRequest(h.id, 'reject')}>✗ Reject</button>
                                  </>
                                )}
                                {h.status === 'verified' && (
                                  <button style={actionBtnStyle('rgba(16,185,129,0.15)', '#34d399')} onClick={() => { setAssignModal(h); setSelectedNgo(''); }}>Assign NGO</button>
                                )}
                                {h.status === 'assigned' && (
                                  <button style={actionBtnStyle('rgba(139,92,246,0.15)', '#a78bfa')} onClick={() => updateRequest(h.id, 'complete')}>✓ Complete</button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <PaginationBar totalPages={totalPages} total={total} />
                  </>
                );
              })()}

              {/* ====== DONATIONS TAB ====== */}
              {activeTab === 'donations' && (() => {
                const { items, totalPages, total } = paginate(donations);
                return (
                  <>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                      <thead><tr>
                        <th style={thStyle}>Name</th><th style={thStyle}>Phone</th><th style={thStyle}>Email</th>
                        <th style={thStyle}>Type</th><th style={thStyle}>Description</th><th style={thStyle}>Quantity</th>
                      </tr></thead>
                      <tbody>
                        {items.length === 0 ? (
                          <tr><td colSpan="6" style={{ ...tdStyle, textAlign: 'center', color: '#64748b' }}>No donations found</td></tr>
                        ) : items.map((d, i) => (
                          <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                            <td style={tdStyle}>{d.name}</td><td style={tdStyle}>{d.mobile}</td>
                            <td style={tdStyle}>{d.email}</td>
                            <td style={tdStyle}><span style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(249,115,22,0.1)', color: '#fb923c', fontSize: '12px', fontWeight: 600 }}>{d.donate_type}</span></td>
                            <td style={tdStyle}>{d.description}</td><td style={tdStyle}>{d.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <PaginationBar totalPages={totalPages} total={total} />
                  </>
                );
              })()}

              {/* ====== NGO APPLICATIONS TAB — WITH VERIFICATION ====== */}
              {activeTab === 'ngos' && (() => {
                const { items, totalPages, total } = paginate(ngoApps);
                return (
                  <>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                      <thead><tr>
                        <th style={thStyle}>NGO Name</th><th style={thStyle}>Email</th><th style={thStyle}>Phone</th>
                        <th style={thStyle}>City</th><th style={thStyle}>Services</th><th style={thStyle}>Status</th>
                        <th style={thStyle}>Actions</th>
                      </tr></thead>
                      <tbody>
                        {items.length === 0 ? (
                          <tr><td colSpan="7" style={{ ...tdStyle, textAlign: 'center', color: '#64748b' }}>No NGO applications found</td></tr>
                        ) : items.map((n, i) => (
                          <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                            <td style={tdStyle}>{n.name}</td><td style={tdStyle}>{n.email}</td>
                            <td style={tdStyle}>{n.phone}</td><td style={tdStyle}>{n.city}, {n.state}</td>
                            <td style={tdStyle}>{n.services?.map(s => <span key={s} style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(16,185,129,0.1)', color: '#34d399', fontSize: '11px', fontWeight: 600, marginRight: '4px', textTransform: 'capitalize' }}>{s}</span>)}</td>
                            <td style={tdStyle}><span style={statusBadge(n.status || 'pending')}>{n.status || 'pending'}</span></td>
                            <td style={tdStyle}>
                              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                {(!n.status || n.status === 'pending') && (
                                  <>
                                    <button style={actionBtnStyle('rgba(16,185,129,0.15)', '#34d399')} onClick={() => updateNgoStatus(n.id, 'approved')}>✓ Approve</button>
                                    <button style={actionBtnStyle('rgba(239,68,68,0.15)', '#f87171')} onClick={() => updateNgoStatus(n.id, 'rejected')}>✗ Reject</button>
                                  </>
                                )}
                                {n.status === 'approved' && <span style={{ color: '#34d399', fontSize: '12px', fontWeight: 600 }}>✅ Approved</span>}
                                {n.status === 'rejected' && <span style={{ color: '#f87171', fontSize: '12px', fontWeight: 600 }}>❌ Rejected</span>}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <PaginationBar totalPages={totalPages} total={total} />
                  </>
                );
              })()}

            </div>
          )}
        </div>
      </section>

      {/* Assign NGO Modal */}
      {assignModal && (() => {
        const calcDist = (lat1, lon1, lat2, lon2) => {
          if (!lat1 || !lon1 || !lat2 || !lon2) return null;
          const R = 6371;
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLon = (lon2 - lon1) * Math.PI / 180;
          const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
          return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
        };

        const userLat = assignModal.user_lat;
        const userLng = assignModal.user_lng;
        const hasLocation = userLat && userLng;

        const ngosWithDist = ngos.map(n => ({
          ...n,
          distance: hasLocation ? calcDist(userLat, userLng, n.lat, n.lng) : null
        }));

        const matching = ngosWithDist
          .filter(n => n.services.includes(assignModal.service_type))
          .sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999));

        const others = ngosWithDist
          .filter(n => !n.services.includes(assignModal.service_type))
          .sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999));

        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '24px' }}>
            <div className="glass-card" style={{ maxWidth: '560px', width: '100%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '90vh', overflow: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 700 }}>Assign NGO to Request</h3>
                <button onClick={() => setAssignModal(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '24px', cursor: 'pointer' }}>✕</button>
              </div>

              <div style={{ marginBottom: '20px', padding: '16px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}>
                <p style={{ color: '#94a3b8', fontSize: '13px' }}>Name: <strong style={{ color: '#cbd5e1' }}>{assignModal.name}</strong></p>
                <p style={{ color: '#94a3b8', fontSize: '13px' }}>Service: <strong style={{ color: '#34d399' }}>{assignModal.service_type}</strong></p>
              </div>

              <div className="form-group">
                <label>Select NGO {hasLocation ? '(sorted by nearest)' : ''}</label>
                <select className="form-input" value={selectedNgo} onChange={e => setSelectedNgo(e.target.value)}>
                  <option value="">-- Choose an NGO --</option>
                  <optgroup label={`✅ ${assignModal.service_type} NGOs`}>
                    {matching.map(n => (
                      <option key={n.id} value={n.name}>{n.name} ({n.city}){n.distance !== null ? ` — ${n.distance} km` : ''}</option>
                    ))}
                  </optgroup>
                  {others.length > 0 && (
                    <optgroup label="Other NGOs">
                      {others.map(n => (
                        <option key={n.id} value={n.name}>{n.name} ({n.city}){n.distance !== null ? ` — ${n.distance} km` : ''}</option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>Admin Remarks (optional)</label>
                <textarea className="form-input" rows="3" placeholder="Any notes..." value={adminRemarks} onChange={e => setAdminRemarks(e.target.value)}></textarea>
              </div>

              <button onClick={() => updateRequest(assignModal.id, 'assign', selectedNgo, adminRemarks)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={!selectedNgo}>
                Assign to {selectedNgo || '...'}
              </button>
            </div>
          </div>
        );
      })()}

      {/* Reply Modal */}
      {replyModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '24px' }}>
          <div className="glass-card" style={{ maxWidth: '500px', width: '100%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 700 }}>Reply to Message</h3>
              <button onClick={() => setReplyModal(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '24px', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); alert('Reply sent to ' + replyForm.email); setReplyModal(null); }}>
              <div className="form-group">
                <label>Email</label>
                <input className="form-input" type="email" value={replyForm.email} onChange={e => setReplyForm({...replyForm, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea className="form-input" rows="5" placeholder="Type your reply..." value={replyForm.message} onChange={e => setReplyForm({...replyForm, message: e.target.value})}></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Send Reply</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
