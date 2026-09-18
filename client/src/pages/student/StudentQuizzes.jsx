import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { quizService } from '../../services/dataService';
import { HelpCircle, Play, CheckCircle } from 'lucide-react';

const StudentQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    quizService.getTeacherQuizzes().then((res) => {
      setQuizzes(res.data.data.quizzes || []);
    });
  }, []);

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Available Quizzes</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Test your knowledge and earn course certificates.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {quizzes.map((q) => (
          <div key={q._id} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>{q.title}</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem', flex: 1 }}>
              Course: {q.course?.title || 'General Assessment'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              <span>Passing: {q.passingScore}%</span>
              <span>Time: {q.timeLimit}m</span>
            </div>
            <Link to={`/student/quizzes/${q._id}`} className="btn btn-primary btn-sm" style={{ justifyContent: 'center' }}>
              <Play size={14} /> Start Quiz
            </Link>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default StudentQuizzes;
