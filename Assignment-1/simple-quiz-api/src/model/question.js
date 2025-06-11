const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: String,
    description: String,
    options: [String],
    keywords: [String],
    correctAnswerIndex: Number
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
 