const Tag = require("../models/Tag");
const { crearTagSchema } = require("../schemas/tags.schema");

const validarTag = (req, res, next) => {
  const { error } = crearTagSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: "Estructura de tag no valida" });
  }
  next();
};

const validarTagPorId = (req, res, next) => {
  try {
    const { id } = req.params;
    const tag = Tag.findById(id);
    if (!tag) {
      res.status(404).json({ message: "Tag no encontrado" });
    }
    req.tag;
    next();
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el tag" });
  }
};

module.exports = { validarTag, validarTagPorId };
