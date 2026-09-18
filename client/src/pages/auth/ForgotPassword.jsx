import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/dataService';
import { GraduationCap, ArrowLeft, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success('Reset link sent! Check your inbox.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Reset Password</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.875rem' }}>Enter your email to receive a reset link</p>
        </div>
        <div className="card" style={{ padding: '2rem' }}>
          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <Mail size={48} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>Check your email</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>We sent a password reset link to <strong>{email}</strong></p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link to="/login" style={{ color: 'var(--primary)', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <ArrowLeft size={14} /> Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;