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
// PUBLIC COURSES (CATALOG)
// ============================================
writeFile('pages/courses/PublicCourses.jsx', `import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courseService, categoryService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import { Search, Filter, BookOpen, Clock, Users, Star, ArrowRight, Sparkles, GraduationCap } from 'lucide-react';

const PublicCourses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [search, selectedCategory, selectedLevel, sortBy]);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategories();
      setCategories(res.data.data.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {
        sort: sortBy === 'rating' ? '-rating.average' : sortBy === 'popular' ? '-enrollmentCount' : '-createdAt',
      };
      if (search) params.search = search;
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedLevel !== 'all') params.level = selectedLevel;

      const res = await courseService.getCourses(params);
      setCourses(res.data.data.courses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={20} color="white" />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>LearnHub</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {user ? (
              <Link to="/dashboard" className="btn btn-sm btn-primary">My Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm btn-secondary">Login</Link>
                <Link to="/register" className="btn btn-sm btn-primary">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Catalog Content */}
      <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Explore Courses</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto' }}>
            Discover expert-led courses designed to take your skills to the next level.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="input"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
            <select className="select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            <select className="select" value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <select className="select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="createdAt">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ width: 40, height: 40, border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-muted)' }}>Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <BookOpen size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No Courses Found</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Try adjusting your search criteria or category filter.</p>
            <button className="btn btn-secondary" onClick={() => { setSearch(''); setSelectedCategory('all'); setSelectedLevel('all'); }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {courses.map((course) => (
              <div key={course._id} className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 160, background: 'linear-gradient(135deg, rgb(99 102 241 / 0.3), rgb(14 165 233 / 0.3))', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <BookOpen size={48} color="var(--primary)" />
                  )}
                  <span className="badge badge-primary" style={{ position: 'absolute', top: 12, right: 12, textTransform: 'capitalize' }}>
                    {course.level || 'All Levels'}
                  </span>
                </div>
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase' }}>
                      {course.category?.name || 'General'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.4 }}>
                    {course.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {course.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginBottom: '1rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Users size={15} />
                      <span>{course.enrollmentCount || 0} students</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Star size={15} color="#f59e0b" fill="#f59e0b" />
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{course.rating?.average?.toFixed(1) || '5.0'}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: course.price > 0 ? 'var(--accent)' : 'var(--success)', fontSize: '0.9375rem' }}>
                      {course.price > 0 ? \`$\${course.price}\` : 'FREE'}
                    </span>
                  </div>
                  <Link to={\`/courses/\${course._id}\`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    View Course <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicCourses;
`);

