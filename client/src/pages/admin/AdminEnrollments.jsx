import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { enrollmentService } from '../../services/dataService';
import toast from 'react-hot-toast';

const AdminEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);

  const fetch = async (page = 1) => {
    setLoading(true);
    try { const { data } = await enrollmentService.getAllEnrollments({ page, limit: 10 }); setEnrollments(data.enrollments); setPagination(data.pagination); } catch (e) { toast.error('Failed'); }
    setLoading(false);
  };
  useEffect(() => { fetch(); }, []);

  return (
    <DashboardLayout>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Enrollments</h2>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead><tr><th>Student</th><th>Course</th><th>Progress</th><th>Enrolled</th></tr></thead>
            <tbody>
              {loading ? Array(5).fill(0).map((_, i) => <tr key={i}><td colSpan={4}><div className="skeleton" style={{ height: 20 }} /></td></tr>) :
              enrollments.length === 0 ? <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No enrollments</td></tr> :
              enrollments.map(e => (
                <tr key={e._id}>
                  <td>{e.student?.name}</td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.course?.title}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="progress-bar" style={{ width: 80 }}><div className="progress-bar-fill" style={{ width: e.progress + '%' }} /></div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{e.progress}%</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{new Date(e.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {pagination.pages > 1 && <div className="pagination">{Array.from({ length: pagination.pages }, (_, i) => <button key={i} className={pagination.page === i + 1 ? 'active' : ''} onClick={() => fetch(i + 1)}>{i + 1}</button>)}</div>}
        </div>
      </div>
    </DashboardLayout>
  );
};
export default AdminEnrollments;