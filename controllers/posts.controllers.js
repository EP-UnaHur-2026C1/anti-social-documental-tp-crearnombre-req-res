const Post = require('../models/Post');


const agregarImagen = async (req, res) => {
 try {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) { // despues lo paso a un middleware
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
  if (!post) { // despues lo paso a un middleware
   return res.status(404).json({ error: 'Post no encontrado' });
  }
  post.imagenes = post.imagenes.filter(img => img._id.toString() !== imageId);
  await post.save();
  res.status(200).json(post);
 } catch (error) {
  res.status(500).json({ error: 'Error al eliminar la imagen' });
 }
};

module.exports = {
 agregarImagen,
 eliminarImagen
};