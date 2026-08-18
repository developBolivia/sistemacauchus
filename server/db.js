// Importamos Mongoose (la librería que habla con MongoDB)
const mongoose = require('mongoose');

// Creamos una función asíncrona para conectarnos
const conectarDB = async () => {
  try {
    // Intentamos establecer la conexión con la URL guardada en el .env
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Conectado con éxito a: ${conn.connection.host}`);
  } catch (error) {
    // Si la contraseña está mal, no hay internet o falla la IP, atrapamos el error aquí
    console.error(`❌ Error al conectar con MongoDB: ${error.message}`);
    process.exit(1); // Detiene la aplicación si la base de datos no está disponible
  }
};

// Exportamos la función para poder usarla en nuestro archivo principal (index.js)
module.exports = conectarDB;
