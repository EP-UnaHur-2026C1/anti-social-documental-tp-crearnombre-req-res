const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
 userNickname: {
  type: mongoose.Schema.Types.String,
  ref: 'User'
 },
 postId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Post'
 },
 descripcion: {
  type: String,
  required: [true, 'Description is required'],
  trim: true,
 },
 fecha: {
  type: Date,
  default: Date.now,
 }
}, {
 timestamps: true,
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;