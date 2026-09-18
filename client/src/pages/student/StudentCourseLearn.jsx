import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { courseService, moduleService, progressService } from '../../services/dataService';
import { Play, CheckCircle, FileText, ChevronRight, HelpCircle } from 'lucide-react';

const StudentCourseLearn = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const cRes = await courseService.getCourse(courseId);
      setCourse(cRes.data.data.course);
      const mRes = await moduleService.getModules(courseId);
      const mods = mRes.data.data.modules || [];
      setModules(mods);
      if (mods.length > 0 && mods[0].lessons?.length > 0) {
        setCurrentLesson(mods[0].lessons[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!currentLesson) return;
    try {
      await progressService.updateProgress(courseId, currentLesson._id);
      alert('Lesson marked as completed!');
    } catch (err) {
      console.error(err);
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
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Main Content Viewer */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{currentLesson ? currentLesson.title : 'Select a lesson'}</h2>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Course: {course?.title}</span>
            </div>
            {currentLesson && (
              <button className="btn btn-success btn-sm" onClick={handleMarkComplete}>
                <CheckCircle size={15} /> Mark Complete
              </button>
            )}
          </div>

          {currentLesson ? (
            <div style={{ minHeight: 350, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {currentLesson.type === 'video' && currentLesson.videoUrl ? (
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', background: 'black' }}>
                  <iframe
                    src={currentLesson.videoUrl}
                    title={currentLesson.title}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                    allowFullScreen
                  />
                </div>
              ) : (
                <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', lineHeight: 1.7, fontSize: '0.9375rem' }}>
                  {currentLesson.content || 'Welcome to this lesson. Read through the materials and click Mark Complete when finished.'}
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No lesson selected.</p>
          )}
        </div>

        {/* Curriculum Sidebar */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>Curriculum</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {modules.map((m, mIdx) => (
              <div key={m._id || mIdx}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.375rem' }}>
                  Module {mIdx + 1}: {m.title}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {m.lessons?.map((les, lIdx) => (
                    <div
                      key={les._id || lIdx}
                      onClick={() => setCurrentLesson(les)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        fontSize: '0.8125rem',
                        background: currentLesson?._id === les._id ? 'var(--primary)' : 'var(--bg-secondary)',
                        color: currentLesson?._id === les._id ? 'white' : 'var(--text-primary)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <Play size={13} />
                        <span>{les.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentCourseLearn;
