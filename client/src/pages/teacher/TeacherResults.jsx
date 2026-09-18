import { useState, useEffect } from 'react';
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
                      <span className={`badge badge-${r.passed ? 'success' : 'danger'}`}>
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
