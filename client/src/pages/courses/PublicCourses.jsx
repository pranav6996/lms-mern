import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courseService, categoryService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import { Search, Filter, BookOpen, Clock, Users, Star, ArrowRight, Sparkles, GraduationCap } from 'lucide-react';

const PublicCourses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [search, selectedCategory, selectedLevel, sortBy]);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategories();
      setCategories(res.data.data.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {
        sort: sortBy === 'rating' ? '-rating.average' : sortBy === 'popular' ? '-enrollmentCount' : '-createdAt',
      };
      if (search) params.search = search;
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedLevel !== 'all') params.level = selectedLevel;

      const res = await courseService.getCourses(params);
      setCourses(res.data.data.courses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={20} color="white" />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>LearnHub</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {user ? (
              <Link to="/dashboard" className="btn btn-sm btn-primary">My Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm btn-secondary">Login</Link>
                <Link to="/register" className="btn btn-sm btn-primary">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Catalog Content */}
      <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Explore Courses</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto' }}>
            Discover expert-led courses designed to take your skills to the next level.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="input"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
            <select className="select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            <select className="select" value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <select className="select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="createdAt">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ width: 40, height: 40, border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-muted)' }}>Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <BookOpen size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No Courses Found</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Try adjusting your search criteria or category filter.</p>
            <button className="btn btn-secondary" onClick={() => { setSearch(''); setSelectedCategory('all'); setSelectedLevel('all'); }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {courses.map((course) => (
              <div key={course._id} className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 160, background: 'linear-gradient(135deg, rgb(99 102 241 / 0.3), rgb(14 165 233 / 0.3))', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <BookOpen size={48} color="var(--primary)" />
                  )}
                  <span className="badge badge-primary" style={{ position: 'absolute', top: 12, right: 12, textTransform: 'capitalize' }}>
                    {course.level || 'All Levels'}
                  </span>
                </div>
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase' }}>
                      {course.category?.name || 'General'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.4 }}>
                    {course.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {course.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginBottom: '1rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Users size={15} />
                      <span>{course.enrollmentCount || 0} students</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Star size={15} color="#f59e0b" fill="#f59e0b" />
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{course.rating?.average?.toFixed(1) || '5.0'}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: course.price > 0 ? 'var(--accent)' : 'var(--success)', fontSize: '0.9375rem' }}>
                      {course.price > 0 ? `$${course.price}` : 'FREE'}
                    </span>
                  </div>
                  <Link to={`/courses/${course._id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    View Course <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicCourses;
