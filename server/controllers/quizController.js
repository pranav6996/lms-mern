const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { paginate, paginationMeta } = require('../utils/helpers');

// @desc    Create quiz
// @route   POST /api/quizzes
exports.createQuiz = catchAsync(async (req, res, next) => {
  const { courseId, lessonId, title, description, questions, timeLimit, passingScore, attemptsAllowed } = req.body;

  const course = await Course.findById(courseId);
  if (!course) return next(new AppError('Course not found', 404));

  if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized', 403));
  }

  const quiz = await Quiz.create({
    course: courseId,
    lesson: lessonId || null,
    title,
    description: description || '',
    questions: questions || [],
    timeLimit: timeLimit || 30,
    passingScore: passingScore || 50,
    attemptsAllowed: attemptsAllowed || 3,
  });

  res.status(201).json({ success: true, quiz });
});

// @desc    Get quiz
// @route   GET /api/quizzes/:id
exports.getQuiz = catchAsync(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id).populate('course', 'title teacher');
  if (!quiz) return next(new AppError('Quiz not found', 404));

  // For students, don't expose correct answers
  if (req.user.role === 'student') {
    const quizObj = quiz.toObject();
    quizObj.questions = quizObj.questions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
      marks: q.marks,
    }));
    return res.status(200).json({ success: true, quiz: quizObj });
  }

  res.status(200).json({ success: true, quiz });
});

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
exports.updateQuiz = catchAsync(async (req, res, next) => {
  let quiz = await Quiz.findById(req.params.id);
  if (!quiz) return next(new AppError('Quiz not found', 404));

  const course = await Course.findById(quiz.course);
  if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized', 403));
  }

  quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, quiz });
});

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
exports.deleteQuiz = catchAsync(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return next(new AppError('Quiz not found', 404));

  const course = await Course.findById(quiz.course);
  if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized', 403));
  }

  await QuizResult.deleteMany({ quiz: quiz._id });
  await Quiz.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, message: 'Quiz deleted' });
});

// @desc    Get quizzes for a course
// @route   GET /api/quizzes/course/:courseId
exports.getCourseQuizzes = catchAsync(async (req, res) => {
  const quizzes = await Quiz.find({ course: req.params.courseId })
    .select('title description timeLimit passingScore attemptsAllowed questions')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, quizzes });
});

// @desc    Get teacher's quizzes
// @route   GET /api/quizzes/teacher/my-quizzes
exports.getTeacherQuizzes = catchAsync(async (req, res) => {
  const courses = await Course.find({ teacher: req.user._id }).select('_id');
  const courseIds = courses.map((c) => c._id);

  const quizzes = await Quiz.find({ course: { $in: courseIds } })
    .populate('course', 'title')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, quizzes });
});

// @desc    Submit quiz
// @route   POST /api/quizzes/:id/submit
exports.submitQuiz = catchAsync(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return next(new AppError('Quiz not found', 404));

  // Check attempt count
  const previousAttempts = await QuizResult.countDocuments({
    student: req.user._id,
    quiz: quiz._id,
  });

  if (previousAttempts >= quiz.attemptsAllowed) {
    return next(new AppError(`Maximum attempts (${quiz.attemptsAllowed}) reached`, 400));
  }

  const { answers } = req.body; // Array of { questionId, selectedAnswer }

  let score = 0;
  let totalMarks = 0;
  const processedAnswers = [];

  quiz.questions.forEach((question) => {
    const studentAnswer = answers.find((a) => a.questionId === question._id.toString());
    const selectedAnswer = studentAnswer ? studentAnswer.selectedAnswer : -1;
    const isCorrect = selectedAnswer === question.correctAnswer;

    if (isCorrect) score += question.marks;
    totalMarks += question.marks;

    processedAnswers.push({
      questionId: question._id,
      selectedAnswer,
      isCorrect,
    });
  });

  const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;
  const passed = percentage >= quiz.passingScore;

  const result = await QuizResult.create({
    student: req.user._id,
    quiz: quiz._id,
    course: quiz.course,
    answers: processedAnswers,
    score,
    totalMarks,
    percentage,
    passed,
  });

  // Return result with quiz questions for review
  const resultWithDetails = {
    ...result.toObject(),
    quiz: {
      title: quiz.title,
      questions: quiz.questions,
      passingScore: quiz.passingScore,
    },
  };

  res.status(200).json({ success: true, result: resultWithDetails });
});
