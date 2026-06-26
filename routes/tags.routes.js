const express = require("express");
const router = express.Router();
const tagsController = require("../controllers/tags.controllers");
const {
  validarTag,
  validarTagPorId,
} = require("../middlewares/validarTag.middlewares");

router.get("/", tagsController.obtenerTags);
router.post("/", validarTag, tagsController.crearTag);
router.put("/:id", validarTagPorId, validarTag, tagsController.actualizarTag);
router.delete("/:id", validarTagPorId, tagsController.eliminarTag);

module.exports = router;
