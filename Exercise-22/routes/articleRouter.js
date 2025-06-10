const express = require('express');
const articleController = require('../controllers/articleController');
const passport = require('passport');

const articleRouter = express.Router();

// Middleware xử lý dữ liệu đầu vào
articleRouter.use(express.json());
articleRouter.use(express.urlencoded({ extended: true }));

// 📄 Route chính cho /articles
articleRouter.route('/')
  .get(passport.authenticate('local'), articleController.findAll)
  .post(passport.authenticate('local'), articleController.create)
  .put((req, res) => {
    res.status(403).json('PUT operation not supported on /articles');
  })
  .delete(passport.authenticate('local'), articleController.delete);

// 📄 Route cho /articles/:id
articleRouter.route('/:id')
  .get(articleController.findById)
  .post(passport.authenticate('local'), (req, res) => {
    res.status(403).end('POST operation not supported on /articles/' + req.params.id);
  })
  .put(articleController.update)
  .delete(passport.authenticate('local'), articleController.delete);

module.exports = articleRouter;
