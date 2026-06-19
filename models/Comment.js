const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
 userNickname: {
  type: mongoose.Schema.Types.String,
  ref: 'User',
  required: [true, 'User nickname is required']
 },
 postId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Post',
  required: [true, 'Post ID is required']
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