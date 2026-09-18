const Announcement = require('../models/Announcement');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { createBulkNotifications } = require('../services/notificationService');
const { paginate, paginationMeta } = require('../utils/helpers');

// @desc    Create announcement
// @route   POST /api/announcements
exports.createAnnouncement = catchAsync(async (req, res, next) => {
  const { title, content, courseId } = req.body;

  const announcementData = {
    sender: req.user._id,
    title,
    content,
  };

  if (courseId) {
    const course = await Course.findById(courseId);
    if (!course) return next(new AppError('Course not found', 404));
    if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized', 403));
    }
    announcementData.course = courseId;
  }

  const announcement = await Announcement.create(announcementData);

  // Notify enrolled students if course-specific
  if (courseId) {
    try {
      const enrollments = await Enrollment.find({ course: courseId }).select('student');
      const studentIds = enrollments.map((e) => e.student);
      const { getIO } = require('../config/socket');
      const io = getIO();
      await createBulkNotifications(studentIds, {
        sender: req.user._id,
        title: 'New Announcement',
        message: title,
        type: 'announcement',
      }, io);
    } catch (e) { /* Socket may not be initialized */ }
  }

  res.status(201).json({ success: true, announcement });
});

// @desc    Get announcements
// @route   GET /api/announcements
exports.getAnnouncements = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, courseId } = req.query;
  const { skip, limit: lim } = paginate(page, limit);

  const query = {};
  if (courseId) query.course = courseId;

  const [announcements, total] = await Promise.all([
    Announcement.find(query)
      .populate('sender', 'name profileImage role')
      .populate('course', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(lim),
    Announcement.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    announcements,
    pagination: paginationMeta(total, page, lim),
  });
});

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
exports.deleteAnnouncement = catchAsync(async (req, res, next) => {
  const announcement = await Announcement.findById(req.params.id);
  if (!announcement) return next(new AppError('Announcement not found', 404));

  if (announcement.sender.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized', 403));
  }

  await Announcement.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'Announcement deleted' });
});
