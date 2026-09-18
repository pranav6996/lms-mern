const Lesson = require('../models/Lesson');
const Module = require('../models/Module');
const Course = require('../models/Course');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// @desc    Create lesson
// @route   POST /api/modules/:moduleId/lessons
exports.createLesson = catchAsync(async (req, res, next) => {
  const module = await Module.findById(req.params.moduleId);
  if (!module) return next(new AppError('Module not found', 404));

  const course = await Course.findById(module.course);
  if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized', 403));
  }

  const lessonCount = await Lesson.countDocuments({ module: module._id });

  const lessonData = {
    module: module._id,
    title: req.body.title,
    description: req.body.description || '',
    type: req.body.type,
    videoUrl: req.body.videoUrl || '',
    content: req.body.content || '',
    duration: req.body.duration || '',
    order: req.body.order !== undefined ? req.body.order : lessonCount,
    isPreview: req.body.isPreview || false,
  };

  if (req.file) {
    lessonData.documentUrl = `/uploads/${req.file.filename}`;
  }

  const lesson = await Lesson.create(lessonData);
  res.status(201).json({ success: true, lesson });
});

// @desc    Get lesson
// @route   GET /api/lessons/:id
exports.getLesson = catchAsync(async (req, res, next) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) return next(new AppError('Lesson not found', 404));
  res.status(200).json({ success: true, lesson });
});

// @desc    Update lesson
// @route   PUT /api/lessons/:id
exports.updateLesson = catchAsync(async (req, res, next) => {
  let lesson = await Lesson.findById(req.params.id);
  if (!lesson) return next(new AppError('Lesson not found', 404));

  const module = await Module.findById(lesson.module);
  const course = await Course.findById(module.course);
  if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized', 403));
  }

  if (req.file) {
    req.body.documentUrl = `/uploads/${req.file.filename}`;
  }

  lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, lesson });
});

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
exports.deleteLesson = catchAsync(async (req, res, next) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) return next(new AppError('Lesson not found', 404));

  const module = await Module.findById(lesson.module);
  const course = await Course.findById(module.course);
  if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized', 403));
  }

  await Lesson.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'Lesson deleted' });
});

// @desc    Reorder lessons
// @route   PUT /api/modules/:moduleId/lessons/reorder
exports.reorderLessons = catchAsync(async (req, res) => {
  const { lessonOrder } = req.body;

  const updates = lessonOrder.map(({ id, order }) =>
    Lesson.findByIdAndUpdate(id, { order })
  );
  await Promise.all(updates);

  const lessons = await Lesson.find({ module: req.params.moduleId }).sort({ order: 1 });
  res.status(200).json({ success: true, lessons });
});
