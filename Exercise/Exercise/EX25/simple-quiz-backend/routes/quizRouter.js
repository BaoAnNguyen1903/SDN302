const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const Question = require('../models/questionModel');

// API endpoints
router.get('/', quizController.getAllQuizzes);
router.get('/:id', quizController.getQuizById);
router.get('/:id/populate', quizController.getQuizWithCapitalQuestions);
router.post('/', quizController.createQuiz);
router.put('/:id', quizController.updateQuiz);
router.delete('/:id', quizController.deleteQuiz);

// Question management endpoints
router.get('/:quizId/available-questions', quizController.getAvailableQuestions);
router.post('/:quizId/questions/:questionId', quizController.addExistingQuestionToQuiz);
router.delete('/:quizId/questions/:questionId', quizController.removeQuestionFromQuiz);
router.post('/:quizId/questions', quizController.addNewQuestionToQuiz);

module.exports = router;
