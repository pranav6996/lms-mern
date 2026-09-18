const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { paginate, paginationMeta } = require('../utils/helpers');
const { createNotification } = require('../services/notificationService');

// @desc    Enroll in course
// @route   POST /api/courses/:courseId/enroll
exports.enroll = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) return next(new AppError('Course not found', 404));
  if (course.status !== 'published') return next(new AppError('Course is not available', 400));

  const existing = await Enrollment.findOne({ student: req.user._id, course: course._id });
  if (existing) return next(new AppError('Already enrolled in this course', 400));

  const enrollment = await Enrollment.create({
    student: req.user._id,
    course: course._id,
  });

  // Update enrolled count
  course.enrolledStudents = (course.enrolledStudents || 0) + 1;
  await course.save();

  // Notify teacher
  try {
    const { getIO } = require('../config/socket');
    const io = getIO();
    await createNotification({
      recipient: course.teacher,
      sender: req.user._id,
      title: 'New Enrollment',
      message: `${req.user.name} enrolled in "${course.title}"`,
      type: 'enrollment',
    }, io);
  } catch (e) { /* Socket not initialized in tests */ }

  res.status(201).json({ success: true, enrollment });
});

// @desc    Get my enrollments
// @route   GET /api/enrollments/my-courses
exports.getMyEnrollments = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { skip, limit: lim } = paginate(page, limit);

  const [enrollments, total] = await Promise.all([
    Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        populate: [
          { path: 'teacher', select: 'name profileImage' },
          { path: 'category', select: 'name' },
        ],
      })
      .populate('lastAccessedLesson', 'title')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(lim),
    Enrollment.countDocuments({ student: req.user._id }),
  ]);

  res.status(200).json({
    success: true,
    enrollments,
    pagination: paginationMeta(total, page, lim),
  });
});

// @desc    Get enrollment for specific course
// @route   GET /api/enrollments/course/:courseId
exports.getEnrollment = catchAsync(async (req, res) => {
  const enrollment = await Enrollment.findOne({
    student: req.user._id,
    course: req.params.courseId,
  }).populate('lastAccessedLesson', 'title');

  res.status(200).json({ success: true, enrollment });
});

// @desc    Get all enrollments (admin)
// @route   GET /api/enrollments
exports.getAllEnrollments = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, course, student } = req.query;
  const { skip, limit: lim } = paginate(page, limit);

  const query = {};
  if (course) query.course = course;
  if (student) query.student = student;

  const [enrollments, total] = await Promise.all([
    Enrollment.find(query)
      .populate('student', 'name email profileImage')
      .populate({
        path: 'course',
        select: 'title thumbnail',
        populate: { path: 'teacher', select: 'name' },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(lim),
    Enrollment.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    enrollments,
    pagination: paginationMeta(total, page, lim),
  });
});

// @desc    Get enrolled students for a course (teacher)
// @route   GET /api/enrollments/course/:courseId/students
exports.getCourseStudents = catchAsync(async (req, res) => {
  const enrollments = await Enrollment.find({ course: req.params.courseId })
    .populate('student', 'name email profileImage')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, enrollments });
});

// @desc    Get enrollment stats
// @route   GET /api/enrollments/stats/overview
exports.getEnrollmentStats = catchAsync(async (req, res) => {
  const query = {};

  // If teacher, only their courses
  if (req.user.role === 'teacher') {
    const teacherCourses = await Course.find({ teacher: req.user._id }).select('_id');
    query.course = { $in: teacherCourses.map((c) => c._id) };
  }

  const [totalEnrollments, completed, inProgress] = await Promise.all([
    Enrollment.countDocuments(query),
    Enrollment.countDocuments({ ...query, progress: 100 }),
    Enrollment.countDocuments({ ...query, progress: { $gt: 0, $lt: 100 } }),
  ]);

  res.status(200).json({
    success: true,
    stats: { totalEnrollments, completed, inProgress },
  });
});

// @desc    Get enrollment trends
// @route   GET /api/enrollments/stats/trends
exports.getEnrollmentTrends = catchAsync(async (req, res) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const matchQuery = { createdAt: { $gte: sixMonthsAgo } };

  if (req.user.role === 'teacher') {
    const teacherCourses = await Course.find({ teacher: req.user._id }).select('_id');
    matchQuery.course = { $in: teacherCourses.map((c) => c._id) };
  }

  const trends = await Enrollment.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  res.status(200).json({ success: true, trends });
});
