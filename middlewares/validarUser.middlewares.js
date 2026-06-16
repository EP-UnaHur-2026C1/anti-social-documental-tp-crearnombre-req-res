const User = require("../models/User");
const usuarioSchema = require("../schemas/user.schema");

const validarUsuario = (req, res, next) => {
  const { error } = usuarioSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validarNickname = async (req, res, next) => {
  try {
    const { nickname } = req.body || {};

    if (!nickname) return next();

    const existente = await User.findOne({ nickname });
    if (existente) {
      const paramId = req.params && req.params.id;
      if (!paramId || String(existente.__id) !== String(paramId)) {
        return res.status(409).json({ error: "El nickname ya está en uso" });
      }
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { validarUsuario, validarNickname };
