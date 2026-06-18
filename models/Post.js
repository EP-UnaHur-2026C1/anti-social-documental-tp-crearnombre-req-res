const mongoose = require('mongoose');


const imageSchema = new mongoose.Schema({
 url: {
  type: String,
  required: [true, 'Image URL is required'],
  trim: true,
 }
});

const postSchema = new mongoose.Schema({
 description: {
  type: String,
  required: [true, 'Description is required'],
  trim: true,
 },
 fecha: {
  type: Date,
  default: Date.now,
 },
 tags: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Tag'
 }],
 imagenes: [imageSchema]
}, {
 timestamps: true,
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;

