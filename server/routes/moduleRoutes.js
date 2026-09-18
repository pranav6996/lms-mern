const express = require('express');
const router = express.Router();
const { createModule, getModules, updateModule, deleteModule, reorderModules } = require('../controllers/moduleController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/course/:courseId', getModules);
router.post('/course/:courseId', authorize('teacher', 'admin'), createModule);
router.put('/course/:courseId/reorder', authorize('teacher', 'admin'), reorderModules);
router.put('/:id', authorize('teacher', 'admin'), updateModule);
router.delete('/:id', authorize('teacher', 'admin'), deleteModule);

module.exports = router;
