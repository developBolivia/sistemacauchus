require('dotenv').config();
const mongoose = require('mongoose');
const Usuario = require('./models/Usuario');

const crearAdminInicial = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB...');

    // Limpia cualquier registro anterior que coincida en username, email o celular
    await Usuario.deleteMany({
      $or: [
        { username: 'admin' },
        { email: 'admin@cauchus.com' },
        { celular: '70000000' }
      ]
    });

    const nuevoAdmin = new Usuario({
      nombre: 'Administrador Principal',
      username: 'admin',
      celular: '70000000',
      email: 'admin@cauchus.com',
      password: 'admin123password',
      rol: 'ADMIN'
    });

    await nuevoAdmin.save();
    console.log('✅ Usuario Administrador listo:');
    console.log('   Username: admin');
    console.log('   Celular: 70000000');
    console.log('   Email: admin@cauchus.com');
    console.log('   Password: admin123password');

    process.exit();
  } catch (error) {
    console.error('Error al crear usuario:', error);
    process.exit(1);
  }
};

crearAdminInicial();