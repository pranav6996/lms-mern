import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { courseService } from '../../services/dataService';
import { Search, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCourses = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await courseService.getAdminCourses({ page, limit: 10, search, status });
      setCourses(data.courses);
      setPagination(data.pagination);
    } catch (e) { toast.error('Failed to fetch courses'); }
    setLoading(false);
  };

  useEffect(() => { fetchCourses(); }, [search, status]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course and all its content?')) return;
    try {
      await courseService.deleteCourse(id);
      toast.success('Course deleted');
      fetchCourses();
    } catch (e) { toast.error('Failed'); }
  };

  const handlePublish = async (id) => {
    try {
      await courseService.publishCourse(id);
      toast.success('Course status updated');
      fetchCourses();
    } catch (e) { toast.error('Failed'); }
  };

  return (
    <DashboardLayout>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Courses</h2>
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: '2.25rem' }} />
          </div>
          <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: 'auto' }}>
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead><tr><th>Course</th><th>Teacher</th><th>Category</th><th>Students</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? Array(5).fill(0).map((_, i) => <tr key={i}><td colSpan={6}><div className="skeleton" style={{ height: 20 }} /></td></tr>) :
              courses.length === 0 ? <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No courses found</td></tr> :
              courses.map(c => (
                <tr key={c._id}>
                  <td style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>{c.title}</td>
                  <td>{c.teacher?.name}</td>
                  <td>{c.category?.name}</td>
                  <td>{c.enrolledStudents}</td>
                  <td><span className={`badge badge-${c.status === 'published' ? 'success' : c.status === 'draft' ? 'warning' : 'danger'}`}>{c.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <Link to={`/courses/${c._id}`} className="btn btn-sm btn-secondary"><Eye size={14} /></Link>
                      <button className="btn btn-sm btn-secondary" onClick={() => handlePublish(c._id)}>{c.status === 'published' ? <XCircle size={14} /> : <CheckCircle size={14} />}</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c._id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pagination.pages > 1 && <div className="pagination">{Array.from({ length: pagination.pages }, (_, i) => <button key={i} className={pagination.page === i + 1 ? 'active' : ''} onClick={() => fetchCourses(i + 1)}>{i + 1}</button>)}</div>}
        </div>
      </div>
    </DashboardLayout>
  );
};
export default AdminCourses;