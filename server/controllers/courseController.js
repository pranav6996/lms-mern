const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { paginate, paginationMeta } = require('../utils/helpers');
const { createBulkNotifications } = require('../services/notificationService');

// @desc    Get all courses (with filters)
// @route   GET /api/courses
exports.getCourses = catchAsync(async (req, res) => {
  const { page = 1, limit = 12, category, level, teacher, search, status, sort, minPrice, maxPrice } = req.query;
  const { skip, limit: lim } = paginate(page, limit);

  const query = {};
  if (category) query.category = category;
  if (level) query.level = level;
  if (teacher) query.teacher = teacher;
  if (status) query.status = status;
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
  }
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  // Default: only show published to non-admin/non-teacher
  if (!status) query.status = 'published';

  let sortOption = { createdAt: -1 };
  if (sort === 'popular') sortOption = { enrolledStudents: -1 };
  if (sort === 'rating') sortOption = { rating: -1 };
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };
  if (sort === 'newest') sortOption = { createdAt: -1 };

  const [courses, total] = await Promise.all([
    Course.find(query)
      .populate('teacher', 'name profileImage')
      .populate('category', 'name')
      .sort(sortOption)
      .skip(skip)
      .limit(lim),
    Course.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    courses,
    pagination: paginationMeta(total, page, lim),
  });
});

// @desc    Get single course with full details
// @route   GET /api/courses/:id
exports.getCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id)
    .populate('teacher', 'name profileImage bio')
    .populate('category', 'name');

  if (!course) return next(new AppError('Course not found', 404));

  // Get modules with lessons
  const modules = await Module.find({ course: course._id })
    .sort({ order: 1 })
    .populate({
      path: 'lessons',
      options: { sort: { order: 1 } },
    });

  res.status(200).json({ success: true, course, modules });
});

// @desc    Create course
// @route   POST /api/courses
exports.createCourse = catchAsync(async (req, res) => {
  const courseData = { ...req.body, teacher: req.user._id };

  if (req.file) {
    courseData.thumbnail = `/uploads/${req.file.filename}`;
  }

  // Parse arrays from form data
  if (typeof courseData.requirements === 'string') {
    try { courseData.requirements = JSON.parse(courseData.requirements); } catch (e) { courseData.requirements = [courseData.requirements]; }
  }
  if (typeof courseData.learningOutcomes === 'string') {
    try { courseData.learningOutcomes = JSON.parse(courseData.learningOutcomes); } catch (e) { courseData.learningOutcomes = [courseData.learningOutcomes]; }
  }

  const course = await Course.create(courseData);
  const populated = await Course.findById(course._id)
    .populate('teacher', 'name profileImage')
    .populate('category', 'name');

  res.status(201).json({ success: true, course: populated });
});

// @desc    Update course
// @route   PUT /api/courses/:id
exports.updateCourse = catchAsync(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) return next(new AppError('Course not found', 404));

  // Only owner or admin can update
  if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to update this course', 403));
  }

  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  // Parse arrays from form data
  if (typeof req.body.requirements === 'string') {
    try { req.body.requirements = JSON.parse(req.body.requirements); } catch (e) { req.body.requirements = [req.body.requirements]; }
  }
  if (typeof req.body.learningOutcomes === 'string') {
    try { req.body.learningOutcomes = JSON.parse(req.body.learningOutcomes); } catch (e) { req.body.learningOutcomes = [req.body.learningOutcomes]; }
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate('teacher', 'name profileImage')
    .populate('category', 'name');

  res.status(200).json({ success: true, course });
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
exports.deleteCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) return next(new AppError('Course not found', 404));

  if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to delete this course', 403));
  }

  // Delete related data
  const modules = await Module.find({ course: course._id });
  const moduleIds = modules.map((m) => m._id);
  await Lesson.deleteMany({ module: { $in: moduleIds } });
  await Module.deleteMany({ course: course._id });
  await Enrollment.deleteMany({ course: course._id });
  await Course.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, message: 'Course deleted successfully' });
});

// @desc    Publish course
// @route   POST /api/courses/:id/publish
exports.publishCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) return next(new AppError('Course not found', 404));

  if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized', 403));
  }

  course.status = course.status === 'published' ? 'draft' : 'published';
  await course.save();

  res.status(200).json({ success: true, course });
});

// @desc    Get teacher's courses
// @route   GET /api/courses/teacher/my-courses
exports.getTeacherCourses = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const { skip, limit: lim } = paginate(page, limit);

  const query = { teacher: req.user._id };
  if (status) query.status = status;

  const [courses, total] = await Promise.all([
    Course.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(lim),
    Course.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    courses,
    pagination: paginationMeta(total, page, lim),
  });
});

// @desc    Get all courses for admin
// @route   GET /api/courses/admin/all
exports.getAdminCourses = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, status, search } = req.query;
  const { skip, limit: lim } = paginate(page, limit);

  const query = {};
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
    ];
  }

  const [courses, total] = await Promise.all([
    Course.find(query)
      .populate('teacher', 'name email')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(lim),
    Course.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    courses,
    pagination: paginationMeta(total, page, lim),
  });
});

// @desc    Get course stats
// @route   GET /api/courses/stats/overview
exports.getCourseStats = catchAsync(async (req, res) => {
  const query = req.user.role === 'teacher' ? { teacher: req.user._id } : {};

  const [total, published, draft, archived] = await Promise.all([
    Course.countDocuments(query),
    Course.countDocuments({ ...query, status: 'published' }),
    Course.countDocuments({ ...query, status: 'draft' }),
    Course.countDocuments({ ...query, status: 'archived' }),
  ]);

  res.status(200).json({
    success: true,
    stats: { total, published, draft, archived },
  });
});
