const express = require('express');
const router = express.Router();
const { getCategories, getAllCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getCategories);

router.use(protect);
router.get('/admin/all', authorize('admin'), getAllCategories);
router.post('/', authorize('admin'), createCategory);
router.put('/:id', authorize('admin'), updateCategory);
router.delete('/:id', authorize('admin'), deleteCategory);

module.exports = router;
