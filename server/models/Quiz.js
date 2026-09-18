const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctAnswer: {
    type: Number,
    required: [true, 'Correct answer index is required'],
  },
  marks: {
    type: Number,
    default: 1,
  },
  explanation: {
    type: String,
    default: '',
  },
});

const quizSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
    },
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    questions: [questionSchema],
    timeLimit: {
      type: Number, // in minutes
      default: 30,
    },
    passingScore: {
      type: Number, // percentage
      default: 50,
    },
    attemptsAllowed: {
      type: Number,
      default: 3,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

quizSchema.index({ course: 1 });
quizSchema.index({ lesson: 1 });

module.exports = mongoose.model('Quiz', quizSchema);
