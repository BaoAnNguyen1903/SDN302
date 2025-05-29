const express = require('express');
const question = require('../controller/questionController');
const quiz = require('../controller/quizController');

const router = express.Router();

router.post('/questions', question.createQuestion);
router.get('/questions', question.getAllQuestion);
router.get('/questions/:id', question.getQuestion);
router.put('/questions/:id', question.updateQuestion);
router.delete('/questions/:id', question.deleteQuestion);

router.post('/quizzes', quiz.createQuiz);
router.get('/quizzes', quiz.getAllQuizzes);
router.get('/quizzes/:id', quiz.getQuiz);
router.put('/quizzes/:id', quiz.updateQuiz);
router.delete('/quizzes/:id', quiz.deleteQuiz);

router.get('/quizzes/:id/populate', quiz.findQuestionsByKeyword);
router.post('/quizzes/:id/question', quiz.addSingleQuestionToQuiz);
router.post('/quizzes/:id/questions', quiz.addManyQuestionsToQuiz);

module.exports = router;