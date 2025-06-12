const express = require('express');
const {getHomepage, getCreateQuizPage, getQuizDetailPage, getUpdateQuizPage, getCreateQuestionPage, getListQuestionPage, getQuestionDetailPage, getUpdateQuestionPage} = require('../controller/homeController');
const router = express.Router();

router.get('/', getHomepage);
router.get('/createQuizPage', getCreateQuizPage);
router.get('/quizzes/:quizId/edit', getUpdateQuizPage);
router.get('/quizzes/:id', getQuizDetailPage);

router.get('/listQuestions', getListQuestionPage);
router.get('/createQuestionPage', getCreateQuestionPage);
router.get('/questions/:questionId/edit', getUpdateQuestionPage);
router.get('/questions/:id', getQuestionDetailPage);

module.exports = router;