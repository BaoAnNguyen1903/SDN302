const express = require('express');
const mongoose = require('mongoose');
const articleRoutes = require('./routes/articleRoutes');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/ex17', { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/articles', articleRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));
