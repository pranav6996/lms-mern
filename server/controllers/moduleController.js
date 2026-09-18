const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// @desc    Create module
// @route   POST /api/courses/:courseId/modules
exports.createModule = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) return next(new AppError('Course not found', 404));

  if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized', 403));
  }

  const moduleCount = await Module.countDocuments({ course: course._id });

  const module = await Module.create({
    course: course._id,
    title: req.body.title,
    description: req.body.description || '',
    order: req.body.order || moduleCount,
  });

  res.status(201).json({ success: true, module });
});

// @desc    Get modules for a course
// @route   GET /api/courses/:courseId/modules
exports.getModules = catchAsync(async (req, res) => {
  const modules = await Module.find({ course: req.params.courseId })
    .sort({ order: 1 })
    .populate({
      path: 'lessons',
      options: { sort: { order: 1 } },
    });

  res.status(200).json({ success: true, modules });
});

// @desc    Update module
// @route   PUT /api/modules/:id
exports.updateModule = catchAsync(async (req, res, next) => {
  const module = await Module.findById(req.params.id);
  if (!module) return next(new AppError('Module not found', 404));

  const course = await Course.findById(module.course);
  if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized', 403));
  }

  const updated = await Module.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, module: updated });
});

// @desc    Delete module
// @route   DELETE /api/modules/:id
exports.deleteModule = catchAsync(async (req, res, next) => {
  const module = await Module.findById(req.params.id);
  if (!module) return next(new AppError('Module not found', 404));

  const course = await Course.findById(module.course);
  if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized', 403));
  }

  await Lesson.deleteMany({ module: module._id });
  await Module.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, message: 'Module deleted' });
});

// @desc    Reorder modules
// @route   PUT /api/courses/:courseId/modules/reorder
exports.reorderModules = catchAsync(async (req, res) => {
  const { moduleOrder } = req.body; // Array of { id, order }

  const updates = moduleOrder.map(({ id, order }) =>
    Module.findByIdAndUpdate(id, { order })
  );
  await Promise.all(updates);

  const modules = await Module.find({ course: req.params.courseId })
    .sort({ order: 1 })
    .populate({ path: 'lessons', options: { sort: { order: 1 } } });

  res.status(200).json({ success: true, modules });
});
