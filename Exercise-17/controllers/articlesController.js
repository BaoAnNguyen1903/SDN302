const Article = require('../models/article');

exports.getAllArticles = async (req, res) => {
  const articles = await Article.find().populate('comments');
  res.json(articles);
};

exports.createArticle = async (req, res) => {
  const article = await Article.create(req.body);
  res.status(201).json(article);
};

exports.getArticleById = async (req, res) => {
  const article = await Article.findById(req.params.id).populate('comments');
  res.json(article);
};

exports.updateArticle = async (req, res) => {
  const updated = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.deleteArticle = async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.status(204).send();
};
