import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { notificationService } from '../../services/dataService';
import { Bell, CheckCircle } from 'lucide-react';

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    notificationService.getNotifications().then((res) => {
      setNotifications(res.data.data.notifications || []);
    });
  }, []);

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Notifications</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Stay updated with course announcements and activity.</p>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map((n) => (
            <div key={n._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{n.title}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{n.message}</div>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(n.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
          {notifications.length === 0 && (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No notifications found.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentNotifications;
