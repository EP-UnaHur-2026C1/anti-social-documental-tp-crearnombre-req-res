const Post = require('../models/Post');

const agregarImagen = async (req, res) => {
 try {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) { 
   return res.status(404).json({ error: 'Post no encontrado' });
  }
  post.imagenes.push(req.body);
  await post.save();
  res.status(200).json(post);
 } catch (error) {
  res.status(500).json({ error: 'Error al agregar la imagen' });
 }
};

const eliminarImagen = async (req, res) => {
 try {
  const { id, imageId } = req.params;
  const post = await Post.findById(id);
  if (!post) { 
   return res.status(404).json({ error: 'Post no encontrado' });
  }
  post.imagenes = post.imagenes.filter(img => img._id.toString() !== imageId);
  await post.save();
  res.status(200).json({
  message: "Imagen eliminada con éxito",
  post: post
  });
 } catch (error) {
  res.status(500).json({ error: 'Error al eliminar la imagen' });
 }
};

// CREAR UN POST
const createPost = async (req, res) => {
  try {
    const { description, userNickname, imagenes, tags } = req.body;
    
    const newPost = await Post.create({
      description,
      userNickname,
      imagenes: imagenes || [],
      tags: tags || []
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//OBTENER TODOS LOS POSTS 
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('tags');
    
    const limiteMeses = parseInt(process.env.COMENTARIOS_LIMIT_MESES) || 6;
    const fechaLimite = new Date();
    fechaLimite.setMonth(fechaLimite.getMonth() - limiteMeses);

    const postsFiltrados = posts.map(post => {
      const postObj = post.toObject();
      if (postObj.comments) {
        postObj.comments = postObj.comments.filter(comment => new Date(comment.fecha) >= fechaLimite);
      }
      return postObj;
    });

    res.json(postsFiltrados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//ELIMINAR POST POR ID
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndDelete(id);
    
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }
    
    res.json({ message: 'Post eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  deletePost,
  agregarImagen,
  eliminarImagen
};
