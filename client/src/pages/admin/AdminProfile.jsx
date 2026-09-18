import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/dataService';
import { Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminProfile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', bio: user?.bio || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...form };
      if (profileImage) data.profileImage = profileImage;
      const res = await authService.updateProfile(data);
      updateUser(res.data.user);
      toast.success('Profile updated');
    } catch (e) { toast.error('Failed'); }
    setLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await authService.changePassword(pwForm);
      toast.success('Password changed');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 600 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Profile</h2>
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <form onSubmit={handleUpdate}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative' }}>
                <div className="avatar avatar-lg">{user?.profileImage ? <img src={user.profileImage} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : user?.name?.charAt(0).toUpperCase()}</div>
                <label style={{ position: 'absolute', bottom: -2, right: -2, width: 24, height: 24, background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Camera size={12} color="white" />
                  <input type="file" accept="image/*" onChange={e => setProfileImage(e.target.files[0])} style={{ display: 'none' }} />
                </label>
              </div>
              <div>
                <h3 style={{ fontWeight: 600 }}>{user?.name}</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{user?.email}</p>
              </div>
            </div>
            <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Bio</label><textarea className="form-textarea" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} /></div>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
          </form>
        </div>
        <div className="card">
          <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Change Password</h3>
          <form onSubmit={handleChangePassword}>
            <div className="form-group"><label className="form-label">Current Password</label><input type="password" className="form-input" value={pwForm.currentPassword} onChange={e => setPwForm({...pwForm, currentPassword: e.target.value})} required /></div>
            <div className="form-group"><label className="form-label">New Password</label><input type="password" className="form-input" value={pwForm.newPassword} onChange={e => setPwForm({...pwForm, newPassword: e.target.value})} required minLength={6} /></div>
            <button type="submit" className="btn btn-primary">Change Password</button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};
export default AdminProfile;