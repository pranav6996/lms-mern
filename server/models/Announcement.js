const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    title: {
      type: String,
      required: [true, 'Announcement title is required'],
    },
    content: {
      type: String,
      required: [true, 'Announcement content is required'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

announcementSchema.index({ course: 1 });
announcementSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Announcement', announcementSchema);
