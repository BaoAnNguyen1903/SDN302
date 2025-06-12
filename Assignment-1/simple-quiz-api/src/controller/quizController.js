const Question = require('../model/question');
const Quiz = require('../model/quiz')
const mongoose = require('mongoose');

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
  try {
    const { title, description, questions: existingIds = [], newQuestions = [] } = req.body;

    const quiz = new Quiz({ title, description, questions: [] });

    // 1. Ép các id từ string thành ObjectId
    const existingObjectIds = Array.isArray(existingIds)
      ? existingIds.map(id => new mongoose.Types.ObjectId(id))
      : [new mongoose.Types.ObjectId(existingIds)];

    quiz.questions.push(...existingObjectIds);

    // 2. Tạo mới câu hỏi nếu có
    if (Array.isArray(newQuestions)) {
      for (const nq of newQuestions) {
        if (!nq.text || !nq.options || nq.correctIndex == null) continue; // bỏ qua câu hỏi rỗng
        const qDoc = await Question.create({
          text: nq.text,
          options: nq.options,
          correctAnswerIndex: nq.correctIndex
        });
        quiz.questions.push(qDoc._id);
      }
    }

    await quiz.save();
    return res.redirect('/');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error khi tạo quiz: ' + err.message);
  }
};


// PUT /quizzes/:quizId
exports.updateQuiz = async (req, res) => {
  try {
    const { questions } = req.body || {};

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

    return res.redirect('/');
  } catch (error) {
    console.error('Update quiz error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};



// DELETE /quizzes/:quizId
exports.deleteQuiz = async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);

    if (!deletedQuiz) {
      return res.status(404).json({ message: "Don't match ID" });
    }

    res.redirect('/'); // ✅ Chỉ dùng 1 lần là OK
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
  const questions = await Question.insertMany(req.body);
  const ids = questions.map(q => q._id);
  const quiz = await Quiz.findByIdAndUpdate(
    req.params.id,
    { $push: { questions: { $each: ids } } },
    { new: true }
  );
  res.json(quiz);
};


//nộp bài
exports.submitQuiz = async (req, res) => {
  try {
    const answers = req.body.answers; // { questionId: selectedOption }

    const results = [];

    for (const [questionId, selectedOption] of Object.entries(answers)) {
      const question = await Question.findById(questionId);

      if (!question) {
        results.push({
          questionId,
          correct: false,
          message: 'Không tìm thấy câu hỏi.'
        });
        continue;
      }

      const correctAnswer = question.options[question.correctAnswerIndex];
      const isCorrect = selectedOption === correctAnswer;

      results.push({
        questionId,
        correct: isCorrect,
        correctAnswer,
        selectedAnswer: selectedOption
      });
    }

    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};