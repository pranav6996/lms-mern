const QuizResult = require('../models/QuizResult');
const Quiz = require('../models/Quiz');
const Course = require('../models/Course');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { paginate, paginationMeta } = require('../utils/helpers');

// @desc    Get my results
// @route   GET /api/results
exports.getMyResults = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { skip, limit: lim } = paginate(page, limit);

  const [results, total] = await Promise.all([
    QuizResult.find({ student: req.user._id })
      .populate('quiz', 'title passingScore')
      .populate('course', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(lim),
    QuizResult.countDocuments({ student: req.user._id }),
  ]);

  res.status(200).json({
    success: true,
    results,
    pagination: paginationMeta(total, page, lim),
  });
});

// @desc    Get single result
// @route   GET /api/results/:id
exports.getResult = catchAsync(async (req, res, next) => {
  const result = await QuizResult.findById(req.params.id)
    .populate({
      path: 'quiz',
      select: 'title questions passingScore timeLimit',
    })
    .populate('course', 'title')
    .populate('student', 'name email');

  if (!result) return next(new AppError('Result not found', 404));

  // Students can only see their own results
  if (req.user.role === 'student' && result.student._id.toString() !== req.user._id.toString()) {
    return next(new AppError('Not authorized', 403));
  }

  res.status(200).json({ success: true, result });
});

// @desc    Get results for a quiz (teacher)
// @route   GET /api/results/quiz/:quizId
exports.getQuizResults = catchAsync(async (req, res) => {
  const results = await QuizResult.find({ quiz: req.params.quizId })
    .populate('student', 'name email profileImage')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, results });
});

// @desc    Get results for teacher's courses
// @route   GET /api/results/teacher/all
exports.getTeacherResults = catchAsync(async (req, res) => {
  const courses = await Course.find({ teacher: req.user._id }).select('_id');
  const courseIds = courses.map((c) => c._id);

  const { page = 1, limit = 10 } = req.query;
  const { skip, limit: lim } = paginate(page, limit);

  const [results, total] = await Promise.all([
    QuizResult.find({ course: { $in: courseIds } })
      .populate('student', 'name email')
      .populate('quiz', 'title')
      .populate('course', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(lim),
    QuizResult.countDocuments({ course: { $in: courseIds } }),
  ]);

  res.status(200).json({
    success: true,
    results,
    pagination: paginationMeta(total, page, lim),
  });
});

// @desc    Get quiz performance stats
// @route   GET /api/results/stats/overview
exports.getResultStats = catchAsync(async (req, res) => {
  const query = {};

  if (req.user.role === 'teacher') {
    const courses = await Course.find({ teacher: req.user._id }).select('_id');
    query.course = { $in: courses.map((c) => c._id) };
  } else if (req.user.role === 'student') {
    query.student = req.user._id;
  }

  const [totalAttempts, passed, failed] = await Promise.all([
    QuizResult.countDocuments(query),
    QuizResult.countDocuments({ ...query, passed: true }),
    QuizResult.countDocuments({ ...query, passed: false }),
  ]);

  const avgScore = await QuizResult.aggregate([
    { $match: query },
    { $group: { _id: null, avg: { $avg: '$percentage' } } },
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalAttempts,
      passed,
      failed,
      averageScore: avgScore[0]?.avg ? Math.round(avgScore[0].avg) : 0,
    },
  });
});
