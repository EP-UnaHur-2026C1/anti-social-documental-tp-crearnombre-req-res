const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");
const { redisClient } = require("../config/redis");


const crearComentario = async (req, res) => {
  try {
    const { userNickname, postId, descripcion } = req.body;

    const newComment = await Comment.create({
      userNickname,
      postId,
      descripcion,
    });
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
    });
    await redisClient.del(`post:${postId}`);
    await redisClient.del("posts");

    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const actualizarComentario = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { descripcion } = req.body;
    const comentarioActualizado = await Comment.findByIdAndUpdate(
      commentId,
      {
        descripcion,
        fecha: Date.now(),
      },
      { new: true },
    );

    if (!comentarioActualizado) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }
    await redisClient.del(`post:${comentarioActualizado.postId}`);
    await redisClient.del("posts");

    res.json(comentarioActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const eliminarComentario = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comentarioEliminado = await Comment.findByIdAndDelete(commentId);

    if (!comentarioEliminado) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }

    await Post.findByIdAndUpdate(comentarioEliminado.postId, {
      $pull: { comments: commentId },
    });
    await redisClient.del(`post:${comentarioEliminado.postId}`);
    await redisClient.del("posts");

    res.json(comentarioEliminado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerComentariosPorPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comentarios = await Comment.find({ postId });
    const comentariosVisibles = comentarios.filter(
      (comentario) => comentario.visibilidad,
    );

    res.json(comentariosVisibles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerComentarioPorId = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comentario = await Comment.findById(commentId);

    if (!comentario) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }

    res.json(comentario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  crearComentario,
  actualizarComentario,
  eliminarComentario,
  obtenerComentariosPorPost,
  obtenerComentarioPorId,
};
