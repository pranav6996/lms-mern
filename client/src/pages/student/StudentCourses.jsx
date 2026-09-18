import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { enrollmentService } from '../../services/dataService';
import { BookOpen, Play } from 'lucide-react';

const StudentCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    enrollmentService.getMyEnrollments().then((res) => {
      setEnrollments(res.data.data.enrollments || []);
      setLoading(false);
    });
  }, []);

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Enrolled Courses</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Access your learning materials anytime.</p>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      ) : enrollments.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <BookOpen size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3>No Enrolled Courses</h3>
          <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>Discover new skills in our course catalog.</p>
          <Link to="/courses" className="btn btn-primary">Browse Catalog</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {enrollments.map((e) => (
            <div key={e._id} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem' }}>{e.course?.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', flex: 1, marginBottom: '1rem' }}>{e.course?.description}</p>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  <span>Completed</span>
                  <span>{e.progress || 0}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${e.progress || 0}%` }} />
                </div>
              </div>
              <Link to={`/student/courses/${e.course?._id}`} className="btn btn-primary btn-sm" style={{ justifyContent: 'center' }}>
                <Play size={14} /> Open Course
              </Link>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentCourses;
