import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { courseService, categoryService } from '../../services/dataService';
import { BookOpen, Plus, Trash2, ArrowRight, Save, Layers } from 'lucide-react';

const TeacherCreateCourse = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    price: 0,
    status: 'draft',
    tags: '',
  });

  useEffect(() => {
    categoryService.getCategories().then((res) => {
      setCategories(res.data.data.categories || []);
      if (res.data.data.categories?.length > 0) {
        setFormData((prev) => ({ ...prev, category: res.data.data.categories[0]._id }));
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return alert('Course title is required');
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : [],
      };
      const res = await courseService.createCourse(payload);
      const newCourseId = res.data.data.course._id;
      navigate(`/teacher/courses/${newCourseId}/edit`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create course');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Create New Course</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Set up basic course details and proceed to building your curriculum.</p>
        </div>

        <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Course Title *</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Master Modern Web Development"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Course Description *</label>
              <textarea
                className="input"
                rows={4}
                placeholder="Comprehensive summary of what students will learn..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Category</label>
                <select className="select" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Difficulty Level</label>
                <select className="select" value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Price ($ USD)</label>
                <input
                  type="number"
                  min="0"
                  className="input"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Tags (comma-separated)</label>
              <input
                type="text"
                className="input"
                placeholder="react, nodejs, javascript, web"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/teacher/courses')}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Creating...' : 'Continue to Curriculum'} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default TeacherCreateCourse;
