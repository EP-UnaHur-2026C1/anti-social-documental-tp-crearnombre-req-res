const express = require("express");
const router = express.Router();
const userController = require("../controllers/users.controllers");
const {
  validarUsuario,
  validarNickname,
  validarUsuarioId,
  validarActualizarUsuario,
  borrarUsuario,
  validarSeguidorId,
  validarNoSeguirseASiMismo,
  validarNoDuplicadoFollow,
} = require("../middlewares/validarUser.middlewares");

// Endpoints para usuario
router.get("/", userController.obtenerUsuarios);
router.get("/:id", validarUsuarioId, userController.obtenerUsuarioPorId);
router.post("/", validarUsuario, validarNickname, userController.crearUsuario);
router.put(
  "/:id",
  validarUsuarioId,
  validarActualizarUsuario,
  validarNickname,
  userController.actualizarUsuario,
);
router.delete("/:id", validarUsuarioId, userController.borrarUsuario);

// Endpoints para seguidores
router.post(
  "/:id/follow",
  validarUsuarioId,
  validarSeguidorId,
  validarNoSeguirseASiMismo,
  validarNoDuplicadoFollow,
  userController.seguirUsuario,
);
router.delete(
  "/:id/follow",
  validarUsuarioId,
  validarSeguidorId,
  userController.dejarDeSeguirUsuario,
);
router.get(
  "/:id/followers",
  validarUsuarioId,
  userController.obtenerSeguidores,
);
router.get("/:id/following", validarUsuarioId, userController.obtenerSeguidos);

// Endpoints para post
router.get("/:id/posts", validarUsuarioId, userController.obtenerPublicaciones);

module.exports = router;
