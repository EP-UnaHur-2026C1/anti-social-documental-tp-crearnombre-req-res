const mongoose = require('mongoose');
const { imageSchema } = require('../models/Post');


const validarImage = (req, res, next) => {
 const {error} = imageSchema.validate(req.body);
 if (error) {
  return res.status(400).json({ error: error.details[0].message });
 }
 next();
};

const validarImagenId = (req, res, next) => {
 if (!mongoose.Types.ObjectId.isValid(req.params.imageId)) {
  return res.status(400).json({ error: 'ID de imagen no válido' });
 }
 next();
}

module.exports = { validarImage };
