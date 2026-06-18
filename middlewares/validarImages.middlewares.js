const mongoose = require('mongoose');
const { imageSchema } = require('../models/Post');


const validarImage = (req, res, next) => {
 const {error} = imageSchema.validate(req.body);
 if (error) {
  return res.status(400).json({ error: error.details[0].message });
 }
 next();
};



module.exports = { validarImage };
