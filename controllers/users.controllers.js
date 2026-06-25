const Follower = require("../models/Follower");
const User = require("../models/User");

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find().select("-createdAt -updatedAt -__v");
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios" });
  }
};

const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = req.usuario;
    const seguidoresCount = await Follower.countDocuments({
      following: usuario._id,
    });

    res.status(200).json({
      id: usuario._id,
      nickname: usuario.nickname,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      fecha_nacimiento: usuario.fecha_nacimiento,
      seguidoresCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el usuario" });
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

const actualizarUsuario = async (req, res) => {
  try {
    const usuarioAnt = req.usuario;
    const usuario = await User.findByIdAndUpdate(usuarioAnt._id, req.body, {
      new: true,
    });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const borrarUsuario = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.usuario._id);
    res.status(200).json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const seguirUsuario = async (req, res) => {
  try {
    const seguidor = req.seguidor;
    const usuario = req.usuario;
    await Follower.create({ follower: seguidor._id, following: usuario._id });
    res.status(200).json({ message: "Usuario seguido" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al seguir el usuario" });
  }
};

const dejarDeSeguirUsuario = async (req, res) => {
  try {
    const seguidor = req.seguidor;
    const usuario = req.usuario;
    await Follower.findOneAndDelete({
      follower: seguidor._id,
      following: usuario._id,
    });
    res.status(200).json({ message: "Usuario dejado de seguir" });
  } catch (error) {
    res.status(500).json({ error: "Error al dejar de seguir el usuario" });
  }
};

const obtenerSeguidores = async (req, res) => {
  try {
    const usuario = req.usuario;
    const seguidores = await Follower.find({ following: usuario._id }).populate(
      "follower",
      "nickname",
    );
    res.status(200).json(seguidores);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los seguidores" });
  }
};

const obtenerSeguidos = async (req, res) => {
  try {
    const usuario = req.usuario;
    const seguidos = await Follower.find({ follower: usuario._id }).populate(
      "following",
      "nickname",
    );
    res.status(200).json(seguidos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los seguidos" });
  }
};

module.exports = {
  obtenerUsuarios,
  crearUsuario,
  obtenerUsuarioPorId,
  actualizarUsuario,
  borrarUsuario,
  seguirUsuario,
  dejarDeSeguirUsuario,
  obtenerSeguidores,
  obtenerSeguidos,
};
