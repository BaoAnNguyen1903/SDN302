const Question = require('../model/question');
const Quiz = require('../model/quiz');
const mongoose = require('mongoose');

exports.createQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res.redirect('/listQuestions');
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.createManyQuestion = async (req, res) => {
  try {
    const questions = await Question.insertMany(req.body);
    res.status(201).json(questions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllQuestion = async (req, res) => {
  const q = await Question.find({});
  res.json(q);
};

// GET /question/:id
exports.getQuestion = async (req, res) => {
  const q = await Question.findById(req.params.id);
  res.json(q);
};

// PUT /question/:id
exports.updateQuestion = async (req, res) => {
  const updated = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.redirect('/listQuestions');
};

// DELETE /question/:id
exports.deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const isUsedInQuiz = await Quiz.findOne({ questions: questionId });

    if (isUsedInQuiz) {
      return res.status(400).json({ message: "This question is used in a quiz and cannot be deleted." });
    }
    const deletedQuestion = await Question.findByIdAndDelete(questionId);

    if (!deletedQuestion) {
      return res.status(404).json({ message: "Don't match ID" });
    }

    res.redirect("/listQuestions")
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.deleteAllQuestion = async (req, res) => {
  try {
    const quizzes = await Quiz.find({}, 'questions'); // chỉ lấy trường 'questions'
    let usedQuestionIds = [];

    quizzes.forEach(quiz => {
      usedQuestionIds.push(...quiz.questions.map(id => id.toString()));
    });

    // Bước 2: Tìm các câu hỏi KHÔNG nằm trong quiz nào
    const deletableQuestions = await Question.find({
      _id: { $nin: usedQuestionIds } // $nin = không nằm trong danh sách
    });

    // Bước 3: Nếu không có câu hỏi nào để xoá thì báo lại
    if (deletableQuestions.length === 0) {
      return res.status(404).json({ message: "Không có câu hỏi nào để xoá." });
    }

    // Bước 4: Xoá những câu hỏi không bị dùng trong quiz
    await Question.deleteMany({ _id: { $in: deletableQuestions.map(q => q._id) } });

    res.status(200).json({ message: `Đã xoá ${deletableQuestions.length} câu hỏi.` });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};