// ============================================
// COURSE DETAIL PAGE
// ============================================
writeFile('pages/courses/CourseDetail.jsx', `import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courseService, enrollmentService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Clock, Users, Star, CheckCircle, ArrowRight, Play, Lock, GraduationCap, ShieldCheck } from 'lucide-react';

const CourseDetail = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    fetchCourseDetail();
    if (user) {
      checkEnrollmentStatus();
    }
  }, [courseId, user]);

  const fetchCourseDetail = async () => {
    try {
      const res = await courseService.getPublicCourse(courseId);
      setCourse(res.data.data.course);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async () => {
    try {
      const res = await enrollmentService.getEnrollment(courseId);
      if (res.data?.data?.enrollment) {
        setIsEnrolled(true);
      }
    } catch (err) {
      setIsEnrolled(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login', { state: { from: \`/courses/\${courseId}\` } });
      return;
    }
    setEnrolling(true);
    try {
      await enrollmentService.enroll(courseId);
      setIsEnrolled(true);
      navigate(\`/student/courses/\${courseId}\`);
    } catch (err) {
      alert(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ minHeight: '100vh', padding: '6rem 2rem', textAlign: 'center', background: 'var(--bg-primary)' }}>
        <h2>Course not found</h2>
        <Link to="/courses" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Courses</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={20} color="white" />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>LearnHub</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/courses" className="btn btn-sm btn-secondary">All Courses</Link>
            {user ? (
              <Link to="/dashboard" className="btn btn-sm btn-primary">Dashboard</Link>
            ) : (
              <Link to="/login" className="btn btn-sm btn-primary">Login</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(180deg, rgba(99,102,241,0.12) 0%, rgba(15,23,42,0) 100%)', paddingTop: '7rem', paddingBottom: '3rem', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span className="badge badge-primary">{course.category?.name || 'General'}</span>
                <span className="badge badge-secondary" style={{ textTransform: 'capitalize' }}>{course.level || 'All Levels'}</span>
              </div>
              <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>
                {course.title}
              </h1>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {course.description}
              </p>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Users size={16} />
                  <span>{course.enrollmentCount || 0} enrolled</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Star size={16} color="#f59e0b" fill="#f59e0b" />
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{course.rating?.average?.toFixed(1) || '5.0'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <ShieldCheck size={16} color="var(--success)" />
                  <span>Certificate included</span>
                </div>
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="card" style={{ padding: '1.5rem', border: '1px solid rgb(99 102 241 / 0.3)' }}>
              <div style={{ height: 180, background: 'linear-gradient(135deg, rgb(99 102 241 / 0.3), rgb(14 165 233 / 0.3))', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Play size={48} color="var(--primary)" />
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: course.price > 0 ? 'var(--accent)' : 'var(--success)' }}>
                  {course.price > 0 ? \`$\${course.price}\` : 'FREE'}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Full lifetime access</span>
              </div>
              {isEnrolled ? (
                <Link to={\`/student/courses/\${course._id}\`} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                  Continue Learning <ArrowRight size={18} />
                </Link>
              ) : (
                <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} onClick={handleEnroll} disabled={enrolling}>
                  {enrolling ? 'Enrolling...' : 'Enroll Now'} <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Curriculum & Details */}
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: 800 }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Course Curriculum</h2>
          {course.modules && course.modules.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {course.modules.map((mod, index) => (
                <div key={mod._id || index} className="card" style={{ padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--primary)' }}>Module {index + 1}:</span> {mod.title}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {mod.lessons?.map((les, lIndex) => (
                      <div key={les._id || lIndex} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                          <Play size={14} color="var(--primary)" />
                          <span>{les.title}</span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{les.duration ? \`\${les.duration} mins\` : 'Lesson'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Curriculum details will be available soon.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
`);

// ============================================
// TEACHER DASHBOARD
// ============================================
writeFile('pages/teacher/TeacherDashboard.jsx', `import { useState, useEffect } from 'react';
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
            <div style={{ width: 48, height: 48, borderRadius: 12, background: \`\${item.color}20\`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                <Link to={\`/teacher/courses/\${c._id}/edit\`} className="btn btn-xs btn-secondary">Edit</Link>
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
`);

// ============================================
// TEACHER COURSES
// ============================================
writeFile('pages/teacher/TeacherCourses.jsx', `import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { courseService } from '../../services/dataService';
import { BookOpen, Plus, Edit, Trash2, Eye, Users, Star } from 'lucide-react';

const TeacherCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await courseService.getTeacherCourses();
      setCourses(res.data.data.courses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await courseService.deleteCourse(id);
      setCourses(courses.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Courses</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage and edit your published and draft courses.</p>
        </div>
        <Link to="/teacher/courses/create" className="btn btn-primary">
          <Plus size={18} /> Create Course
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{ width: 40, height: 40, border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
        </div>
      ) : courses.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <BookOpen size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No Courses Yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Create your first course to start sharing knowledge.</p>
          <Link to="/teacher/courses/create" className="btn btn-primary">
            <Plus size={18} /> Create Course
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {courses.map((course) => (
            <div key={course._id} className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 160, background: 'linear-gradient(135deg, rgb(99 102 241 / 0.25), rgb(14 165 233 / 0.25))', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <BookOpen size={48} color="var(--primary)" />
                )}
                <span className={\`badge badge-\${course.status === 'published' ? 'success' : 'warning'}\`} style={{ position: 'absolute', top: 12, right: 12 }}>
                  {course.status}
                </span>
              </div>
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>{course.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1rem', flex: 1 }}>{course.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginBottom: '1rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Users size={14} />
                    <span>{course.enrollmentCount || 0} students</span>
                  </div>
                  <span>{course.price > 0 ? \`$\${course.price}\` : 'FREE'}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link to={\`/teacher/courses/\${course._id}/edit\`} className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                    <Edit size={14} /> Edit Course
                  </Link>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(course._id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default TeacherCourses;
`);

