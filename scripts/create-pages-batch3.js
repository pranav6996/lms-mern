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
// STUDENT DASHBOARD
// ============================================
writeFile('pages/student/StudentDashboard.jsx', `import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { enrollmentService, resultService } from '../../services/dataService';
import { BookOpen, Award, CheckCircle, Clock, ArrowRight, Play } from 'lucide-react';

const StudentDashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const eRes = await enrollmentService.getMyEnrollments();
      setEnrollments(eRes.data.data.enrollments || []);
      const rRes = await resultService.getMyResults();
      setResults(rRes.data.data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const completedCount = enrollments.filter((e) => e.progress === 100).length;

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Student Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track your progress and continue learning.</p>
        </div>
        <Link to="/courses" className="btn btn-primary">
          <BookOpen size={18} /> Browse More Courses
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {[
          { label: 'Enrolled Courses', value: enrollments.length, icon: BookOpen, color: 'var(--primary)' },
          { label: 'Completed Courses', value: completedCount, icon: CheckCircle, color: 'var(--success)' },
          { label: 'Quizzes Taken', value: results.length, icon: Award, color: 'var(--secondary)' },
          { label: 'Average Score', value: results.length > 0 ? \`\${Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)}%\` : 'N/A', icon: Clock, color: '#f59e0b' },
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

      {/* Enrolled Courses */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>My Courses</h3>
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading courses...</p>
        ) : enrollments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>You are not enrolled in any courses yet.</p>
            <Link to="/courses" className="btn btn-secondary">Explore Catalog</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {enrollments.map((e) => (
              <div key={e._id} className="card" style={{ padding: '1.25rem', background: 'var(--bg-secondary)' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem' }}>{e.course?.title}</h4>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.375rem' }}>
                    <span>Progress</span>
                    <span>{e.progress || 0}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: \`\${e.progress || 0}%\` }} />
                  </div>
                </div>
                <Link to={\`/student/courses/\${e.course?._id}\`} className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                  <Play size={14} /> Continue Learning
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
`);

// ============================================
// STUDENT COURSES LIST
// ============================================
writeFile('pages/student/StudentCourses.jsx', `import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { enrollmentService } from '../../services/dataService';
import { BookOpen, Play } from 'lucide-react';

const StudentCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    enrollmentService.getMyEnrollments().then((res) => {
      setEnrollments(res.data.data.enrollments || []);
      setLoading(false);
    });
  }, []);

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Enrolled Courses</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Access your learning materials anytime.</p>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      ) : enrollments.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <BookOpen size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3>No Enrolled Courses</h3>
          <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>Discover new skills in our course catalog.</p>
          <Link to="/courses" className="btn btn-primary">Browse Catalog</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {enrollments.map((e) => (
            <div key={e._id} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem' }}>{e.course?.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', flex: 1, marginBottom: '1rem' }}>{e.course?.description}</p>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  <span>Completed</span>
                  <span>{e.progress || 0}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: \`\${e.progress || 0}%\` }} />
                </div>
              </div>
              <Link to={\`/student/courses/\${e.course?._id}\`} className="btn btn-primary btn-sm" style={{ justifyContent: 'center' }}>
                <Play size={14} /> Open Course
              </Link>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentCourses;
`);

// ============================================
// STUDENT COURSE LEARN / PLAYER
// ============================================
writeFile('pages/student/StudentCourseLearn.jsx', `import { useState, useEffect } from 'react';
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
`);

// ============================================
// STUDENT PROGRESS
// ============================================
writeFile('pages/student/StudentProgress.jsx', `import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { enrollmentService } from '../../services/dataService';
import { Award, CheckCircle } from 'lucide-react';

const StudentProgress = () => {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    enrollmentService.getMyEnrollments().then((res) => {
      setEnrollments(res.data.data.enrollments || []);
    });
  }, []);

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Learning Progress</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track milestone completion across all enrolled courses.</p>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {enrollments.map((e) => (
            <div key={e._id} style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700 }}>{e.course?.title}</span>
                <span className="badge badge-primary">{e.progress || 0}% Complete</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: \`\${e.progress || 0}%\` }} />
              </div>
            </div>
          ))}
          {enrollments.length === 0 && (
            <p style={{ color: 'var(--text-muted)' }}>No progress recorded yet.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentProgress;
`);

