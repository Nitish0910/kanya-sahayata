'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiMapPin, FiPhone, FiMail, FiGlobe, FiNavigation, FiFilter } from 'react-icons/fi';

const serviceColors = { education: '#10b981', medical: '#f97316', domestic: '#8b5cf6' };
const serviceIcons = { education: '📚', medical: '🏥', domestic: '🏠' };

export default function NGOsPage() {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationStatus, setLocationStatus] = useState('detecting');
  const [filter, setFilter] = useState('all');
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          setLocationStatus('found');
          fetchNGOs(loc.lat, loc.lng);
        },
        () => {
          setLocationStatus('denied');
          fetchNGOs();
        },
        { timeout: 10000 }
      );
    } else {
      setLocationStatus('unsupported');
      fetchNGOs();
    }
  }, []);

  const fetchNGOs = async (lat, lng) => {
    try {
      let url = '/api/ngos';
      const params = new URLSearchParams();
      if (lat && lng) { params.set('lat', lat); params.set('lng', lng); }
      if (params.toString()) url += '?' + params.toString();
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setNgos(data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const filtered = filter === 'all' ? ngos : ngos.filter(n => n.services.includes(filter));

  return (
    <>
      <div className="page-banner">
        <h1>NGO Partners</h1>
        <div className="divider"></div>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>We deliver services through our trusted NGO partners near you</p>
      </div>

      <section className="section-padding">
        <div className="container">
          {/* Location & Filter Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: locationStatus === 'found' ? 'rgba(16,185,129,0.1)' : 'rgba(249,115,22,0.1)', border: `1px solid ${locationStatus === 'found' ? 'rgba(16,185,129,0.2)' : 'rgba(249,115,22,0.2)'}`, borderRadius: '50px', fontSize: '14px' }}>
                <FiNavigation size={14} color={locationStatus === 'found' ? '#34d399' : '#fb923c'} />
                <span style={{ color: locationStatus === 'found' ? '#34d399' : '#fb923c' }}>
                  {locationStatus === 'detecting' ? 'Detecting location...' :
                   locationStatus === 'found' ? 'Location detected — sorted by nearest' :
                   'Location not available — showing all NGOs'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <FiFilter size={16} color="#94a3b8" />
              {['all', 'education', 'medical', 'domestic'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: '8px 20px', border: 'none', borderRadius: '10px', cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 600,
                  background: filter === f ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.06)',
                  color: filter === f ? 'white' : '#94a3b8', transition: 'all 0.3s',
                  boxShadow: filter === f ? '0 4px 20px rgba(16,185,129,0.3)' : 'none',
                  textTransform: 'capitalize'
                }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* NGO Cards */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px', animation: 'pulse 1.5s infinite' }}>📍</div>
              Detecting your location and finding nearby NGOs...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>No NGOs found for this filter.</div>
          ) : (
            <div style={{ display: 'grid', gap: '24px' }}>
              {filtered.map((ngo, i) => (
                <div key={ngo.id} className="glass-card" style={{ padding: '32px', animation: `fadeInUp 0.5s ease-out ${i * 0.05}s both` }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '24px', alignItems: 'start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                        <h3 style={{ color: 'white', fontSize: '22px', fontWeight: 700 }}>{ngo.name}</h3>
                        {ngo.distance !== undefined && (
                          <span style={{ padding: '4px 14px', borderRadius: '50px', background: ngo.distance < 100 ? 'rgba(16,185,129,0.15)' : ngo.distance < 500 ? 'rgba(249,115,22,0.15)' : 'rgba(139,92,246,0.15)', color: ngo.distance < 100 ? '#34d399' : ngo.distance < 500 ? '#fb923c' : '#a78bfa', fontSize: '13px', fontWeight: 600 }}>
                            📍 {ngo.distance} km away
                          </span>
                        )}
                      </div>

                      <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: '16px', fontSize: '15px' }}>{ngo.description}</p>

                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                        {ngo.services.map(s => (
                          <span key={s} style={{ padding: '4px 14px', borderRadius: '8px', background: `${serviceColors[s]}15`, color: serviceColors[s], fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' }}>
                            {serviceIcons[s]} {s}
                          </span>
                        ))}
                      </div>

                      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', color: '#94a3b8', fontSize: '14px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiMapPin size={14} color="#34d399" /> {ngo.address}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiPhone size={14} color="#34d399" /> {ngo.phone}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FiMail size={14} color="#34d399" /> {ngo.email}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '140px' }}>
                      {ngo.website && (
                        <a href={ngo.website} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '10px 20px', fontSize: '13px', textAlign: 'center' }}>
                          <FiGlobe size={14} /> Website
                        </a>
                      )}
                      <Link href="/help-request" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '13px', justifyContent: 'center' }}>
                        Get Help
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA: NGO Registration */}
          <div className="glass-card" style={{ marginTop: '60px', textAlign: 'center', padding: '50px', background: 'linear-gradient(135deg, rgba(16,185,129,0.05), rgba(139,92,246,0.05))' }}>
            <h3 style={{ color: 'white', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Are you an NGO?</h3>
            <p style={{ color: '#94a3b8', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
              Partner with Kanya Sahayata to help rural girls. Register your NGO and become part of our mission.
            </p>
            <Link href="/ngos/register" className="btn btn-primary">Register Your NGO →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
