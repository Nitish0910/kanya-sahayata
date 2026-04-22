'use client';
import { useState, useEffect, useCallback } from 'react';
import styles from './NotificationBell.module.css';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.success) {
        const prevUnread = notifications.filter(n => !n.read).length;
        const newUnread = data.data.filter(n => !n.read).length;
        // Play notification sound if new unread appeared
        if (newUnread > prevUnread && prevUnread > 0) {
          try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ==');
            audio.volume = 0.3;
            audio.play().catch(() => {});
          } catch {}
        }
        setNotifications(data.data);
      }
    } catch {}
  }, [notifications]);

  useEffect(() => {
    fetchNotifications();
    // #13 Improved polling - 15s when visible, paused when hidden
    let interval;
    const startPolling = () => { interval = setInterval(fetchNotifications, 15000); };
    const stopPolling = () => { if (interval) clearInterval(interval); };
    
    const handleVisibility = () => {
      if (document.hidden) stopPolling();
      else { fetchNotifications(); startPolling(); }
    };
    
    startPolling();
    document.addEventListener('visibilitychange', handleVisibility);
    return () => { stopPolling(); document.removeEventListener('visibilitychange', handleVisibility); };
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = async () => {
    setLoading(true);
    await fetch('/api/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAll: true })
    });
    await fetchNotifications();
    setLoading(false);
  };

  const timeAgo = (date) => {
    const secs = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (secs < 60) return 'Just now';
    if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
    if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
    return `${Math.floor(secs / 86400)}d ago`;
  };

  const typeIcon = { info: 'ℹ️', success: '✅', warning: '⚠️' };

  return (
    <div className={styles.container}>
      <button
        className={styles.bellBtn}
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        🔔
        {unreadCount > 0 && <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>

      {showDropdown && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <h4>Notifications</h4>
            {unreadCount > 0 && (
              <button className={styles.markAllBtn} onClick={markAllRead} disabled={loading}>
                {loading ? '...' : 'Mark all read'}
              </button>
            )}
          </div>
          <div className={styles.list}>
            {notifications.length === 0 ? (
              <div className={styles.empty}>
                <span>🔕</span>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.slice(0, 10).map(n => (
                <div key={n.id} className={`${styles.item} ${!n.read ? styles.unread : ''}`}>
                  <span className={styles.icon}>{typeIcon[n.type] || 'ℹ️'}</span>
                  <div className={styles.content}>
                    <p className={styles.title}>{n.title}</p>
                    <p className={styles.message}>{n.message}</p>
                    <span className={styles.time}>{timeAgo(n.created_at)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
