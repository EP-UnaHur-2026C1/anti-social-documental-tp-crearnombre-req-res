const mongoose = require('mongoose');

const validarImage = (req, res, next) => {
 if (!req.body.url || typeof req.body.url !== 'string') {
  return res.status(400).json({ error: "Imagen no válida" });
 }
 next();
};


const validarImageId = (req, res, next) => {
 if (!mongoose.Types.ObjectId.isValid(req.params.imageId)) {
  return res.status(400).json({ error: 'ID de imagen no válido' });
 }
 next();
}

module.exports = { validarImage, validarImageId };
