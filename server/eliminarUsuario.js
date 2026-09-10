require('dotenv').config();
const mongoose = require('mongoose');
const Usuario = require('./models/Usuario');

const borrarUsuario = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB...');

    const emailABorrar = 'admin@cauchus.com'; // <-- El email que deseas eliminar

    const resultado = await Usuario.deleteOne({ email: emailABorrar });

    if (resultado.deletedCount > 0) {
      console.log(`🗑️ Usuario [${emailABorrar}] eliminado con éxito.`);
    } else {
      console.log(`⚠️ No se encontró ningún usuario con el email [${emailABorrar}].`);
    }

    process.exit();
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    process.exit(1);
  }
};

borrarUsuario();