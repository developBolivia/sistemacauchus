const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true }, 
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true }, 
  celular: { type: String, unique: true, sparse: true, trim: true }, 
  password: { type: String, required: true },
  rol: { 
    type: String, 
    enum: ['ADMIN', 'ALMACEN', 'CONSULTA'], 
    default: 'ALMACEN' 
  },
  activo: { type: Boolean, default: true }
}, { timestamps: true });

// Encriptar contraseña antes de guardar (Sintaxis corregida para Mongoose moderno)
usuarioSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar contraseñas en el Login
usuarioSchema.methods.compararPassword = async function(passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.password);
};

module.exports = mongoose.model('Usuario', usuarioSchema);