const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema(
  {
    nickname: {
      type: String,
      required: true,
      unique: [true, "El nickname es obligatorio"],
      trim: true,
    },
    nombre: { type: String, required: [true, "El nombre es obligatorio"] },
    apellido: { type: String, required: [true, "El apellido es obligatorio"] },
    fecha_nacimiento: {
      type: Date,
      required: [true, "La fecha de nacimiento es obligatorio"],
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", usuarioSchema);

module.exports = User;
