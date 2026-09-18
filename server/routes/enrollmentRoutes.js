const express = require('express');
const router = express.Router();
const { enroll, getMyEnrollments, getEnrollment, getAllEnrollments, getCourseStudents, getEnrollmentStats, getEnrollmentTrends } = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/stats/overview', getEnrollmentStats);
router.get('/stats/trends', authorize('admin', 'teacher'), getEnrollmentTrends);
router.get('/my-courses', authorize('student'), getMyEnrollments);
router.get('/course/:courseId', getEnrollment);
router.get('/course/:courseId/students', authorize('teacher', 'admin'), getCourseStudents);
router.get('/', authorize('admin'), getAllEnrollments);
router.post('/course/:courseId', authorize('student'), enroll);

module.exports = router;
