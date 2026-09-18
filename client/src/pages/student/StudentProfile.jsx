import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/dataService';
import { User, Mail, Save, Lock } from 'lucide-react';

const StudentProfile = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await authService.updateProfile({ name });
      setMsg('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    try {
      await authService.changePassword({ currentPassword, newPassword });
      setMsg('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      alert('Failed to change password');
    }
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>Student Profile & Settings</h1>
        {msg && <div style={{ padding: '0.75rem', background: 'rgba(34,197,94,0.15)', color: '#22c55e', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>{msg}</div>}

        <form onSubmit={handleUpdate} className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>Personal Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" className="input" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end' }}><Save size={16} /> Save Changes</button>
          </div>
        </form>

        <form onSubmit={handlePassword} className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>Change Password</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="password" className="input" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            <input type="password" className="input" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <button type="submit" className="btn btn-secondary" style={{ alignSelf: 'flex-end' }}><Lock size={16} /> Update Password</button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;
