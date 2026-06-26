const express = require("express");
const router = express.Router();
const {
  validarImage,
  validarImageId,
} = require("../middlewares/validarImages.middlewares");
const {
  validarPost,
  validarPostId,
  cachePostPorId,
  validarActualizarPost,
} = require("../middlewares/validarPost.middlewares");
const {
  validarUsuarioNickname,
} = require("../middlewares/validarUser.middlewares");

const {
  validarTagPorId,
  validarTagIdEnBody
} = require("../middlewares/validarTag.middlewares.js");

const {
  createPost,
  getPosts,
  deletePost,
  agregarImagen,
  eliminarImagen,
  obtenerPostPorId,
  actualizarPost,
  agregarTag,
  eliminarTag
} = require("../controllers/posts.controllers");

router.post("/", validarPost, validarUsuarioNickname, createPost);
router.get("/", getPosts);
router.get("/:id", validarPostId, cachePostPorId, obtenerPostPorId);
router.put("/:id", validarPostId, validarActualizarPost, actualizarPost);
router.delete("/:id", validarPostId, deletePost);

router.post("/:id/imagenes", validarPostId, validarImage, agregarImagen);
router.delete("/:id/imagenes/:imageId", validarPostId, validarImageId, eliminarImagen);


router.post("/:id/tags", validarPostId, validarTagIdEnBody, agregarTag);
router.delete("/:id/tags/:tagId", validarPostId, validarTagPorId, eliminarTag);

module.exports = router;
