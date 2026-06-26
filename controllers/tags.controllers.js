const Tag = require("../models/Tag");

const obtenerTags = async (req, res) => {
  try {
    const tags = await Tag.find().select(
      "-createdAt -updatedAt -__v"
    );
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los Tags",
      error: error.message,
    });
  }
};



const crearTag = async (req, res) => {
  try {
    await Tag.create(req.body);
    res.status(201).json({ message: "Tag creado con exito!!!" });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el Tag",
      error: error.message,
    });
  }
};

const actualizarTag = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await Tag.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!tag) {
      return res.status(404).json({ message: "Tag no encontrado" });
    }

    res.status(200).json({ message: "Tag actualizado con exito!!!" });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el Tag",
      error: error.message,
    });
  }
};

const eliminarTag = async (req, res) => {
  try {
    const { id } = req.params;

    const TagEliminada = await Tag.findByIdAndDelete(id);

    if (!TagEliminada) {
      return res.status(404).json({ message: "Tag no encontrado" });
    }

    res.status(200).json({ message: "Tag eliminada con exito!!!" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el Tag",
      error: error.message,
    });
  }
};

module.exports = {
  obtenerTags,
  crearTag,
  actualizarTag,
  eliminarTag,
};