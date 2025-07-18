const mongoose = require('mongoose');

const quizzSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }]
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Add index for faster queries
quizzSchema.index({ title: 1 });

// Add method to check if a question exists in the quiz
quizzSchema.methods.hasQuestion = function(questionId) {
  return this.questions.includes(questionId);
};

// Add method to get question count
quizzSchema.virtual('questionCount').get(function() {
  return this.questions.length;
});

module.exports = mongoose.model('Quizz', quizzSchema);