// ============================================
// TEACHER CREATE COURSE WIZARD
// ============================================
writeFile('pages/teacher/TeacherCreateCourse.jsx', `import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { courseService, categoryService } from '../../services/dataService';
import { BookOpen, Plus, Trash2, ArrowRight, Save, Layers } from 'lucide-react';

const TeacherCreateCourse = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    price: 0,
    status: 'draft',
    tags: '',
  });

  useEffect(() => {
    categoryService.getCategories().then((res) => {
      setCategories(res.data.data.categories || []);
      if (res.data.data.categories?.length > 0) {
        setFormData((prev) => ({ ...prev, category: res.data.data.categories[0]._id }));
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return alert('Course title is required');
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : [],
      };
      const res = await courseService.createCourse(payload);
      const newCourseId = res.data.data.course._id;
      navigate(\`/teacher/courses/\${newCourseId}/edit\`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create course');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Create New Course</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Set up basic course details and proceed to building your curriculum.</p>
        </div>

        <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Course Title *</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Master Modern Web Development"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Course Description *</label>
              <textarea
                className="input"
                rows={4}
                placeholder="Comprehensive summary of what students will learn..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Category</label>
                <select className="select" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Difficulty Level</label>
                <select className="select" value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Price ($ USD)</label>
                <input
                  type="number"
                  min="0"
                  className="input"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Tags (comma-separated)</label>
              <input
                type="text"
                className="input"
                placeholder="react, nodejs, javascript, web"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/teacher/courses')}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Creating...' : 'Continue to Curriculum'} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default TeacherCreateCourse;
`);

// ============================================
// TEACHER EDIT COURSE & CURRICULUM
// ============================================
writeFile('pages/teacher/TeacherEditCourse.jsx', `import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { courseService, moduleService, lessonService } from '../../services/dataService';
import { BookOpen, Plus, Trash2, Edit, Save, CheckCircle, Video, FileText } from 'lucide-react';

const TeacherEditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newLessonData, setNewLessonData] = useState({ moduleId: '', title: '', type: 'text', content: '' });

  useEffect(() => {
    fetchCourseAndModules();
  }, [courseId]);

  const fetchCourseAndModules = async () => {
    try {
      const cRes = await courseService.getCourse(courseId);
      setCourse(cRes.data.data.course);
      const mRes = await moduleService.getModules(courseId);
      setModules(mRes.data.data.modules || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = async (e) => {
    e.preventDefault();
    if (!newModuleTitle) return;
    try {
      const res = await moduleService.createModule(courseId, { title: newModuleTitle });
      setModules([...modules, res.data.data.module]);
      setNewModuleTitle('');
    } catch (err) {
      alert('Failed to add module');
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm('Delete this module and all its lessons?')) return;
    try {
      await moduleService.deleteModule(moduleId);
      setModules(modules.filter((m) => m._id !== moduleId));
    } catch (err) {
      alert('Failed to delete module');
    }
  };

  const handleAddLesson = async (moduleId) => {
    const title = prompt('Enter Lesson Title:');
    if (!title) return;
    try {
      const res = await lessonService.createLesson(moduleId, { title, type: 'text', content: 'Lesson content goes here.' });
      fetchCourseAndModules();
    } catch (err) {
      alert('Failed to add lesson');
    }
  };

  const handlePublish = async () => {
    try {
      await courseService.publishCourse(courseId);
      setCourse({ ...course, status: 'published' });
      alert('Course published successfully!');
    } catch (err) {
      alert('Failed to publish course');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{ width: 40, height: 40, border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Curriculum Editor: {course?.title}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Status: <span className={\`badge badge-\${course?.status === 'published' ? 'success' : 'warning'}\`}>{course?.status}</span></p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {course?.status !== 'published' && (
            <button className="btn btn-success" onClick={handlePublish}>
              <CheckCircle size={16} /> Publish Course
            </button>
          )}
          <button className="btn btn-secondary" onClick={() => navigate('/teacher/courses')}>Done</button>
        </div>
      </div>

      {/* Add Module Form */}
      <form onSubmit={handleAddModule} className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem' }}>
        <input
          type="text"
          className="input"
          placeholder="New Module Title (e.g. Chapter 1: Introduction)"
          value={newModuleTitle}
          onChange={(e) => setNewModuleTitle(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn btn-primary">
          <Plus size={16} /> Add Module
        </button>
      </form>

      {/* Modules & Lessons List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {modules.map((mod, mIndex) => (
          <div key={mod._id} className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                Module {mIndex + 1}: {mod.title}
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-sm btn-secondary" onClick={() => handleAddLesson(mod._id)}>
                  <Plus size={14} /> Add Lesson
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteModule(mod._id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Lessons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {mod.lessons?.map((les, lIndex) => (
                <div key={les._id || lIndex} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem 0.875rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <FileText size={15} color="var(--primary)" />
                    <span>{les.title}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{les.type}</span>
                </div>
              ))}
              {(!mod.lessons || mod.lessons.length === 0) && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>No lessons yet. Click "Add Lesson" above.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default TeacherEditCourse;
`);

