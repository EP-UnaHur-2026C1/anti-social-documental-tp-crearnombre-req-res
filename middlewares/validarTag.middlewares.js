const mongoose = require("mongoose");
const Tag = require("../models/Tag");
const { crearTagSchema } = require("../schemas/tags.schema");

const validarTag = (req, res, next) => {
  const { error } = crearTagSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: "Estructura de tag no valida" });
  }
  next();
};

const validarTagPorId = async (req, res, next) => {
  try {
    const id = req.params.tagId || req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID de tag no válido" });
    }
    const tag = await Tag.findById(id);
    if (!tag) {
      return res.status(404).json({ error: "Tag no encontrado" });
    }
    req.tag = tag;
    next();
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el tag" });
  }
};

const validarTagIdEnBody = async (req, res, next) => {
  try {
    const { tagId } = req.body;
    if (!tagId) {
      return res.status(400).json({ error: "tagId es requerido en el cuerpo" });
    }
    if (!mongoose.Types.ObjectId.isValid(tagId)) {
      return res.status(400).json({ error: "tagId no es un ObjectId válido" });
    }
    const tag = await Tag.findById(tagId);
    if (!tag) {
      return res.status(404).json({ error: "Tag no encontrado" });
    }
    req.tag = tag;
    next();
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el tag" });
  }
};

module.exports = { validarTagPorId, validarTagIdEnBody };
