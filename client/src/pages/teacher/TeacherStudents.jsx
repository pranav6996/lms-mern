import { useState, useEffect } from 'react';
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
