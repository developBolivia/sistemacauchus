const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema(
  {
    codigo: {
      type: String,
      required: [true, 'El código del producto es obligatorio'],
      unique: true, // Funciona como tu llave primaria en MySQL
      trim: true,
      uppercase: true, // Guarda el código siempre en mayúsculas
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
    },
    peso: {
      type: Number,
      required: [true, 'El peso es obligatorio'],
      min: [0, 'El peso no puede ser negativo'],
    },
    // Equivalente a la Llave Foránea en MySQL:
    tipo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TipoProducto', // Apunta al modelo TipoProducto
      required: [true, 'El tipo de producto es obligatorio'],
    },
    stockActual: {
      type: Number,
      default: 0,
      min: [0, 'El stock no puede ser negativo'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Producto', productoSchema);