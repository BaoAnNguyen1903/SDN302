const express = require('express');
const question = require('../controller/questionController');
const quiz = require('../controller/quizController');

const router = express.Router();

router.post('/quizzes/submit-quiz', quiz.submitQuiz);

router.post('/questions', question.createQuestion);
router.post('/bulkQuestions', question.createManyQuestion);
router.get('/questions', question.getAllQuestion);
router.get('/questions/:id', question.getQuestion);
router.post('/questions/:id', question.updateQuestion);
router.post('/deleteQuestions/:id', question.deleteQuestion);
router.delete('/questions', question.deleteAllQuestion);

router.post('/quizzes', quiz.createQuiz);
router.get('/quizzes', quiz.getAllQuizzes);
router.get('/quizzes/:id', quiz.getQuiz);
router.post('/quizzes/:id', quiz.updateQuiz);
router.post('/deleteQuizzes/:id', quiz.deleteQuiz);

router.get('/quizzes/:id/populate', quiz.findQuestionsByKeyword);
router.post('/quizzes/:id/question', quiz.addSingleQuestionToQuiz);
router.post('/quizzes/:id/questions', quiz.addManyQuestionsToQuiz);



module.exports = router;