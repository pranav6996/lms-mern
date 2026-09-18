import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { userService, courseService, enrollmentService } from '../../services/dataService';
import { Users, BookOpen, GraduationCap, TrendingUp, Activity, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, activeUsers: 0 });
  const [courseStats, setCourseStats] = useState({ total: 0, published: 0 });
  const [enrollStats, setEnrollStats] = useState({ totalEnrollments: 0 });
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, courseRes, enrollRes, trendRes] = await Promise.all([
          userService.getStats(),
          courseService.getCourseStats(),
          enrollmentService.getStats(),
          enrollmentService.getTrends(),
        ]);
        setStats(userRes.data.stats);
        setCourseStats(courseRes.data.stats);
        setEnrollStats(enrollRes.data.stats);
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        setTrends(trendRes.data.trends.map(t => ({ name: months[t._id.month - 1], enrollments: t.count })));
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents, icon: Users, color: '#6366f1', bg: 'rgb(99 102 241 / 0.15)' },
    { label: 'Total Teachers', value: stats.totalTeachers, icon: GraduationCap, color: '#0ea5e9', bg: 'rgb(14 165 233 / 0.15)' },
    { label: 'Total Courses', value: courseStats.total, icon: BookOpen, color: '#10b981', bg: 'rgb(16 185 129 / 0.15)' },
    { label: 'Published Courses', value: courseStats.published, icon: CheckCircle, color: '#f59e0b', bg: 'rgb(245 158 11 / 0.15)' },
    { label: 'Total Enrollments', value: enrollStats.totalEnrollments, icon: TrendingUp, color: '#ef4444', bg: 'rgb(239 68 68 / 0.15)' },
    { label: 'Active Users', value: stats.activeUsers, icon: Activity, color: '#8b5cf6', bg: 'rgb(139 92 246 / 0.15)' },
  ];

  return (
    <DashboardLayout>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Dashboard Overview</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {statCards.map((card, i) => (
            <div key={i} className="stat-card">
              <div className="stat-icon" style={{ background: card.bg }}>
                <card.icon size={22} color={card.color} />
              </div>
              <div>
                <div className="stat-value">{loading ? '-' : card.value}</div>
                <div className="stat-label">{card.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Enrollment Trends</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 8 }} />
                <Bar dataKey="enrollments" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
export default AdminDashboard;