import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { enrollmentService, resultService } from '../../services/dataService';
import { BookOpen, Award, CheckCircle, Clock, ArrowRight, Play } from 'lucide-react';

const StudentDashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const eRes = await enrollmentService.getMyEnrollments();
      setEnrollments(eRes.data.data.enrollments || []);
      const rRes = await resultService.getMyResults();
      setResults(rRes.data.data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const completedCount = enrollments.filter((e) => e.progress === 100).length;

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Student Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track your progress and continue learning.</p>
        </div>
        <Link to="/courses" className="btn btn-primary">
          <BookOpen size={18} /> Browse More Courses
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {[
          { label: 'Enrolled Courses', value: enrollments.length, icon: BookOpen, color: 'var(--primary)' },
          { label: 'Completed Courses', value: completedCount, icon: CheckCircle, color: 'var(--success)' },
          { label: 'Quizzes Taken', value: results.length, icon: Award, color: 'var(--secondary)' },
          { label: 'Average Score', value: results.length > 0 ? `${Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)}%` : 'N/A', icon: Clock, color: '#f59e0b' },
        ].map((item, i) => (
          <div key={i} className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${item.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <item.icon size={24} color={item.color} />
            </div>
            <div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{item.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Enrolled Courses */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>My Courses</h3>
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading courses...</p>
        ) : enrollments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>You are not enrolled in any courses yet.</p>
            <Link to="/courses" className="btn btn-secondary">Explore Catalog</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {enrollments.map((e) => (
              <div key={e._id} className="card" style={{ padding: '1.25rem', background: 'var(--bg-secondary)' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem' }}>{e.course?.title}</h4>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>
                    <span>Progress</span>
                    <span>{e.progress || 0}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${e.progress || 0}%` }} />
                  </div>
                </div>
                <Link to={`/student/courses/${e.course?._id}`} className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                  <Play size={14} /> Continue Learning
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
