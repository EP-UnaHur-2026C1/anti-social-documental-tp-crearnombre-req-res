const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
 nombre: {
  type: String,
  required: [true, 'Tag name is required'],
  unique: true,
  trim: true
 }
}, {
 timestamps: true, 
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;