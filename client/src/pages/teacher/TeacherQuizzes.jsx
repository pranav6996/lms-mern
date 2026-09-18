import { useState, useEffect } from 'react';
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
