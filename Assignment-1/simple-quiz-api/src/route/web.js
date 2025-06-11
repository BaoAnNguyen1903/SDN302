const express = require('express');
const {getHomepage, getCreateQuizPage, getQuizDetailPage, getUpdateQuizPage, getCreateQuestionPage, getListQuestionPage, getQuestionDetailPage, getUpdateQuestionPage} = require('../controller/homeController');
const router = express.Router();

router.get('/', getHomepage);
router.get('/createQuizPage', getCreateQuizPage);
router.get('/listQuestions', getListQuestionPage)
router.get('/createQuestionPage', getCreateQuestionPage);
router.get('/quiz/:quizId', getQuizDetailPage);
router.get('/quizzes/:quizId/edit', getUpdateQuizPage);
router.get('/questions/:id', getQuestionDetailPage),
router.get('/questions/:questionId/edit', getUpdateQuestionPage);

module.exports = router;