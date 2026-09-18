import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { quizService } from '../../services/dataService';
import { Clock, CheckCircle, ArrowRight } from 'lucide-react';

const StudentQuizTake = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    quizService.getQuiz(quizId).then((res) => {
      setQuiz(res.data.data.quiz);
      setLoading(false);
    });
  }, [quizId]);

  const handleOptionSelect = (qIdx, optIdx) => {
    setAnswers({ ...answers, [qIdx]: optIdx });
  };

  const handleSubmit = async () => {
    try {
      const formattedAnswers = Object.entries(answers).map(([qIdx, optIdx]) => ({
        questionId: quiz.questions[qIdx]?._id || qIdx,
        selectedAnswer: optIdx,
      }));
      const res = await quizService.submitQuiz(quizId, formattedAnswers);
      setResult(res.data.data.result);
      setSubmitted(true);
    } catch (err) {
      alert('Failed to submit quiz');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p style={{ color: 'var(--text-muted)' }}>Loading Quiz...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (submitted && result) {
    return (
      <DashboardLayout>
        <div className="card" style={{ maxWidth: 600, margin: '2rem auto', padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>Quiz Results</h2>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: result.passed ? 'var(--success)' : 'var(--danger)', marginBottom: '0.5rem' }}>
            {result.score}%
          </div>
          <span className={`badge badge-${result.passed ? 'success' : 'danger'}`} style={{ fontSize: '0.9375rem', padding: '0.375rem 0.75rem' }}>
            {result.passed ? 'CONGRATULATIONS - PASSED' : 'NEEDS IMPROVEMENT - FAILED'}
          </span>
          <div style={{ marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={() => navigate('/student/quizzes')}>Back to Quizzes</button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{quiz?.title}</h1>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Passing Score: {quiz?.passingScore}%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--primary)' }}>
            <Clock size={18} />
            <span style={{ fontWeight: 600 }}>{quiz?.timeLimit} mins</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {quiz?.questions?.map((q, qIdx) => (
            <div key={q._id || qIdx} className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                Question {qIdx + 1}: {q.question}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {q.options?.map((opt, optIdx) => (
                  <label
                    key={optIdx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      background: answers[qIdx] === optIdx ? 'rgba(99,102,241,0.15)' : 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      border: answers[qIdx] === optIdx ? '1px solid var(--primary)' : '1px solid transparent',
                    }}
                  >
                    <input
                      type="radio"
                      name={`question-${qIdx}`}
                      checked={answers[qIdx] === optIdx}
                      onChange={() => handleOptionSelect(qIdx, optIdx)}
                    />
                    <span style={{ fontSize: '0.875rem' }}>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button className="btn btn-primary btn-lg" style={{ alignSelf: 'flex-end', marginTop: '1rem' }} onClick={handleSubmit}>
            Submit Quiz
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentQuizTake;
