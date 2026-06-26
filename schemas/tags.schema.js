const Joi = require("joi");

const crearTagSchema = Joi.object({
  nombre: Joi.string().trim().required().messages({
    "string.base": "El nombre del tag debe ser texto",
    "string.empty": "El nombre del tag no puede estar vacío",
  }),
});

const actualizarTagSchema = Joi.object({
  nombre: Joi.string().trim().required().messages({
    "string.base": "El nombre del tag debe ser texto",
    "string.empty": "El nombre del tag no puede estar vacío",
  }),
});

const eliminarTagSchema = Joi.object({
  tagId: Joi.string().hex().length(24).required().messages({
    "string.base": "El ID del tag debe ser texto",
    "string.hex": "El ID del tag no es un ObjectId válido",
  }),
});

const obtenerTagsSchema = Joi.object({
  tagId: Joi.string().hex().length(24).required().messages({
    "string.base": "El ID del tag debe ser texto",
    "string.hex": "El ID del tag no es un ObjectId válido",
  }),
});

module.exports = {
  crearTagSchema,
  actualizarTagSchema,
  eliminarTagSchema,
  obtenerTagsSchema,
};
