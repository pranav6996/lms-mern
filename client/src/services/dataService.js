import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) formData.append(key, data[key]);
    });
    return api.put('/auth/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  changePassword: (data) => api.put('/auth/change-password', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
};

export const userService = {
  getUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  createUser: (data) => api.post('/users', data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getStats: () => api.get('/users/stats/overview'),
  getTrends: () => api.get('/users/stats/trends'),
};

export const courseService = {
  getCourses: (params) => api.get('/courses', { params }),
  getCourse: (id) => api.get(`/courses/${id}`),
  getPublicCourse: (id) => api.get(`/courses/public/${id}`),
  createCourse: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        if (Array.isArray(data[key])) {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      }
    });
    return api.post('/courses', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  updateCourse: (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        if (Array.isArray(data[key])) {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      }
    });
    return api.put(`/courses/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  publishCourse: (id) => api.post(`/courses/${id}/publish`),
  getTeacherCourses: (params) => api.get('/courses/teacher/my-courses', { params }),
  getAdminCourses: (params) => api.get('/courses/admin/all', { params }),
  getCourseStats: () => api.get('/courses/stats/overview'),
};

export const moduleService = {
  getModules: (courseId) => api.get(`/modules/course/${courseId}`),
  createModule: (courseId, data) => api.post(`/modules/course/${courseId}`, data),
  updateModule: (id, data) => api.put(`/modules/${id}`, data),
  deleteModule: (id) => api.delete(`/modules/${id}`),
  reorderModules: (courseId, moduleOrder) => api.put(`/modules/course/${courseId}/reorder`, { moduleOrder }),
};

export const lessonService = {
  createLesson: (moduleId, data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) formData.append(key, data[key]);
    });
    return api.post(`/lessons/module/${moduleId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  getLesson: (id) => api.get(`/lessons/${id}`),
  updateLesson: (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) formData.append(key, data[key]);
    });
    return api.put(`/lessons/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  deleteLesson: (id) => api.delete(`/lessons/${id}`),
  reorderLessons: (moduleId, lessonOrder) => api.put(`/lessons/module/${moduleId}/reorder`, { lessonOrder }),
};

export const enrollmentService = {
  enroll: (courseId) => api.post(`/enrollments/course/${courseId}`),
  getMyEnrollments: (params) => api.get('/enrollments/my-courses', { params }),
  getEnrollment: (courseId) => api.get(`/enrollments/course/${courseId}`),
  getAllEnrollments: (params) => api.get('/enrollments', { params }),
  getCourseStudents: (courseId) => api.get(`/enrollments/course/${courseId}/students`),
  getStats: () => api.get('/enrollments/stats/overview'),
  getTrends: () => api.get('/enrollments/stats/trends'),
};

export const quizService = {
  createQuiz: (data) => api.post('/quizzes', data),
  getQuiz: (id) => api.get(`/quizzes/${id}`),
  updateQuiz: (id, data) => api.put(`/quizzes/${id}`, data),
  deleteQuiz: (id) => api.delete(`/quizzes/${id}`),
  getCourseQuizzes: (courseId) => api.get(`/quizzes/course/${courseId}`),
  getTeacherQuizzes: () => api.get('/quizzes/teacher/my-quizzes'),
  submitQuiz: (id, answers) => api.post(`/quizzes/${id}/submit`, { answers }),
};

export const resultService = {
  getMyResults: (params) => api.get('/results', { params }),
  getResult: (id) => api.get(`/results/${id}`),
  getQuizResults: (quizId) => api.get(`/results/quiz/${quizId}`),
  getTeacherResults: (params) => api.get('/results/teacher/all', { params }),
  getStats: () => api.get('/results/stats/overview'),
};

export const progressService = {
  updateProgress: (courseId, lessonId) => api.post('/progress', { courseId, lessonId }),
  getCourseProgress: (courseId) => api.get(`/progress/course/${courseId}`),
  updateLastAccessed: (courseId, lessonId) => api.put('/progress/last-accessed', { courseId, lessonId }),
};

export const notificationService = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

export const announcementService = {
  getAnnouncements: (params) => api.get('/announcements', { params }),
  createAnnouncement: (data) => api.post('/announcements', data),
  deleteAnnouncement: (id) => api.delete(`/announcements/${id}`),
};

export const categoryService = {
  getCategories: () => api.get('/categories'),
  getAllCategories: () => api.get('/categories/admin/all'),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

export const chatService = {
  getConversations: () => api.get('/chat/conversations'),
  createConversation: (data) => api.post('/chat/conversations', data),
  getMessages: (conversationId) => api.get(`/chat/messages/${conversationId}`),
  sendMessage: (data) => api.post('/chat/messages', data),
};
