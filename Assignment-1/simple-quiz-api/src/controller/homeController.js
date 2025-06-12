const Question = require("../model/question");
const Quiz = require("../model/quiz");

const getHomepage = async (req, res) => {
    let results = await Quiz.find({});
    return res.render('layout/home.ejs', {
        listQuiz: results,
    });
};

const getCreateQuizPage = async (req, res) => {
  const questions = await Question.find({});
  res.render('quiz/create.ejs', { questions });
};


const getUpdateQuizPage = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).send('Quiz not found');
    }

    // Truyền quiz vào view
    res.render('quiz/edit.ejs', { quiz });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

const getQuizDetailPage = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('questions');
    if (!quiz) {
      return res.status(404).send('Quiz not found');
    }
    res.render('quiz/detail.ejs', { quiz });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

const getCreateQuestionPage = (req, res) => {
    res.render('question/create.ejs')
}

const getListQuestionPage = async (req, res) => {
    let results = await Question.find({});
    return res.render('question/list.ejs', {
        listQuestion: results,
    });
};

const getQuestionDetailPage = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
    if (!question) {
      return res.status(404).send('question not found');
    }
    res.render('question/detail.ejs', { question });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

const getUpdateQuestionPage = async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return res.status(404).send('Quiz not found');
    }

    res.render('question/edit.ejs', { question });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
    getHomepage,
    getCreateQuizPage,
    getQuizDetailPage,
    getUpdateQuizPage,
    getCreateQuestionPage,
    getListQuestionPage,
    getQuestionDetailPage,
    getUpdateQuestionPage
}