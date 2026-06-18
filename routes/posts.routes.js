const express = require('express');
const router = express.Router();

const {
 agregarImagen,
 eliminarImagen
} = require('../controllers/posts.controllers');



router.post('/:id/imagenes', agregarImagen);
router.delete('/:id/imagenes/:imageId', eliminarImagen);

module.exports = router;

