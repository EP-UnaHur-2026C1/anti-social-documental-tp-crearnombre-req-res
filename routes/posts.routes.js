const express = require('express');
const router = express.Router();
const { validarImagen } = require('../middlewares/validarImages.middlewares');

const {
 agregarImagen,
 eliminarImagen
} = require('../controllers/posts.controllers');


router.post('/:id/imagenes', validarImagen, agregarImagen);
router.delete('/:id/imagenes/:imageId', eliminarImagen);

module.exports = router;


