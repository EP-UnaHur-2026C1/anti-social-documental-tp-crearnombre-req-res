const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Post = require('../models/Post');
const { commentSchema } = require('../schemas/comments.schema');


const validarComentario = async (req, res, next) => {
    try {
        const { userNickname, postId, descripcion } = req.body;
        if (!userNickname || typeof userNickname !== 'string') {
            return res.status(400).json({ error: 'Nickname no válido' });
        }
        if (!postId || typeof postId !== 'string') {
            return res.status(400).json({ error: 'Post ID no válido' });
        }
        if (!descripcion || typeof descripcion !== 'string') {
            return res.status(400).json({ error: 'Descripción no válida' });
        }
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
}

const validarComentarioId = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ error: 'Comentario ID no válido' });
        }
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comentario no encontrado' });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const validarActualizarComentario = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const { descripcion } = req.body;
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ error: 'Comentario ID no válido' });
        }
        if (!descripcion || typeof descripcion !== 'string') {
            return res.status(400).json({ error: 'Descripción no válida' });
        }
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comentario no encontrado' });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const validarPostId = async (req, res, next) => {
    try {
        const { postId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ error: 'Post ID no válido' });
        }
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post no encontrado' });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const validarEliminarComentario = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ error: 'Comentario ID no válido' });
        }
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comentario no encontrado' });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



module.exports = { validarComentario, validarComentarioId, validarActualizarComentario, validarPostId, validarEliminarComentario };
