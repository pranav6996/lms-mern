const express = require('express');
const router = express.Router();
const { createLesson, getLesson, updateLesson, deleteLesson, reorderLessons } = require('../controllers/lessonController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.use(protect);

router.post('/module/:moduleId', authorize('teacher', 'admin'), upload.single('document'), createLesson);
router.put('/module/:moduleId/reorder', authorize('teacher', 'admin'), reorderLessons);
router.get('/:id', getLesson);
router.put('/:id', authorize('teacher', 'admin'), upload.single('document'), updateLesson);
router.delete('/:id', authorize('teacher', 'admin'), deleteLesson);

module.exports = router;
