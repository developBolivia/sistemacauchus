const mongoose = require('mongoose');

const tipoProductoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del tipo de producto es obligatorio'],
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TipoProducto', tipoProductoSchema);