import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { categoryService } from '../../services/dataService';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const fetch = async () => {
    setLoading(true);
    try { const { data } = await categoryService.getAllCategories(); setCategories(data.categories); } catch (e) { toast.error('Failed'); }
    setLoading(false);
  };
  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCat) { await categoryService.updateCategory(editCat._id, form); toast.success('Updated'); }
      else { await categoryService.createCategory(form); toast.success('Created'); }
      setShowModal(false); setEditCat(null); setForm({ name: '', description: '' }); fetch();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try { await categoryService.deleteCategory(id); toast.success('Deleted'); fetch(); } catch (e) { toast.error('Failed'); }
  };

  return (
    <DashboardLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Categories</h2>
          <button className="btn btn-primary" onClick={() => { setEditCat(null); setForm({ name: '', description: '' }); setShowModal(true); }}><Plus size={16} /> Add Category</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {loading ? Array(4).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 'var(--radius-lg)' }} />) :
          categories.map(cat => (
            <div key={cat._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{cat.name}</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{cat.description || 'No description'}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <button className="btn btn-sm btn-secondary" onClick={() => { setEditCat(cat); setForm({ name: cat.name, description: cat.description }); setShowModal(true); }}><Edit size={14} /></button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(cat._id)}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: 600 }}>{editCat ? 'Edit' : 'Add'} Category</h3>
                <button onClick={() => setShowModal(false)} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editCat ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
export default AdminCategories;