import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { courseService, resultService } from '../../services/dataService';
import { BookOpen, Users, HelpCircle, Award, Plus, ArrowRight, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ totalCourses: 0, totalStudents: 0, totalQuizzes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      const res = await courseService.getTeacherCourses();
      const myCourses = res.data.data.courses || [];
      setCourses(myCourses);
      const totalStudents = myCourses.reduce((sum, c) => sum + (c.enrollmentCount || 0), 0);
      setStats({
        totalCourses: myCourses.length,
        totalStudents,
        totalQuizzes: myCourses.reduce((sum, c) => sum + (c.quizCount || 0), 0),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = courses.slice(0, 6).map((c) => ({
    name: c.title.length > 15 ? c.title.substring(0, 15) + '...' : c.title,
    students: c.enrollmentCount || 0,
  }));

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Teacher Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back! Manage your courses and student analytics.</p>
        </div>
        <Link to="/teacher/courses/create" className="btn btn-primary">
          <Plus size={18} /> Create New Course
        </Link>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {[
          { label: 'My Courses', value: stats.totalCourses, icon: BookOpen, color: 'var(--primary)' },
          { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'var(--secondary)' },
          { label: 'Active Quizzes', value: stats.totalQuizzes, icon: HelpCircle, color: 'var(--accent)' },
          { label: 'Avg Rating', value: '4.9 ★', icon: Award, color: '#f59e0b' },
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

      {/* Charts & Quick Access */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} color="var(--primary)" /> Course Enrollments
          </h3>
          <div style={{ height: 260 }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} />
                  <Tooltip contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: 8 }} />
                  <Bar dataKey="students" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                No enrollment data yet
              </div>
            )}
          </div>
        </div>

        {/* Recent Courses */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>My Recent Courses</h3>
            <Link to="/teacher/courses" className="btn btn-sm btn-ghost">View All</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {courses.slice(0, 4).map((c) => (
              <div key={c._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{c.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.enrollmentCount || 0} students · {c.status}</div>
                </div>
                <Link to={`/teacher/courses/${c._id}/edit`} className="btn btn-xs btn-secondary">Edit</Link>
              </div>
            ))}
            {courses.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                No courses created yet. Click "Create New Course" to get started!
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
