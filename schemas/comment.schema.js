const Joi = require("joi");

const crearComentarioSchema = Joi.object({
    userNickname: Joi.string().trim().required().messages({
        "string.base": "El nickname del usuario debe ser texto",
        "string.empty": "El nickname del usuario no puede estar vacío"
    }),
    postId: Joi.string().hex(24).required().messages({
        "string.base": "El ID del post debe ser texto",
        "string.hex": "El ID del post no es un ObjectId válido",
    }),
    descripcion: Joi.string().trim().required().messages({
        "string.base": "La descripción debe ser texto",
        "string.empty": "La descripción no puede estar vacía"
    })
});

const actualizarComentarioSchema = Joi.object({
    descripcion: Joi.string().trim().required().messages({
        "string.base": "La descripción debe ser texto",
        "string.empty": "La descripción no puede estar vacía"
    })
});

const eliminarComentarioSchema = Joi.object({
    commentId: Joi.string().hex(24).required().messages({
        "string.base": "El ID del comentario debe ser texto",
        "string.hex": "El ID del comentario no es un ObjectId válido",
    }),
});

const obtenerComentariosSchema = Joi.object({
    postId: Joi.string().hex(24).required().messages({
        "string.base": "El ID del post debe ser texto",
        "string.hex": "El ID del post no es un ObjectId válido",
    }),
});

const obtenerComentarioSchema = Joi.object({
    commentId: Joi.string().hex(24).required().messages({
        "string.base": "El ID del comentario debe ser texto",
        "string.hex": "El ID del comentario no es un ObjectId válido",
    }),
});



module.exports = { crearComentarioSchema, actualizarComentarioSchema, eliminarComentarioSchema, obtenerComentariosSchema, obtenerComentarioSchema, };