const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comments.controllers");
const {
  validarComentario,
  validarComentarioId,
  validarActualizarComentario,
  validarPostId,
} = require("../middlewares/validarComments.middlewares");

router.post("/", validarComentario, commentController.crearComentario);
router.delete(
  "/:commentId",
  validarComentarioId,
  commentController.eliminarComentario,
);
router.put(
  "/:commentId",
  validarActualizarComentario,
  commentController.actualizarComentario,
);
router.get(
  "/post/:postId",
  validarPostId,
  commentController.obtenerComentariosPorPost,
);
router.get(
  "/:commentId",
  validarComentarioId,
  commentController.obtenerComentarioPorId,
);

module.exports = router;
