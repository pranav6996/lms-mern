import { useState, useEffect } from 'react';
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
                <span className={`badge badge-${course.status === 'published' ? 'success' : 'warning'}`} style={{ position: 'absolute', top: 12, right: 12 }}>
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
                  <span>{course.price > 0 ? `$${course.price}` : 'FREE'}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link to={`/teacher/courses/${course._id}/edit`} className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
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
