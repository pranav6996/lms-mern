import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { enrollmentService } from '../../services/dataService';
import { Award, CheckCircle } from 'lucide-react';

const StudentProgress = () => {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    enrollmentService.getMyEnrollments().then((res) => {
      setEnrollments(res.data.data.enrollments || []);
    });
  }, []);

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Learning Progress</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track milestone completion across all enrolled courses.</p>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {enrollments.map((e) => (
            <div key={e._id} style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700 }}>{e.course?.title}</span>
                <span className="badge badge-primary">{e.progress || 0}% Complete</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${e.progress || 0}%` }} />
              </div>
            </div>
          ))}
          {enrollments.length === 0 && (
            <p style={{ color: 'var(--text-muted)' }}>No progress recorded yet.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentProgress;
