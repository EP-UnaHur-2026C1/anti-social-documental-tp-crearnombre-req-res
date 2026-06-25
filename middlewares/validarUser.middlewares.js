const User = require("../models/User");
const {
  usuarioSchema,
  actualizarUsuarioSchema,
} = require("../schemas/user.schema");

const validarUsuario = (req, res, next) => {
  const { error } = usuarioSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: "Estructura de usuario no valida" });
  }
  next();
};

const validarActualizarUsuario = (req, res, next) => {
  const { error } = actualizarUsuarioSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: "Estructura de usuario no valida" });
  }
  next();
};

const validarUsuarioId = async (req, res, next) => {
  const { id } = req.params;
  const usuario = await User.findById(id);
  if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  req.usuario = usuario;
  next();
};

const validarNickname = async (req, res, next) => {
  try {
    const { nickname } = req.body || {};

    if (!nickname) return next();

    const existente = await User.findOne({ nickname });
    if (existente) {
      const paramId = req.params && req.params.id;
      if (!paramId || String(existente._id) !== String(paramId)) {
        return res.status(409).json({ error: "El nickname ya está en uso" });
      }
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const validarSeguidorId = async (req, res, next) => {
  const { seguidorId } = req.body;
  const seguidor = await User.findById(seguidorId);
  if (!seguidor) {
    return res.status(404).json({ error: "Seguidor no encontrado" });
  }
  req.seguidor = seguidor;
  next();
};

const validarNoSeguirseASiMismo = (req, res, next) => {
  if (req.usuario._id.equals(req.seguidor._id)) {
    return res.status(400).json({ error: "No podes seguirte a vos mismo" });
  }
  next();
};

module.exports = {
  validarUsuario,
  validarNickname,
  validarUsuarioId,
  validarActualizarUsuario,
  validarSeguidorId,
  validarNoSeguirseASiMismo,
};
