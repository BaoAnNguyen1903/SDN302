const Question = require('../model/question');
const Quiz = require('../model/quiz')

// GET /quizzes
exports.getAllQuizzes = async (req, res) => {
  const quizzes = await Quiz.find().populate('questions');
  res.json(quizzes);
};

// GET /quizzes/:quizId
exports.getQuiz = async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).populate('questions');
  res.json(quiz);
};

// POST /quizzes
exports.createQuiz = async (req, res) => {
  const quiz = await Quiz.create(req.body);
  res.status(201).json(quiz);
};

// PUT /quizzes/:quizId
exports.updateQuiz = async (req, res) => {
  try {
    const { questions } = req.body;

    // Kiểm tra trùng lặp trong mảng questions
    if (questions && Array.isArray(questions)) {
      const uniqueIds = new Set(questions.map(id => id.toString()));
      if (uniqueIds.size !== questions.length) {
        return res.status(400).json({ message: 'Question ID already exists in the list.' });
      }
    }

    const updated = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// DELETE /quizzes/:quizId
exports.deleteQuiz = async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);

    if (!deletedQuiz) {
      return res.status(404).json({ message: "Don't match ID" });
    }

    res.status(200).json({ message: "Delete Successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// GET /quizzes/:quizId/populate
exports.findQuestionsByKeyword = async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).populate({
    path: 'questions',
    match: { keywords: 'capital' }
  });
  res.json(quiz.questions);
};

// POST /quizzes/:quizId/question
exports.addSingleQuestionToQuiz = async (req, res) => {
  const question = await Question.create(req.body);
  const quiz = await Quiz.findByIdAndUpdate(
    req.params.id,
    { $push: { questions: question._id } },
    { new: true }
  );
  res.json(quiz);
};

// POST /quizzes/:quizId/questions
exports.addManyQuestionsToQuiz = async (req, res) => {
  const questions = await Question.insertMany(req.body); // req.body = array of questions
  const ids = questions.map(q => q._id);
  const quiz = await Quiz.findByIdAndUpdate(
    req.params.id,
    { $push: { questions: { $each: ids } } },
    { new: true }
  );
  res.json(quiz);
};