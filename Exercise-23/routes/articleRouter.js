const express = require('express');
const articleController = require('../controllers/articleController');
const articleRouter = express.Router();
const passport = require('../config/jwtConfig'); // chứa verifyUser

// Middleware xử lý dữ liệu đầu vào
articleRouter.use(express.json());
articleRouter.use(express.urlencoded({ extended: true }));

// 📄 Route chính: /articles
articleRouter.route('/')
  .get(passport.verifyUser, articleController.findAll)
  .post(passport.verifyUser, articleController.create)
  .put((req, res) => {
    res.status(403).json('PUT operation not supported on /articles');
  })
  .delete(articleController.delete);

// 📄 Route với ID: /articles/:id
articleRouter.route('/:id')
  .get(articleController.findById)
  .post(passport.verifyUser, (req, res) => {
    res.status(403).end('POST operation not supported on /articles/' + req.params.id);
  })
  .put(articleController.update)
  .delete(passport.verifyUser, articleController.delete);

module.exports = articleRouter;
