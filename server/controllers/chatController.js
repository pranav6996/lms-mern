const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// @desc    Get my conversations
// @route   GET /api/conversations
exports.getConversations = catchAsync(async (req, res) => {
  const conversations = await Conversation.find({
    participants: req.user._id,
  })
    .populate('participants', 'name profileImage role')
    .populate('course', 'title')
    .sort({ lastMessageAt: -1 });

  res.status(200).json({ success: true, conversations });
});

// @desc    Create or get existing conversation
// @route   POST /api/conversations
exports.createConversation = catchAsync(async (req, res, next) => {
  const { participantId, courseId } = req.body;

  if (!participantId) return next(new AppError('Participant is required', 400));

  const participant = await User.findById(participantId);
  if (!participant) return next(new AppError('User not found', 404));

  // Check if conversation exists
  let conversation = await Conversation.findOne({
    participants: { $all: [req.user._id, participantId] },
    ...(courseId && { course: courseId }),
  }).populate('participants', 'name profileImage role');

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [req.user._id, participantId],
      course: courseId || null,
    });
    conversation = await Conversation.findById(conversation._id)
      .populate('participants', 'name profileImage role')
      .populate('course', 'title');
  }

  res.status(200).json({ success: true, conversation });
});

// @desc    Get messages for a conversation
// @route   GET /api/messages/:conversationId
exports.getMessages = catchAsync(async (req, res, next) => {
  const conversation = await Conversation.findById(req.params.conversationId);
  if (!conversation) return next(new AppError('Conversation not found', 404));

  if (!conversation.participants.includes(req.user._id)) {
    return next(new AppError('Not authorized', 403));
  }

  const messages = await Message.find({ conversation: conversation._id })
    .populate('sender', 'name profileImage')
    .sort({ createdAt: 1 });

  // Mark messages as read
  await Message.updateMany(
    {
      conversation: conversation._id,
      sender: { $ne: req.user._id },
      isRead: false,
    },
    { isRead: true }
  );

  res.status(200).json({ success: true, messages });
});

// @desc    Send message
// @route   POST /api/messages
exports.sendMessage = catchAsync(async (req, res, next) => {
  const { conversationId, content } = req.body;

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) return next(new AppError('Conversation not found', 404));

  if (!conversation.participants.includes(req.user._id)) {
    return next(new AppError('Not authorized', 403));
  }

  const message = await Message.create({
    conversation: conversationId,
    sender: req.user._id,
    content,
  });

  // Update conversation
  conversation.lastMessage = content;
  conversation.lastMessageAt = new Date();
  await conversation.save();

  const populated = await Message.findById(message._id).populate('sender', 'name profileImage');

  // Emit via Socket.IO
  try {
    const { getIO } = require('../config/socket');
    const io = getIO();
    io.to(`conversation:${conversationId}`).emit('new:message', populated);

    // Notify other participants
    const otherParticipants = conversation.participants.filter(
      (p) => p.toString() !== req.user._id.toString()
    );
    otherParticipants.forEach((participantId) => {
      io.to(`user:${participantId}`).emit('new:chat:message', {
        conversationId,
        message: populated,
      });
    });
  } catch (e) { /* Socket may not be initialized */ }

  res.status(201).json({ success: true, message: populated });
});