// ============================================
// STUDENT QUIZZES LIST
// ============================================
writeFile('pages/student/StudentQuizzes.jsx', `import { useState, useEffect } from 'react';
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
            <Link to={\`/student/quizzes/\${q._id}\`} className="btn btn-primary btn-sm" style={{ justifyContent: 'center' }}>
              <Play size={14} /> Start Quiz
            </Link>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default StudentQuizzes;
`);

// ============================================
// STUDENT QUIZ TAKE INTERFACE
// ============================================
writeFile('pages/student/StudentQuizTake.jsx', `import { useState, useEffect } from 'react';
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
          <span className={\`badge badge-\${result.passed ? 'success' : 'danger'}\`} style={{ fontSize: '0.9375rem', padding: '0.375rem 0.75rem' }}>
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
                      name={\`question-\${qIdx}\`}
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
`);

// ============================================
// STUDENT RESULTS
// ============================================
writeFile('pages/student/StudentResults.jsx', `import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { resultService } from '../../services/dataService';
import { Award } from 'lucide-react';

const StudentResults = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    resultService.getMyResults().then((res) => {
      setResults(res.data.data.results || []);
    });
  }, []);

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Quiz Results</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Review historical quiz attempts and scores.</p>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <table className="table" style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>Quiz</th>
              <th>Score</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r._id}>
                <td style={{ fontWeight: 600 }}>{r.quiz?.title || 'Quiz'}</td>
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
    </DashboardLayout>
  );
};

export default StudentResults;
`);

// ============================================
// STUDENT MESSAGES
// ============================================
writeFile('pages/student/StudentMessages.jsx', `import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { chatService } from '../../services/dataService';
import { Send } from 'lucide-react';

const StudentMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');

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
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Student Messages</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Chat with instructors and support.</p>
      </div>

      <div className="card" style={{ height: '70vh', display: 'grid', gridTemplateColumns: '260px 1fr', overflow: 'hidden' }}>
        <div style={{ borderRight: '1px solid var(--border-color)', padding: '1rem', overflowY: 'auto' }}>
          <h4 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Conversations</h4>
          {conversations.map((c) => (
            <div
              key={c._id}
              onClick={() => setActiveConv(c)}
              style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: activeConv?._id === c._id ? 'var(--bg-secondary)' : 'transparent' }}
            >
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Instructor Discussion</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.lastMessage?.content || 'No messages yet'}</div>
            </div>
          ))}
          {conversations.length === 0 && <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>No conversations active.</p>}
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

export default StudentMessages;
`);

// ============================================
// STUDENT NOTIFICATIONS
// ============================================
writeFile('pages/student/StudentNotifications.jsx', `import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { notificationService } from '../../services/dataService';
import { Bell, CheckCircle } from 'lucide-react';

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    notificationService.getNotifications().then((res) => {
      setNotifications(res.data.data.notifications || []);
    });
  }, []);

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Notifications</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Stay updated with course announcements and activity.</p>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map((n) => (
            <div key={n._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{n.title}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{n.message}</div>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(n.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
          {notifications.length === 0 && (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No notifications found.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentNotifications;
`);

// ============================================
// STUDENT PROFILE
// ============================================
writeFile('pages/student/StudentProfile.jsx', `import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/dataService';
import { User, Mail, Save, Lock } from 'lucide-react';

const StudentProfile = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await authService.updateProfile({ name });
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
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>Student Profile & Settings</h1>
        {msg && <div style={{ padding: '0.75rem', background: 'rgba(34,197,94,0.15)', color: '#22c55e', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>{msg}</div>}

        <form onSubmit={handleUpdate} className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>Personal Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" className="input" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end' }}><Save size={16} /> Save Changes</button>
          </div>
        </form>

        <form onSubmit={handlePassword} className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>Change Password</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="password" className="input" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            <input type="password" className="input" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <button type="submit" className="btn btn-secondary" style={{ alignSelf: 'flex-end' }}><Lock size={16} /> Update Password</button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;
`);

console.log('\\nBatch 3 (Student pages) complete!');
