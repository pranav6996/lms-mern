import { useState, useEffect } from 'react';
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
      navigate('/login', { state: { from: `/courses/${courseId}` } });
      return;
    }
    setEnrolling(true);
    try {
      await enrollmentService.enroll(courseId);
      setIsEnrolled(true);
      navigate(`/student/courses/${courseId}`);
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
                  {course.price > 0 ? `$${course.price}` : 'FREE'}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Full lifetime access</span>
              </div>
              {isEnrolled ? (
                <Link to={`/student/courses/${course._id}`} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
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
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{les.duration ? `${les.duration} mins` : 'Lesson'}</span>
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
