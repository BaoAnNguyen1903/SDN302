// app.js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello HTTPS!');
});

module.exports = app;
