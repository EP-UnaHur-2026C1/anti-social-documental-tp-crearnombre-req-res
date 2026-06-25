const express = require("express");
const router = express.Router();
const tagsController = require("../controllers/tags.controllers");
const { validarTagPorId } = require("../middlewares/validarTag.middlewares");
const { obtenerPostPorId } = require("../controllers/posts.controllers");


router.get("/", tagsController.obtenerTags);
router.post("/", tagsController.crearTag);
router.put("/:id", tagsController.actualizarTag);
router.delete("/:id", tagsController.eliminarTag);

module.exports = router;