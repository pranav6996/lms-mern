const express = require('express');
const router = express.Router();
const { createAnnouncement, getAnnouncements, deleteAnnouncement } = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getAnnouncements);
router.post('/', authorize('teacher', 'admin'), createAnnouncement);
router.delete('/:id', authorize('teacher', 'admin'), deleteAnnouncement);

module.exports = router;
