const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Post = require('../models/Post');
const { crearComentarioSchema, actualizarComentarioSchema } = require('../schemas/comment.schema');

const validarComentario = async (req, res, next) => {
  const { error } = crearComentarioSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { userNickname, postId } = req.body;
    const user = await User.findOne({ nickname: userNickname });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const validarComentarioId = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ error: 'ID de comentario no válido' });
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const validarActualizarComentario = async (req, res, next) => {
  const { error } = actualizarComentarioSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { commentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ error: 'ID de comentario no válido' });
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const validarPostId = async (req, res, next) => {
  try {
    const { postId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'ID de post no válido' });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { validarComentario, validarComentarioId, validarActualizarComentario, validarPostId };