// ============================================
// TEACHER STUDENTS
// ============================================
writeFile('pages/teacher/TeacherStudents.jsx', `import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { enrollmentService } from '../../services/dataService';
import { Users, Mail, BookOpen, Calendar } from 'lucide-react';

const TeacherStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await enrollmentService.getAllEnrollments();
      setStudents(res.data.data.enrollments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Enrolled Students</h1>
        <p style={{ color: 'var(--text-secondary)' }}>View students enrolled across your active courses.</p>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading students...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Enrolled On</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {students.map((e) => (
                  <tr key={e._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{e.student?.name || 'Student'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{e.student?.email}</div>
                    </td>
                    <td>{e.course?.title || 'Course'}</td>
                    <td>{new Date(e.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className="badge badge-primary">{e.progress || 0}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherStudents;
`);

// ============================================
// TEACHER QUIZZES
// ============================================
writeFile('pages/teacher/TeacherQuizzes.jsx', `import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { quizService, courseService } from '../../services/dataService';
import { HelpCircle, Plus, Trash2, CheckCircle } from 'lucide-react';

const TeacherQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [quizForm, setQuizForm] = useState({ title: '', course: '', passingScore: 70, timeLimit: 15 });

  useEffect(() => {
    fetchQuizzesAndCourses();
  }, []);

  const fetchQuizzesAndCourses = async () => {
    try {
      const qRes = await quizService.getTeacherQuizzes();
      setQuizzes(qRes.data.data.quizzes || []);
      const cRes = await courseService.getTeacherCourses();
      setCourses(cRes.data.data.courses || []);
      if (cRes.data.data.courses?.length > 0) {
        setQuizForm((prev) => ({ ...prev, course: cRes.data.data.courses[0]._id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      const res = await quizService.createQuiz({
        ...quizForm,
        questions: [
          {
            question: 'Sample Question 1',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 0,
            points: 10,
          },
        ],
      });
      setQuizzes([...quizzes, res.data.data.quiz]);
      setShowModal(false);
    } catch (err) {
      alert('Failed to create quiz');
    }
  };

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Quizzes</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Create and manage interactive assessments for your courses.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Create Quiz
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {quizzes.map((q) => (
          <div key={q._id} className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>{q.title}</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Course: {q.course?.title || 'General'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              <span>Passing: {q.passingScore}%</span>
              <span>Time: {q.timeLimit}m</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={handleCreateQuiz} className="card" style={{ width: 440, padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Create Quiz</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="text"
                className="input"
                placeholder="Quiz Title"
                value={quizForm.title}
                onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                required
              />
              <select className="select" value={quizForm.course} onChange={(e) => setQuizForm({ ...quizForm, course: e.target.value })}>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>{c.title}</option>
                ))}
              </select>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TeacherQuizzes;
`);

// ============================================
// TEACHER RESULTS
// ============================================
writeFile('pages/teacher/TeacherResults.jsx', `import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { resultService } from '../../services/dataService';
import { Award, CheckCircle, XCircle } from 'lucide-react';

const TeacherResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await resultService.getTeacherResults();
      setResults(res.data.data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Student Quiz Results</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Review assessment performance and submissions.</p>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading results...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Quiz</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r._id}>
                    <td style={{ fontWeight: 600 }}>{r.student?.name || 'Student'}</td>
                    <td>{r.quiz?.title || 'Quiz'}</td>
                    <td style={{ fontWeight: 700 }}>{r.score}%</td>
                    <td>
                      <span className={\`badge badge-\${r.passed ? 'success' : 'danger'}\`}>
                        {r.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </td>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherResults;
`);

