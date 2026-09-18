const express = require('express');
const router = express.Router();
const { getUsers, getUser, createUser, updateUser, deleteUser, getStats, getRegistrationTrends } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/stats/overview', authorize('admin', 'teacher'), getStats);
router.get('/stats/trends', authorize('admin'), getRegistrationTrends);
router.get('/', authorize('admin'), getUsers);
router.get('/:id', authorize('admin'), getUser);
router.post('/', authorize('admin'), createUser);
router.put('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;
