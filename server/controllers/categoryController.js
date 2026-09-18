const Category = require('../models/Category');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// @desc    Get all categories
// @route   GET /api/categories
exports.getCategories = catchAsync(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  res.status(200).json({ success: true, categories });
});

// @desc    Get all categories (admin - include inactive)
// @route   GET /api/categories/admin/all
exports.getAllCategories = catchAsync(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.status(200).json({ success: true, categories });
});

// @desc    Create category
// @route   POST /api/categories
exports.createCategory = catchAsync(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, category });
});

// @desc    Update category
// @route   PUT /api/categories/:id
exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) return next(new AppError('Category not found', 404));
  res.status(200).json({ success: true, category });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return next(new AppError('Category not found', 404));
  res.status(200).json({ success: true, message: 'Category deleted' });
});