// ============================================
// TEACHER ANNOUNCEMENTS
// ============================================
writeFile('pages/teacher/TeacherAnnouncements.jsx', `import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { announcementService, courseService } from '../../services/dataService';
import { Megaphone, Plus } from 'lucide-react';

const TeacherAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    fetchAnnouncements();
    courseService.getTeacherCourses().then((res) => {
      setCourses(res.data.data.courses || []);
      if (res.data.data.courses?.length > 0) setSelectedCourse(res.data.data.courses[0]._id);
    });
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await announcementService.getAnnouncements();
      setAnnouncements(res.data.data.announcements || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!title || !content) return;
    try {
      const res = await announcementService.createAnnouncement({ title, content, course: selectedCourse });
      setAnnouncements([res.data.data.announcement, ...announcements]);
      setTitle('');
      setContent('');
    } catch (err) {
      alert('Failed to post announcement');
    }
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Course Announcements</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Broadcast updates to your students in real-time.</p>
      </div>

      <form onSubmit={handlePost} className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>Create Announcement</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <select className="select" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>{c.title}</option>
            ))}
          </select>
          <input type="text" className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <textarea className="input" rows={3} placeholder="Message content..." value={content} onChange={(e) => setContent(e.target.value)} required />
          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end' }}>Post Announcement</button>
        </div>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {announcements.map((a) => (
          <div key={a._id} className="card" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontWeight: 700 }}>{a.title}</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0.5rem 0' }}>{a.content}</p>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(a.createdAt).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default TeacherAnnouncements;
`);

// ============================================
// TEACHER MESSAGES / CHAT
// ============================================
writeFile('pages/teacher/TeacherMessages.jsx', `import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { chatService } from '../../services/dataService';
import { useSocket } from '../../context/SocketContext';
import { MessageSquare, Send, User } from 'lucide-react';

const TeacherMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const socket = useSocket();

  useEffect(() => {
    chatService.getConversations().then((res) => {
      const convs = res.data.data.conversations || [];
      setConversations(convs);
      if (convs.length > 0) setActiveConv(convs[0]);
    });
  }, []);

  useEffect(() => {
    if (activeConv) {
      chatService.getMessages(activeConv._id).then((res) => {
        setMessages(res.data.data.messages || []);
      });
    }
  }, [activeConv]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !activeConv) return;
    try {
      const res = await chatService.sendMessage({ conversationId: activeConv._id, content: inputMsg });
      setMessages([...messages, res.data.data.message]);
      setInputMsg('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Teacher Messages</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Communicate directly with your students.</p>
      </div>

      <div className="card" style={{ height: '70vh', display: 'grid', gridTemplateColumns: '280px 1fr', overflow: 'hidden' }}>
        <div style={{ borderRight: '1px solid var(--border-color)', padding: '1rem', overflowY: 'auto' }}>
          <h4 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Conversations</h4>
          {conversations.map((c) => (
            <div
              key={c._id}
              onClick={() => setActiveConv(c)}
              style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: activeConv?._id === c._id ? 'var(--bg-secondary)' : 'transparent' }}
            >
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Student Chat</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.lastMessage?.content || 'No messages yet'}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ padding: '0.75rem 1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', alignSelf: 'flex-start', maxWidth: '70%' }}>
                <p style={{ fontSize: '0.875rem' }}>{m.content}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem', padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <input type="text" className="input" placeholder="Type a message..." value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} />
            <button type="submit" className="btn btn-primary"><Send size={16} /></button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherMessages;
`);

// ============================================
// TEACHER PROFILE
// ============================================
writeFile('pages/teacher/TeacherProfile.jsx', `import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/dataService';
import { User, Mail, Save, Lock } from 'lucide-react';

const TeacherProfile = () => {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await authService.updateProfile({ name, bio });
      setMsg('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    try {
      await authService.changePassword({ currentPassword, newPassword });
      setMsg('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      alert('Failed to change password');
    }
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>Teacher Profile & Settings</h1>
        {msg && <div style={{ padding: '0.75rem', background: 'rgba(34,197,94,0.15)', color: '#22c55e', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>{msg}</div>}

        <form onSubmit={handleUpdate} className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>Account Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" className="input" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <textarea className="input" rows={3} placeholder="Instructor Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end' }}><Save size={16} /> Save Profile</button>
          </div>
        </form>

        <form onSubmit={handlePassword} className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>Change Password</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="password" className="input" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            <input type="password" className="input" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <button type="submit" className="btn btn-secondary" style={{ alignSelf: 'flex-end' }}><Lock size={16} /> Change Password</button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default TeacherProfile;
`);

console.log('\\nBatch 2 (Public courses + Teacher pages) complete!');
