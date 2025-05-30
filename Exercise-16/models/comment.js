const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: String,
  article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' }
});

module.exports = mongoose.model('Comment', commentSchema);
