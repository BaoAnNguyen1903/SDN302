const Question = require('../models/questionModel');

// API Methods
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createQuestion = async (req, res) => {
  try {
    let options = req.body.options;
    if (typeof options === 'string') {
      options = options.split(',').map(opt => opt.trim());
    }
    const questionData = {
      ...req.body,
      options: options,
      keywords: req.body.keywords ? (
        typeof req.body.keywords === 'string'
          ? req.body.keywords.split(',').map(k => k.trim())
          : req.body.keywords
      ) : []
    };
    const question = new Question(questionData);
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    let options = req.body.options;
    if (typeof options === 'string') {
      options = options.split(',').map(opt => opt.trim());
    }
    const questionData = {
      ...req.body,
      options: options,
      keywords: req.body.keywords ? (
        typeof req.body.keywords === 'string'
          ? req.body.keywords.split(',').map(k => k.trim())
          : req.body.keywords
      ) : []
    };
    const question = await Question.findByIdAndUpdate(req.params.id, questionData, { new: true });
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(question);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ message: 'Question deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UI Methods
exports.getNewQuestionForm = (req, res) => {
  res.render('questions/new');
};

exports.getEditQuestionForm = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).render('error', { error: 'Question not found' });
    }
    res.render('questions/edit', { question });
  } catch (err) {
    res.status(500).render('error', { error: err.message });
  }
};
