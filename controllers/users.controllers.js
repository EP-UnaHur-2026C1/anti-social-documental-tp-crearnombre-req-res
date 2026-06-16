const User = require("../models/User");

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find().select("-createdAt -updatedAt -__v");
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios" });
  }
};

const crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = await User.create(req.body);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = { obtenerUsuarios, crearUsuario };
