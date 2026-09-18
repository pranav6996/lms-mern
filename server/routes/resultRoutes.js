const express = require('express');
const router = express.Router();
const { getMyResults, getResult, getQuizResults, getTeacherResults, getResultStats } = require('../controllers/resultController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/stats/overview', getResultStats);
router.get('/teacher/all', authorize('teacher'), getTeacherResults);
router.get('/quiz/:quizId', authorize('teacher', 'admin'), getQuizResults);
router.get('/', getMyResults);
router.get('/:id', getResult);

module.exports = router;
