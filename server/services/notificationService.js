const Notification = require('../models/Notification');

/**
 * Create a notification and emit via Socket.IO if available
 */
const createNotification = async ({ recipient, sender, title, message, type, link }, io) => {
  try {
    const notification = await Notification.create({
      recipient,
      sender,
      title,
      message,
      type: type || 'general',
      link: link || '',
    });

    // Emit real-time notification if Socket.IO is available
    if (io) {
      const populated = await Notification.findById(notification._id).populate('sender', 'name profileImage');
      io.to(`user:${recipient}`).emit('new:notification', populated);
    }

    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error.message);
  }
};

/**
 * Create notifications for multiple recipients
 */
const createBulkNotifications = async (recipients, { sender, title, message, type, link }, io) => {
  try {
    const notifications = recipients.map((recipient) => ({
      recipient,
      sender,
      title,
      message,
      type: type || 'general',
      link: link || '',
    }));

    await Notification.insertMany(notifications);

    // Emit real-time notifications
    if (io) {
      recipients.forEach((recipientId) => {
        io.to(`user:${recipientId}`).emit('new:notification', {
          title,
          message,
          type,
          sender,
        });
      });
    }
  } catch (error) {
    console.error('Failed to create bulk notifications:', error.message);
  }
};

module.exports = { createNotification, createBulkNotifications };
