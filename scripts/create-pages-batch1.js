// Batch create all major page components for LearnHub LMS
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'client', 'src');

const writeFile = (filePath, content) => {
  const fullPath = path.join(srcDir, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Created: ${filePath}`);
};

// ============================================
// LANDING PAGE
// ============================================
writeFile('pages/landing/Landing.jsx', `import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, BookOpen, Users, Award, ArrowRight, Star, Play, Shield, Zap, Globe } from 'lucide-react';

const Landing = () => {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={20} color="white" />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>LearnHub</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link to="/courses" className="btn btn-sm btn-secondary">Courses</Link>
            {user ? (
              <Link to="/dashboard" className="btn btn-sm btn-primary">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm btn-secondary">Login</Link>
                <Link to="/register" className="btn btn-sm btn-primary">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: '8rem', paddingBottom: '5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 300, height: 300, background: 'var(--primary)', opacity: 0.05, borderRadius: '50%', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 400, height: 400, background: 'var(--secondary)', opacity: 0.05, borderRadius: '50%', filter: 'blur(80px)' }} />
        <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-block', padding: '0.375rem 1rem', background: 'rgb(99 102 241 / 0.1)', borderRadius: 9999, marginBottom: '1.5rem', border: '1px solid rgb(99 102 241 / 0.2)' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--primary-light)', fontWeight: 500 }}>🚀 Your Learning Journey Starts Here</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, maxWidth: 800, margin: '0 auto 1.5rem' }}>
            Learn Without Limits, <br />
            <span style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Grow Without Boundaries</span>
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 2rem', lineHeight: 1.7 }}>
            Access world-class courses, learn from expert instructors, and build skills that matter. Join thousands of learners transforming their careers.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ fontSize: '1rem' }}>
              Start Learning Free <ArrowRight size={18} />
            </Link>
            <Link to="/courses" className="btn btn-secondary btn-lg" style={{ fontSize: '1rem' }}>
              <Play size={18} /> Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '3rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            {[
              { value: '10,000+', label: 'Active Students', icon: Users },
              { value: '500+', label: 'Expert Courses', icon: BookOpen },
              { value: '50+', label: 'Expert Teachers', icon: Award },
              { value: '95%', label: 'Success Rate', icon: Star },
            ].map((stat, i) => (
              <div key={i} style={{ padding: '1rem' }}>
                <stat.icon size={28} color="var(--primary)" style={{ margin: '0 auto 0.75rem' }} />
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stat.value}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.75rem' }}>Why Learn With Us?</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>Everything you need to advance your skills and career</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: BookOpen, title: 'Expert-Led Courses', desc: 'Learn from industry professionals with real-world experience and proven teaching methods.' },
              { icon: Zap, title: 'Interactive Learning', desc: 'Engage with quizzes, projects, and hands-on exercises that reinforce your understanding.' },
              { icon: Shield, title: 'Verified Certificates', desc: 'Earn certificates recognized by top employers to showcase your skills and knowledge.' },
              { icon: Globe, title: 'Learn Anywhere', desc: 'Access courses on any device, anytime. Your progress syncs across all platforms.' },
              { icon: Users, title: 'Community Support', desc: 'Connect with fellow learners, share knowledge, and grow together.' },
              { icon: Star, title: 'Quality Content', desc: 'Carefully curated courses with up-to-date content and best practices.' },
            ].map((feature, i) => (
              <div key={i} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, rgb(99 102 241 / 0.15), rgb(14 165 233 / 0.15))', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <feature.icon size={22} color="var(--primary)" />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', borderRadius: 'var(--radius-lg)', padding: 'clamp(2rem, 5vw, 4rem)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'rgb(255 255 255 / 0.05)', borderRadius: '50%' }} />
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>Ready to Start Learning?</h2>
            <p style={{ fontSize: '1.125rem', color: 'rgb(255 255 255 / 0.8)', maxWidth: 500, margin: '0 auto 2rem' }}>Join thousands of learners already building their future with LearnHub.</p>
            <Link to="/register" className="btn btn-lg" style={{ background: 'white', color: 'var(--primary-dark)', fontWeight: 600, fontSize: '1rem' }}>
              Get Started Free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '3rem 0 2rem' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap size={16} color="white" />
              </div>
              <span style={{ fontWeight: 700 }}>LearnHub</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>© 2024 LearnHub LMS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default Landing;`);

// ============================================
// ADMIN PAGES
// ============================================
writeFile('pages/admin/AdminDashboard.jsx', `import { useState, useEffect } from 'react';
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
export default AdminDashboard;`);

writeFile('pages/admin/AdminUsers.jsx', `import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { userService } from '../../services/dataService';
import { Search, Plus, Edit, Trash2, UserCheck, UserX, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState(() => {
    if (location.pathname.includes('students')) return 'student';
    if (location.pathname.includes('teachers')) return 'teacher';
    return '';
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await userService.getUsers({ page, limit: 10, search, role: roleFilter });
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (e) { toast.error('Failed to fetch users'); }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, [search, roleFilter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (editUser) {
        await userService.updateUser(editUser._id, form);
        toast.success('User updated');
      } else {
        await userService.createUser(form);
        toast.success('User created');
      }
      setShowModal(false); setEditUser(null); setForm({ name: '', email: '', password: '', role: 'student' });
      fetchUsers();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const handleToggleActive = async (user) => {
    try {
      await userService.updateUser(user._id, { isActive: !user.isActive });
      toast.success(user.isActive ? 'User deactivated' : 'User activated');
      fetchUsers();
    } catch (e) { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await userService.deleteUser(id);
      toast.success('User deleted');
      fetchUsers();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  return (
    <DashboardLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Users</h2>
          <button className="btn btn-primary" onClick={() => { setEditUser(null); setForm({ name: '', email: '', password: '', role: 'teacher' }); setShowModal(true); }}>
            <Plus size={16} /> Add User
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: '2.25rem' }} />
          </div>
          <select className="form-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ width: 'auto', minWidth: 120 }}>
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={6}><div className="skeleton" style={{ height: 20, width: '100%' }} /></td></tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No users found</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id}>
                    <td style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="avatar avatar-sm">{u.profileImage ? <img src={u.profileImage} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : u.name?.charAt(0).toUpperCase()}</div>
                      {u.name}
                    </td>
                    <td>{u.email}</td>
                    <td><span className={\`badge badge-\${u.role === 'admin' ? 'danger' : u.role === 'teacher' ? 'info' : 'primary'}\`}>{u.role}</span></td>
                    <td><span className={\`badge badge-\${u.isActive ? 'success' : 'warning'}\`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button className="btn btn-sm btn-secondary" onClick={() => { setEditUser(u); setForm({ name: u.name, email: u.email, role: u.role, password: '' }); setShowModal(true); }}><Edit size={14} /></button>
                        <button className="btn btn-sm btn-secondary" onClick={() => handleToggleActive(u)}>{u.isActive ? <UserX size={14} /> : <UserCheck size={14} />}</button>
                        {u.role !== 'admin' && <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u._id)}><Trash2 size={14} /></button>}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {pagination.pages > 1 && (
            <div className="pagination">
              {Array.from({ length: pagination.pages }, (_, i) => (
                <button key={i} className={pagination.page === i + 1 ? 'active' : ''} onClick={() => fetchUsers(i + 1)}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{editUser ? 'Edit User' : 'Create User'}</h3>
                <button onClick={() => setShowModal(false)} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
                {!editUser && <div className="form-group"><label className="form-label">Password</label><input type="password" className="form-input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} /></div>}
                <div className="form-group"><label className="form-label">Role</label><select className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="student">Student</option><option value="teacher">Teacher</option></select></div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editUser ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
export default AdminUsers;`);

writeFile('pages/admin/AdminCourses.jsx', `import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { courseService } from '../../services/dataService';
import { Search, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCourses = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await courseService.getAdminCourses({ page, limit: 10, search, status });
      setCourses(data.courses);
      setPagination(data.pagination);
    } catch (e) { toast.error('Failed to fetch courses'); }
    setLoading(false);
  };

  useEffect(() => { fetchCourses(); }, [search, status]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course and all its content?')) return;
    try {
      await courseService.deleteCourse(id);
      toast.success('Course deleted');
      fetchCourses();
    } catch (e) { toast.error('Failed'); }
  };

  const handlePublish = async (id) => {
    try {
      await courseService.publishCourse(id);
      toast.success('Course status updated');
      fetchCourses();
    } catch (e) { toast.error('Failed'); }
  };

  return (
    <DashboardLayout>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Courses</h2>
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: '2.25rem' }} />
          </div>
          <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: 'auto' }}>
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead><tr><th>Course</th><th>Teacher</th><th>Category</th><th>Students</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? Array(5).fill(0).map((_, i) => <tr key={i}><td colSpan={6}><div className="skeleton" style={{ height: 20 }} /></td></tr>) :
              courses.length === 0 ? <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No courses found</td></tr> :
              courses.map(c => (
                <tr key={c._id}>
                  <td style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>{c.title}</td>
                  <td>{c.teacher?.name}</td>
                  <td>{c.category?.name}</td>
                  <td>{c.enrolledStudents}</td>
                  <td><span className={\`badge badge-\${c.status === 'published' ? 'success' : c.status === 'draft' ? 'warning' : 'danger'}\`}>{c.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <Link to={\`/courses/\${c._id}\`} className="btn btn-sm btn-secondary"><Eye size={14} /></Link>
                      <button className="btn btn-sm btn-secondary" onClick={() => handlePublish(c._id)}>{c.status === 'published' ? <XCircle size={14} /> : <CheckCircle size={14} />}</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c._id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pagination.pages > 1 && <div className="pagination">{Array.from({ length: pagination.pages }, (_, i) => <button key={i} className={pagination.page === i + 1 ? 'active' : ''} onClick={() => fetchCourses(i + 1)}>{i + 1}</button>)}</div>}
        </div>
      </div>
    </DashboardLayout>
  );
};
export default AdminCourses;`);

// Simpler admin pages
writeFile('pages/admin/AdminCategories.jsx', `import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { categoryService } from '../../services/dataService';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const fetch = async () => {
    setLoading(true);
    try { const { data } = await categoryService.getAllCategories(); setCategories(data.categories); } catch (e) { toast.error('Failed'); }
    setLoading(false);
  };
  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCat) { await categoryService.updateCategory(editCat._id, form); toast.success('Updated'); }
      else { await categoryService.createCategory(form); toast.success('Created'); }
      setShowModal(false); setEditCat(null); setForm({ name: '', description: '' }); fetch();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try { await categoryService.deleteCategory(id); toast.success('Deleted'); fetch(); } catch (e) { toast.error('Failed'); }
  };

  return (
    <DashboardLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Categories</h2>
          <button className="btn btn-primary" onClick={() => { setEditCat(null); setForm({ name: '', description: '' }); setShowModal(true); }}><Plus size={16} /> Add Category</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {loading ? Array(4).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 'var(--radius-lg)' }} />) :
          categories.map(cat => (
            <div key={cat._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{cat.name}</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{cat.description || 'No description'}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <button className="btn btn-sm btn-secondary" onClick={() => { setEditCat(cat); setForm({ name: cat.name, description: cat.description }); setShowModal(true); }}><Edit size={14} /></button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(cat._id)}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: 600 }}>{editCat ? 'Edit' : 'Add'} Category</h3>
                <button onClick={() => setShowModal(false)} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editCat ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
export default AdminCategories;`);

writeFile('pages/admin/AdminEnrollments.jsx', `import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { enrollmentService } from '../../services/dataService';
import toast from 'react-hot-toast';

const AdminEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);

  const fetch = async (page = 1) => {
    setLoading(true);
    try { const { data } = await enrollmentService.getAllEnrollments({ page, limit: 10 }); setEnrollments(data.enrollments); setPagination(data.pagination); } catch (e) { toast.error('Failed'); }
    setLoading(false);
  };
  useEffect(() => { fetch(); }, []);

  return (
    <DashboardLayout>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Enrollments</h2>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead><tr><th>Student</th><th>Course</th><th>Progress</th><th>Enrolled</th></tr></thead>
            <tbody>
              {loading ? Array(5).fill(0).map((_, i) => <tr key={i}><td colSpan={4}><div className="skeleton" style={{ height: 20 }} /></td></tr>) :
              enrollments.length === 0 ? <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No enrollments</td></tr> :
              enrollments.map(e => (
                <tr key={e._id}>
                  <td>{e.student?.name}</td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.course?.title}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="progress-bar" style={{ width: 80 }}><div className="progress-bar-fill" style={{ width: e.progress + '%' }} /></div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{e.progress}%</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{new Date(e.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {pagination.pages > 1 && <div className="pagination">{Array.from({ length: pagination.pages }, (_, i) => <button key={i} className={pagination.page === i + 1 ? 'active' : ''} onClick={() => fetch(i + 1)}>{i + 1}</button>)}</div>}
        </div>
      </div>
    </DashboardLayout>
  );
};
export default AdminEnrollments;`);

writeFile('pages/admin/AdminAnnouncements.jsx', `import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { announcementService } from '../../services/dataService';
import { Plus, Trash2, X, Megaphone } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', content: '' });

  const fetch = async () => {
    setLoading(true);
    try { const { data } = await announcementService.getAnnouncements({ limit: 50 }); setAnnouncements(data.announcements); } catch(e) {}
    setLoading(false);
  };
  useEffect(() => { fetch(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try { await announcementService.createAnnouncement(form); toast.success('Announcement sent!'); setShowModal(false); setForm({ title: '', content: '' }); fetch(); } catch(e) { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    try { await announcementService.deleteAnnouncement(id); toast.success('Deleted'); fetch(); } catch(e) { toast.error('Failed'); }
  };

  return (
    <DashboardLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Announcements</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> New Announcement</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {loading ? Array(3).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 'var(--radius-lg)' }} />) :
          announcements.length === 0 ? <div className="empty-state"><Megaphone size={48} /><h3>No announcements</h3><p>Create your first announcement</p></div> :
          announcements.map(a => (
            <div key={a._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{a.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{a.content}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>By {a.sender?.name} • {new Date(a.createdAt).toLocaleDateString()}</p>
              </div>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(a._id)}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: 600 }}>New Announcement</h3>
                <button onClick={() => setShowModal(false)} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="form-group"><label className="form-label">Title</label><input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">Content</label><textarea className="form-textarea" value={form.content} onChange={e => setForm({...form, content: e.target.value})} required /></div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Send</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
export default AdminAnnouncements;`);

writeFile('pages/admin/AdminProfile.jsx', `import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/dataService';
import { Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminProfile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', bio: user?.bio || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...form };
      if (profileImage) data.profileImage = profileImage;
      const res = await authService.updateProfile(data);
      updateUser(res.data.user);
      toast.success('Profile updated');
    } catch (e) { toast.error('Failed'); }
    setLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await authService.changePassword(pwForm);
      toast.success('Password changed');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 600 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Profile</h2>
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <form onSubmit={handleUpdate}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative' }}>
                <div className="avatar avatar-lg">{user?.profileImage ? <img src={user.profileImage} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : user?.name?.charAt(0).toUpperCase()}</div>
                <label style={{ position: 'absolute', bottom: -2, right: -2, width: 24, height: 24, background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Camera size={12} color="white" />
                  <input type="file" accept="image/*" onChange={e => setProfileImage(e.target.files[0])} style={{ display: 'none' }} />
                </label>
              </div>
              <div>
                <h3 style={{ fontWeight: 600 }}>{user?.name}</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{user?.email}</p>
              </div>
            </div>
            <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Bio</label><textarea className="form-textarea" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} /></div>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
          </form>
        </div>
        <div className="card">
          <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Change Password</h3>
          <form onSubmit={handleChangePassword}>
            <div className="form-group"><label className="form-label">Current Password</label><input type="password" className="form-input" value={pwForm.currentPassword} onChange={e => setPwForm({...pwForm, currentPassword: e.target.value})} required /></div>
            <div className="form-group"><label className="form-label">New Password</label><input type="password" className="form-input" value={pwForm.newPassword} onChange={e => setPwForm({...pwForm, newPassword: e.target.value})} required minLength={6} /></div>
            <button type="submit" className="btn btn-primary">Change Password</button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};
export default AdminProfile;`);

console.log('\\nAll pages created successfully!');
