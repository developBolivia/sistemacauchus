// 1. Cargamos las variables de entorno (.env) antes que cualquier otra cosa
require('dotenv').config();

// 2. Importamos las librerías necesarias
const express = require('express');
const cors = require('cors');

// 3. Importamos nuestra función de conexión a la Base de Datos
const conectarDB = require('./db');

// 4. Inicializamos la aplicación de Express
const app = express();

// 5. Ejecutamos la conexión a MongoDB Atlas
conectarDB();

// 6. Middlewares (Filtros y traductores de peticiones)
app.use(cors()); // Habilita peticiones cruzadas (permite que React se conecte al servidor)
app.use(express.json()); // Permite recibir y procesar JSON en el cuerpo (body) de las peticiones

// 7. Ruta de prueba (Endpoint de verificación)
app.get('/', (req, res) => {
  res.send('Servidor del Sistema de Cauchos funcionando y conectado a la Nube');
});

// 8. Encendido del Servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
});