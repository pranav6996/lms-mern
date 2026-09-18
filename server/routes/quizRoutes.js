const express = require('express');
const router = express.Router();
const { createQuiz, getQuiz, updateQuiz, deleteQuiz, getCourseQuizzes, getTeacherQuizzes, submitQuiz } = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/teacher/my-quizzes', authorize('teacher'), getTeacherQuizzes);
router.get('/course/:courseId', getCourseQuizzes);
router.post('/', authorize('teacher', 'admin'), createQuiz);
router.get('/:id', getQuiz);
router.put('/:id', authorize('teacher', 'admin'), updateQuiz);
router.delete('/:id', authorize('teacher', 'admin'), deleteQuiz);
router.post('/:id/submit', authorize('student'), submitQuiz);

module.exports = router;
