const express = require('express');
const router = express.Router();
const {
  getCourses, getCourse, createCourse, updateCourse, deleteCourse,
  publishCourse, getTeacherCourses, getAdminCourses, getCourseStats,
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Public routes
router.get('/', getCourses);
router.get('/public/:id', getCourse);

// Protected routes
router.use(protect);

router.get('/stats/overview', authorize('admin', 'teacher'), getCourseStats);
router.get('/teacher/my-courses', authorize('teacher'), getTeacherCourses);
router.get('/admin/all', authorize('admin'), getAdminCourses);
router.get('/:id', getCourse);
router.post('/', authorize('teacher', 'admin'), upload.single('thumbnail'), createCourse);
router.put('/:id', authorize('teacher', 'admin'), upload.single('thumbnail'), updateCourse);
router.delete('/:id', authorize('teacher', 'admin'), deleteCourse);
router.post('/:id/publish', authorize('teacher', 'admin'), publishCourse);

module.exports = router;
