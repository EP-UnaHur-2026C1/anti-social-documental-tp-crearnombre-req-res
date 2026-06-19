const express = require('express');
const router = express.Router();
const { validarImage } = require('../middlewares/validarImages.middlewares');

const {
  createPost,
  getPosts,
  deletePost,
  agregarImagen,
  eliminarImagen
} = require('../controllers/posts.controllers');

router.post('/', createPost);
router.get('/', getPosts);
router.delete('/:id', deletePost);


router.post('/:id/imagenes', validarImage, agregarImagen);
router.delete('/:id/imagenes/:imageId', eliminarImagen);

module.exports = router;


