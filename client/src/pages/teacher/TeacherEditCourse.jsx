import { useState, useEffect } from 'react';
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
          <p style={{ color: 'var(--text-secondary)' }}>Status: <span className={`badge badge-${course?.status === 'published' ? 'success' : 'warning'}`}>{course?.status}</span></p>
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
