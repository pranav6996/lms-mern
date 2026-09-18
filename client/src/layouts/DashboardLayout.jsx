import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { notificationService } from '../services/dataService';
import {
  LayoutDashboard, Users, BookOpen, GraduationCap, PlusCircle, BarChart3,
  MessageSquare, Bell, Settings, User, LogOut, Menu, X, ChevronDown,
  FolderOpen, ClipboardList, Award, Megaphone, BookMarked, TrendingUp,
  CheckCircle, Layers
} from 'lucide-react';
import toast from 'react-hot-toast';

const sidebarConfig = {
  admin: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Users', icon: Users, path: '/admin/users' },
    { label: 'Courses', icon: BookOpen, path: '/admin/courses' },
    { label: 'Categories', icon: FolderOpen, path: '/admin/categories' },
    { label: 'Enrollments', icon: GraduationCap, path: '/admin/enrollments' },
    { label: 'Announcements', icon: Megaphone, path: '/admin/announcements' },
    { label: 'Profile', icon: User, path: '/admin/profile' },
  ],
  teacher: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/teacher' },
    { label: 'My Courses', icon: BookOpen, path: '/teacher/courses' },
    { label: 'Create Course', icon: PlusCircle, path: '/teacher/courses/create' },
    { label: 'Students', icon: Users, path: '/teacher/students' },
    { label: 'Quizzes', icon: ClipboardList, path: '/teacher/quizzes' },
    { label: 'Results', icon: Award, path: '/teacher/results' },
    { label: 'Announcements', icon: Megaphone, path: '/teacher/announcements' },
    { label: 'Messages', icon: MessageSquare, path: '/teacher/messages' },
    { label: 'Profile', icon: User, path: '/teacher/profile' },
  ],
  student: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/student' },
    { label: 'Browse Courses', icon: BookOpen, path: '/courses' },
    { label: 'My Courses', icon: BookMarked, path: '/student/courses' },
    { label: 'Progress', icon: TrendingUp, path: '/student/progress' },
    { label: 'Quizzes', icon: ClipboardList, path: '/student/quizzes' },
    { label: 'Results', icon: Award, path: '/student/results' },
    { label: 'Messages', icon: MessageSquare, path: '/student/messages' },
    { label: 'Notifications', icon: Bell, path: '/student/notifications' },
    { label: 'Profile', icon: User, path: '/student/profile' },
  ],
};

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { socket } = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifDropdown, setNotifDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const menuItems = sidebarConfig[user?.role] || [];

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await notificationService.getNotifications({ limit: 5 });
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      } catch (e) { /* ignore */ }
    };
    if (user) fetchNotifications();
  }, [user, location.pathname]);

  useEffect(() => {
    if (socket) {
      socket.on('new:notification', (notification) => {
        setNotifications((prev) => [notification, ...prev].slice(0, 5));
        setUnreadCount((prev) => prev + 1);
        toast(notification.title || 'New notification', { icon: '🔔' });
      });
      return () => socket.off('new:notification');
    }
  }, [socket]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) { /* ignore */ }
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="dashboard-layout">
      {/* Sidebar Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={18} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.125rem' }}>LearnHub</span>
          </Link>
          <button onClick={closeSidebar} style={{ display: 'none', color: 'var(--text-secondary)' }} className="md-hidden-btn">
            <X size={20} />
          </button>
        </div>

        <nav style={{ padding: '0.75rem', flex: 1 }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '0.125rem',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'white' : 'var(--text-secondary)',
                  background: isActive ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))' : 'transparent',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => { if (!isActive) e.target.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={(e) => { if (!isActive) e.target.style.background = 'transparent'; }}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.875rem',
              borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: 'var(--danger)',
              width: '100%', transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => e.target.style.background = 'var(--bg-hover)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => setSidebarOpen(true)} style={{ color: 'var(--text-secondary)', display: 'none' }} className="menu-toggle">
              <Menu size={22} />
            </button>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
              {menuItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => { setNotifDropdown(!notifDropdown); setProfileDropdown(false); }}
                style={{ position: 'relative', color: 'var(--text-secondary)', padding: '0.5rem' }}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: 2, right: 2, width: 18, height: 18,
                    background: 'var(--danger)', borderRadius: '50%', fontSize: '0.625rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700,
                  }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {notifDropdown && (
                <div style={{
                  position: 'absolute', right: 0, top: '100%', marginTop: 8, width: 320,
                  background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', zIndex: 100,
                  overflow: 'hidden',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead} style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No notifications</p>
                    ) : (
                      notifications.map((n) => (
                        <div key={n._id} style={{
                          padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)',
                          background: n.isRead ? 'transparent' : 'rgb(99 102 241 / 0.05)',
                        }}>
                          <p style={{ fontSize: '0.8125rem', fontWeight: n.isRead ? 400 : 600 }}>{n.title}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => { setProfileDropdown(!profileDropdown); setNotifDropdown(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem' }}
              >
                <div className="avatar avatar-sm">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    user?.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>{user?.name}</span>
                <ChevronDown size={14} color="var(--text-muted)" />
              </button>

              {profileDropdown && (
                <div style={{
                  position: 'absolute', right: 0, top: '100%', marginTop: 8, width: 200,
                  background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', zIndex: 100,
                  overflow: 'hidden',
                }}>
                  <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)' }}>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{user?.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</p>
                    <span className="badge badge-primary" style={{ marginTop: '0.25rem' }}>{user?.role}</span>
                  </div>
                  <Link
                    to={`/${user?.role}/profile`}
                    onClick={() => setProfileDropdown(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}
                  >
                    <User size={14} /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', fontSize: '0.8125rem', color: 'var(--danger)', width: '100%' }}
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="dashboard-content" onClick={() => { setNotifDropdown(false); setProfileDropdown(false); }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .menu-toggle { display: block !important; }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
