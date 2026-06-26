const Joi = require("joi");

const postSchema = Joi.object({
  userNickname: Joi.string().trim().required().messages({
    "string.base": "El nickname del usuario debe ser texto",
    "string.empty": "El nickname del usuario no puede estar vacío",
    "any.required": "El nickname del usuario es obligatorio",
  }),
  description: Joi.string().trim().required().messages({
    "string.base": "La descripción debe ser texto",
    "string.empty": "La descripción no puede estar vacía",
    "any.required": "La descripción es obligatoria",
  }),
  imagenes: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().uri().trim().messages({
          "string.base": "La URL de la imagen debe ser texto",
          "string.uri": "La URL de la imagen no es válida",
        }),
      }),
    )
    .messages({
      "array.base": "Las imágenes deben ser un arreglo",
    }),
  tags: Joi.array().items(Joi.string().hex()).messages({
    "array.base": "Los tags deben ser un arreglo",
    "string.hex": "Cada tag debe ser un ObjectId válido",
  }),
});

const actualizarPostSchema = Joi.object({
  description: Joi.string().trim().messages({
    "string.base": "La descripción debe ser texto",
    "string.empty": "La descripción no puede estar vacía",
  }),
  imagenes: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().uri().trim().messages({
          "string.base": "La URL de la imagen debe ser texto",
          "string.uri": "La URL de la imagen no es válida",
        }),
      }),
    )
    .messages({
      "array.base": "Las imágenes deben ser un arreglo",
    }),
  tags: Joi.array().items(Joi.string().hex()).messages({
    "array.base": "Los tags deben ser un arreglo",
    "string.hex": "Cada tag debe ser un ObjectId válido",
  }),
}).min(1);

module.exports = { postSchema, actualizarPostSchema };
