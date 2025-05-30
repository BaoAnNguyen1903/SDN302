const express = require('express');
const mongoose = require('mongoose');
const commentRouter = require('./routes/commentRouter');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/ex16', { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/comments', commentRouter);

app.listen(3000, () => console.log('Server is running on port 3000'));
