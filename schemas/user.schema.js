const Joi = require("joi");

const usuarioSchema = Joi.object({
  nickname: Joi.string().alphanum().min(3).max(30).trim().required().messages({
    "string.base": "El nickname debe ser texto",
    "string.empty": "El nickname no puede estar vacío",
    "string.alphanum": "El nickname solo puede contener letras y números",
    "string.min": "El nickname debe tener al menos 3 caracteres",
    "string.max": "El nickname debe tener como máximo 30 caracteres",
    "any.required": "El nickname es obligatorio",
  }),
  nombre: Joi.string().min(2).max(100).trim().required().messages({
    "string.base": "El nombre debe ser texto",
    "string.empty": "El nombre no puede estar vacío",
    "string.min": "El nombre debe tener al menos 2 caracteres",
    "string.max": "El nombre debe tener como máximo 100 caracteres",
    "any.required": "El nombre es obligatorio",
  }),
  apellido: Joi.string().min(2).max(100).trim().required().messages({
    "string.base": "El apellido debe ser texto",
    "string.empty": "El apellido no puede estar vacío",
    "string.min": "El apellido debe tener al menos 2 caracteres",
    "string.max": "El apellido debe tener como máximo 100 caracteres",
    "any.required": "El apellido es obligatorio",
  }),
  fecha_nacimiento: Joi.date()
    .iso()
    .less("now")
    .required()
    .allow(null)
    .messages({
      "date.base": "La fecha de nacimiento debe ser una fecha válida",
      "date.format": "La fecha debe tener formato ISO (YYYY-MM-DD)",
      "date.less": "La fecha de nacimiento no puede ser una fecha futura",
      "any.required": "La fecha de nacimiento es obligatoria",
    }),
});

const actualizarUsuarioSchema = Joi.object({
  nickname: Joi.string().alphanum().min(3).max(30).trim().messages({
    "string.base": "El nickname debe ser texto",
    "string.empty": "El nickname no puede estar vacío",
    "string.alphanum": "El nickname solo puede contener letras y números",
    "string.min": "El nickname debe tener al menos 3 caracteres",
    "string.max": "El nickname debe tener como máximo 30 caracteres",
  }),
  nombre: Joi.string().min(2).max(100).trim().messages({
    "string.base": "El nombre debe ser texto",
    "string.empty": "El nombre no puede estar vacío",
    "string.min": "El nombre debe tener al menos 2 caracteres",
    "string.max": "El nombre debe tener como máximo 100 caracteres",
  }),
  apellido: Joi.string().min(2).max(100).trim().messages({
    "string.base": "El apellido debe ser texto",
    "string.empty": "El apellido no puede estar vacío",
    "string.min": "El apellido debe tener al menos 2 caracteres",
    "string.max": "El apellido debe tener como máximo 100 caracteres",
  }),
  fecha_nacimiento: Joi.date()
    .iso()
    .less("now")
    .optional()
    .allow(null)
    .messages({
      "date.base": "La fecha de nacimiento debe ser una fecha válida",
      "date.format": "La fecha debe tener formato ISO (YYYY-MM-DD)",
      "date.less": "La fecha de nacimiento no puede ser una fecha futura",
    }),
}).min(1);

module.exports = { usuarioSchema, actualizarUsuarioSchema };
