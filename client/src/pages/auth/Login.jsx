import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    const map = { admin: '/admin', teacher: '/teacher', student: '/student' };
    navigate(map[user.role] || '/', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const loggedUser = await login(form);
      toast.success(`Welcome back, ${loggedUser.name}!`);
      const map = { admin: '/admin', teacher: '/teacher', student: '/student' };
      navigate(map[loggedUser.role] || '/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={22} color="white" />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>LearnHub</span>
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Welcome back</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.875rem' }}>Sign in to continue learning</p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  autoComplete="current-password"
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
              <Link to="/forgot-password" style={{ fontSize: '0.8125rem', color: 'var(--primary)' }}>Forgot password?</Link>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 500 }}>Sign up</Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="card" style={{ marginTop: '1rem', padding: '1rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.5rem' }}>Demo Accounts</p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { label: 'Admin', email: 'admin@example.com' },
              { label: 'Teacher', email: 'teacher@example.com' },
              { label: 'Student', email: 'student@example.com' },
            ].map((demo) => (
              <button
                key={demo.email}
                onClick={() => setForm({ email: demo.email, password: 'Password123!' })}
                className="btn btn-sm btn-secondary"
                style={{ fontSize: '0.75rem' }}
              >
                {demo.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
