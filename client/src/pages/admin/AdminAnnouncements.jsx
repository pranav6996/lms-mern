import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { announcementService } from '../../services/dataService';
import { Plus, Trash2, X, Megaphone } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', content: '' });

  const fetch = async () => {
    setLoading(true);
    try { const { data } = await announcementService.getAnnouncements({ limit: 50 }); setAnnouncements(data.announcements); } catch(e) {}
    setLoading(false);
  };
  useEffect(() => { fetch(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try { await announcementService.createAnnouncement(form); toast.success('Announcement sent!'); setShowModal(false); setForm({ title: '', content: '' }); fetch(); } catch(e) { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    try { await announcementService.deleteAnnouncement(id); toast.success('Deleted'); fetch(); } catch(e) { toast.error('Failed'); }
  };

  return (
    <DashboardLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Announcements</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> New Announcement</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {loading ? Array(3).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 'var(--radius-lg)' }} />) :
          announcements.length === 0 ? <div className="empty-state"><Megaphone size={48} /><h3>No announcements</h3><p>Create your first announcement</p></div> :
          announcements.map(a => (
            <div key={a._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{a.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{a.content}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>By {a.sender?.name} • {new Date(a.createdAt).toLocaleDateString()}</p>
              </div>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(a._id)}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: 600 }}>New Announcement</h3>
                <button onClick={() => setShowModal(false)} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="form-group"><label className="form-label">Title</label><input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">Content</label><textarea className="form-textarea" value={form.content} onChange={e => setForm({...form, content: e.target.value})} required /></div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Send</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
export default AdminAnnouncements;