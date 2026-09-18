const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: [true, 'Module is required'],
    },
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['video', 'document', 'text', 'quiz'],
      required: [true, 'Lesson type is required'],
    },
    videoUrl: {
      type: String,
      default: '',
    },
    documentUrl: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

lessonSchema.index({ module: 1, order: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);
