const mongoose = require('mongoose');


const imageSchema = new mongoose.Schema({
 url: {
  type: String,
  required: [true, 'Image URL is required'],
  trim: true,
 }
});

const postSchema = new mongoose.Schema({
  userNickname: {
    type: mongoose.Schema.Types.String,
    ref: 'User',
    required: [true, 'User nickname is required']
  },
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

imageSchema.validate = function(body) {

  if (!body || !body.url || body.url.trim() === '') {
    return {
      error: {
        details: [{ message: '"url" is required' }]
      }
    };
  }
  
  return { error: null };
};

module.exports = Post;
module.exports.imageSchema = imageSchema;
