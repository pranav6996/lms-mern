const Enrollment = require('../models/Enrollment');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// @desc    Mark lesson complete / update progress
// @route   POST /api/progress
exports.updateProgress = catchAsync(async (req, res, next) => {
  const { courseId, lessonId } = req.body;

  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: courseId,
  });

  if (!enrollment) return next(new AppError('Not enrolled in this course', 400));

  // Add lesson to completed if not already
  if (!enrollment.completedLessons.includes(lessonId)) {
    enrollment.completedLessons.push(lessonId);
  }

  // Update last accessed lesson
  enrollment.lastAccessedLesson = lessonId;

  // Calculate progress
  const modules = await Module.find({ course: courseId });
  const moduleIds = modules.map((m) => m._id);
  const totalLessons = await Lesson.countDocuments({ module: { $in: moduleIds } });

  if (totalLessons > 0) {
    enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessons) * 100);
  }

  // Mark completed
  if (enrollment.progress >= 100) {
    enrollment.completedAt = new Date();
    enrollment.progress = 100;
  }

  await enrollment.save();

  res.status(200).json({ success: true, enrollment });
});

// @desc    Get progress for a course
// @route   GET /api/progress/course/:courseId
exports.getCourseProgress = catchAsync(async (req, res) => {
  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: req.params.courseId,
  }).populate('lastAccessedLesson', 'title');

  if (!enrollment) {
    return res.status(200).json({
      success: true,
      progress: null,
    });
  }

  // Get total lessons
  const modules = await Module.find({ course: req.params.courseId });
  const moduleIds = modules.map((m) => m._id);
  const totalLessons = await Lesson.countDocuments({ module: { $in: moduleIds } });

  res.status(200).json({
    success: true,
    progress: {
      completedLessons: enrollment.completedLessons,
      totalLessons,
      percentage: enrollment.progress,
      lastAccessedLesson: enrollment.lastAccessedLesson,
      completedAt: enrollment.completedAt,
    },
  });
});

// @desc    Update last accessed lesson
// @route   PUT /api/progress/last-accessed
exports.updateLastAccessed = catchAsync(async (req, res, next) => {
  const { courseId, lessonId } = req.body;

  const enrollment = await Enrollment.findOneAndUpdate(
    { student: req.user._id, course: courseId },
    { lastAccessedLesson: lessonId },
    { new: true }
  );

  if (!enrollment) return next(new AppError('Not enrolled', 400));

  res.status(200).json({ success: true, enrollment });
});
