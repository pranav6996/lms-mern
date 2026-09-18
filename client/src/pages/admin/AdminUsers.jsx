import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { userService } from '../../services/dataService';
import { Search, Plus, Edit, Trash2, UserCheck, UserX, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState(() => {
    if (location.pathname.includes('students')) return 'student';
    if (location.pathname.includes('teachers')) return 'teacher';
    return '';
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await userService.getUsers({ page, limit: 10, search, role: roleFilter });
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (e) { toast.error('Failed to fetch users'); }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, [search, roleFilter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (editUser) {
        await userService.updateUser(editUser._id, form);
        toast.success('User updated');
      } else {
        await userService.createUser(form);
        toast.success('User created');
      }
      setShowModal(false); setEditUser(null); setForm({ name: '', email: '', password: '', role: 'student' });
      fetchUsers();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const handleToggleActive = async (user) => {
    try {
      await userService.updateUser(user._id, { isActive: !user.isActive });
      toast.success(user.isActive ? 'User deactivated' : 'User activated');
      fetchUsers();
    } catch (e) { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await userService.deleteUser(id);
      toast.success('User deleted');
      fetchUsers();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  return (
    <DashboardLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Users</h2>
          <button className="btn btn-primary" onClick={() => { setEditUser(null); setForm({ name: '', email: '', password: '', role: 'teacher' }); setShowModal(true); }}>
            <Plus size={16} /> Add User
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: '2.25rem' }} />
          </div>
          <select className="form-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ width: 'auto', minWidth: 120 }}>
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={6}><div className="skeleton" style={{ height: 20, width: '100%' }} /></td></tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No users found</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id}>
                    <td style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="avatar avatar-sm">{u.profileImage ? <img src={u.profileImage} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : u.name?.charAt(0).toUpperCase()}</div>
                      {u.name}
                    </td>
                    <td>{u.email}</td>
                    <td><span className={`badge badge-${u.role === 'admin' ? 'danger' : u.role === 'teacher' ? 'info' : 'primary'}`}>{u.role}</span></td>
                    <td><span className={`badge badge-${u.isActive ? 'success' : 'warning'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button className="btn btn-sm btn-secondary" onClick={() => { setEditUser(u); setForm({ name: u.name, email: u.email, role: u.role, password: '' }); setShowModal(true); }}><Edit size={14} /></button>
                        <button className="btn btn-sm btn-secondary" onClick={() => handleToggleActive(u)}>{u.isActive ? <UserX size={14} /> : <UserCheck size={14} />}</button>
                        {u.role !== 'admin' && <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u._id)}><Trash2 size={14} /></button>}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {pagination.pages > 1 && (
            <div className="pagination">
              {Array.from({ length: pagination.pages }, (_, i) => (
                <button key={i} className={pagination.page === i + 1 ? 'active' : ''} onClick={() => fetchUsers(i + 1)}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{editUser ? 'Edit User' : 'Create User'}</h3>
                <button onClick={() => setShowModal(false)} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
                {!editUser && <div className="form-group"><label className="form-label">Password</label><input type="password" className="form-input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} /></div>}
                <div className="form-group"><label className="form-label">Role</label><select className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="student">Student</option><option value="teacher">Teacher</option></select></div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editUser ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
export default AdminUsers;