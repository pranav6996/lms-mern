const Notification = require('../models/Notification');
const catchAsync = require('../utils/catchAsync');
const { paginate, paginationMeta } = require('../utils/helpers');

// @desc    Get my notifications
// @route   GET /api/notifications
exports.getNotifications = catchAsync(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const { skip, limit: lim } = paginate(page, limit);

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find({ recipient: req.user._id })
      .populate('sender', 'name profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(lim),
    Notification.countDocuments({ recipient: req.user._id }),
    Notification.countDocuments({ recipient: req.user._id, isRead: false }),
  ]);

  res.status(200).json({
    success: true,
    notifications,
    unreadCount,
    pagination: paginationMeta(total, page, lim),
  });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
exports.markAsRead = catchAsync(async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.status(200).json({ success: true });
});

// @desc    Mark all as read
// @route   PUT /api/notifications/read-all
exports.markAllAsRead = catchAsync(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { isRead: true }
  );
  res.status(200).json({ success: true });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
exports.deleteNotification = catchAsync(async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true });
});
