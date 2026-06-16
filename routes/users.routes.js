const express = require("express");
const router = express.Router();
const userController = require("../controllers/users.controllers");
const {
  validarUsuario,
  validarNickname,
} = require("../middlewares/validarUser.middlewares");

router.get("/", userController.obtenerUsuarios);
router.post("/", validarUsuario, validarNickname, userController.crearUsuario);

module.exports = router;
