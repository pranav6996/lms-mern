const express = require('express');
const router = express.Router();
const { updateProgress, getCourseProgress, updateLastAccessed } = require('../controllers/progressController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('student'), updateProgress);
router.put('/last-accessed', authorize('student'), updateLastAccessed);
router.get('/course/:courseId', authorize('student'), getCourseProgress);

module.exports = router;
