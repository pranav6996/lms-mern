import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

// Lazy loaded pages
const Landing = lazy(() => import('../pages/landing/Landing'));
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));
const PublicCourses = lazy(() => import('../pages/courses/PublicCourses'));
const CourseDetail = lazy(() => import('../pages/courses/CourseDetail'));

// Admin pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers'));
const AdminCourses = lazy(() => import('../pages/admin/AdminCourses'));
const AdminCategories = lazy(() => import('../pages/admin/AdminCategories'));
const AdminEnrollments = lazy(() => import('../pages/admin/AdminEnrollments'));
const AdminAnnouncements = lazy(() => import('../pages/admin/AdminAnnouncements'));
const AdminProfile = lazy(() => import('../pages/admin/AdminProfile'));

// Teacher pages
const TeacherDashboard = lazy(() => import('../pages/teacher/TeacherDashboard'));
const TeacherCourses = lazy(() => import('../pages/teacher/TeacherCourses'));
const TeacherCreateCourse = lazy(() => import('../pages/teacher/TeacherCreateCourse'));
const TeacherEditCourse = lazy(() => import('../pages/teacher/TeacherEditCourse'));
const TeacherStudents = lazy(() => import('../pages/teacher/TeacherStudents'));
const TeacherQuizzes = lazy(() => import('../pages/teacher/TeacherQuizzes'));
const TeacherResults = lazy(() => import('../pages/teacher/TeacherResults'));
const TeacherAnnouncements = lazy(() => import('../pages/teacher/TeacherAnnouncements'));
const TeacherProfile = lazy(() => import('../pages/teacher/TeacherProfile'));
const TeacherMessages = lazy(() => import('../pages/teacher/TeacherMessages'));

// Student pages
const StudentDashboard = lazy(() => import('../pages/student/StudentDashboard'));
const StudentCourses = lazy(() => import('../pages/student/StudentCourses'));
const StudentCourseLearn = lazy(() => import('../pages/student/StudentCourseLearn'));
const StudentProgress = lazy(() => import('../pages/student/StudentProgress'));
const StudentQuizzes = lazy(() => import('../pages/student/StudentQuizzes'));
const StudentResults = lazy(() => import('../pages/student/StudentResults'));
const StudentMessages = lazy(() => import('../pages/student/StudentMessages'));
const StudentNotifications = lazy(() => import('../pages/student/StudentNotifications'));
const StudentProfile = lazy(() => import('../pages/student/StudentProfile'));
const StudentQuizTake = lazy(() => import('../pages/student/StudentQuizTake'));

const LoadingFallback = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-primary)' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Loading...</p>
    </div>
  </div>
);

const RedirectToDashboard = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const map = { admin: '/admin', teacher: '/teacher', student: '/student' };
  return <Navigate to={map[user.role] || '/'} replace />;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/courses" element={<PublicCourses />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/dashboard" element={<RedirectToDashboard />} />

          {/* Admin */}
          <Route path="/admin" element={<RoleRoute roles={['admin']}><AdminDashboard /></RoleRoute>} />
          <Route path="/admin/users" element={<RoleRoute roles={['admin']}><AdminUsers /></RoleRoute>} />
          <Route path="/admin/students" element={<RoleRoute roles={['admin']}><AdminUsers /></RoleRoute>} />
          <Route path="/admin/teachers" element={<RoleRoute roles={['admin']}><AdminUsers /></RoleRoute>} />
          <Route path="/admin/courses" element={<RoleRoute roles={['admin']}><AdminCourses /></RoleRoute>} />
          <Route path="/admin/categories" element={<RoleRoute roles={['admin']}><AdminCategories /></RoleRoute>} />
          <Route path="/admin/enrollments" element={<RoleRoute roles={['admin']}><AdminEnrollments /></RoleRoute>} />
          <Route path="/admin/announcements" element={<RoleRoute roles={['admin']}><AdminAnnouncements /></RoleRoute>} />
          <Route path="/admin/profile" element={<RoleRoute roles={['admin']}><AdminProfile /></RoleRoute>} />
          <Route path="/admin/settings" element={<RoleRoute roles={['admin']}><AdminProfile /></RoleRoute>} />

          {/* Teacher */}
          <Route path="/teacher" element={<RoleRoute roles={['teacher']}><TeacherDashboard /></RoleRoute>} />
          <Route path="/teacher/courses" element={<RoleRoute roles={['teacher']}><TeacherCourses /></RoleRoute>} />
          <Route path="/teacher/courses/create" element={<RoleRoute roles={['teacher']}><TeacherCreateCourse /></RoleRoute>} />
          <Route path="/teacher/courses/:courseId/edit" element={<RoleRoute roles={['teacher']}><TeacherEditCourse /></RoleRoute>} />
          <Route path="/teacher/students" element={<RoleRoute roles={['teacher']}><TeacherStudents /></RoleRoute>} />
          <Route path="/teacher/quizzes" element={<RoleRoute roles={['teacher']}><TeacherQuizzes /></RoleRoute>} />
          <Route path="/teacher/results" element={<RoleRoute roles={['teacher']}><TeacherResults /></RoleRoute>} />
          <Route path="/teacher/announcements" element={<RoleRoute roles={['teacher']}><TeacherAnnouncements /></RoleRoute>} />
          <Route path="/teacher/messages" element={<RoleRoute roles={['teacher']}><TeacherMessages /></RoleRoute>} />
          <Route path="/teacher/profile" element={<RoleRoute roles={['teacher']}><TeacherProfile /></RoleRoute>} />
          <Route path="/teacher/settings" element={<RoleRoute roles={['teacher']}><TeacherProfile /></RoleRoute>} />

          {/* Student */}
          <Route path="/student" element={<RoleRoute roles={['student']}><StudentDashboard /></RoleRoute>} />
          <Route path="/student/courses" element={<RoleRoute roles={['student']}><StudentCourses /></RoleRoute>} />
          <Route path="/student/courses/:courseId" element={<RoleRoute roles={['student']}><StudentCourseLearn /></RoleRoute>} />
          <Route path="/student/progress" element={<RoleRoute roles={['student']}><StudentProgress /></RoleRoute>} />
          <Route path="/student/quizzes" element={<RoleRoute roles={['student']}><StudentQuizzes /></RoleRoute>} />
          <Route path="/student/quizzes/:quizId" element={<RoleRoute roles={['student']}><StudentQuizTake /></RoleRoute>} />
          <Route path="/student/results" element={<RoleRoute roles={['student']}><StudentResults /></RoleRoute>} />
          <Route path="/student/messages" element={<RoleRoute roles={['student']}><StudentMessages /></RoleRoute>} />
          <Route path="/student/notifications" element={<RoleRoute roles={['student']}><StudentNotifications /></RoleRoute>} />
          <Route path="/student/profile" element={<RoleRoute roles={['student']}><StudentProfile /></RoleRoute>} />
          <Route path="/student/settings" element={<RoleRoute roles={['student']}><StudentProfile /></RoleRoute>} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
