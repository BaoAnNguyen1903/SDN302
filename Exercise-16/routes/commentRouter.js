const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Article = require('../models/article');

router.post('/:articleId', async (req, res) => {
  const { content } = req.body;
  const comment = await Comment.create({ content, article: req.params.articleId });
  await Article.findByIdAndUpdate(req.params.articleId, {
    $push: { comments: comment._id }
  });
  res.json(comment);
});

router.get('/:articleId', async (req, res) => {
  const article = await Article.findById(req.params.articleId).populate('comments');
  res.json(article);
});

module.exports = router;
