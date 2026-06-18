const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
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