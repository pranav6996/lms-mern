const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { paginate, paginationMeta } = require('../utils/helpers');

// @desc    Get all users
// @route   GET /api/users
exports.getUsers = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, role, search, isActive } = req.query;
  const { skip, limit: lim } = paginate(page, limit);

  const query = {};
  if (role) query.role = role;
  if (isActive !== undefined) query.isActive = isActive === 'true';
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(lim),
    User.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    users,
    pagination: paginationMeta(total, page, lim),
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('User not found', 404));
  res.status(200).json({ success: true, user });
});

// @desc    Create user (admin only — for creating teachers)
// @route   POST /api/users
exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return next(new AppError('Email already in use', 400));

  const user = await User.create({ name, email, password, role: role || 'student' });
  res.status(201).json({ success: true, user });
});

// @desc    Update user
// @route   PUT /api/users/:id
exports.updateUser = catchAsync(async (req, res, next) => {
  const { name, email, role, isActive, phone, bio } = req.body;
  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (role) updateData.role = role;
  if (isActive !== undefined) updateData.isActive = isActive;
  if (phone !== undefined) updateData.phone = phone;
  if (bio !== undefined) updateData.bio = bio;

  const user = await User.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) return next(new AppError('User not found', 404));
  res.status(200).json({ success: true, user });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('User not found', 404));
  if (user.role === 'admin') return next(new AppError('Cannot delete admin user', 400));

  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'User deleted successfully' });
});

// @desc    Get dashboard stats
// @route   GET /api/users/stats/overview
exports.getStats = catchAsync(async (req, res) => {
  const [totalStudents, totalTeachers, activeUsers] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'teacher' }),
    User.countDocuments({ isActive: true }),
  ]);

  res.status(200).json({
    success: true,
    stats: { totalStudents, totalTeachers, activeUsers },
  });
});

// @desc    Get registration trends
// @route   GET /api/users/stats/trends
exports.getRegistrationTrends = catchAsync(async (req, res) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const trends = await User.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' },
          role: '$role',
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  res.status(200).json({ success: true, trends });
});
