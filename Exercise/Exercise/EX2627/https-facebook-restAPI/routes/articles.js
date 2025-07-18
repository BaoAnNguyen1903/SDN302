const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware xác thực JWT
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, 'your_jwt_secret', (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

// Dữ liệu mẫu
let articles = [
  { id: 1, title: 'Bài viết 1', content: 'Nội dung 1' },
  { id: 2, title: 'Bài viết 2', content: 'Nội dung 2' }
];

// GET all articles (không cần xác thực)
router.get('/', (req, res) => {
  res.json(articles);
});

// POST article (cần xác thực)
router.post('/', authenticateJWT, (req, res) => {
  const { title, content } = req.body;
  const newArticle = { id: articles.length + 1, title, content };
  articles.push(newArticle);
  res.status(201).json(newArticle);
});

// PUT article (cần xác thực)
router.put('/:id', authenticateJWT, (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content } = req.body;
  const article = articles.find(a => a.id === id);
  if (!article) return res.sendStatus(404);
  article.title = title;
  article.content = content;
  res.json(article);
});

// DELETE article (cần xác thực)
router.delete('/:id', authenticateJWT, (req, res) => {
  const id = parseInt(req.params.id);
  const index = articles.findIndex(a => a.id === id);
  if (index === -1) return res.sendStatus(404);
  articles.splice(index, 1);
  res.sendStatus(204);
});

module.exports = router; 