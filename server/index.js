require('dotenv').config();
const express = require('express');
const cors = require('cors');
const conectarDB = require('./db');

// Importar archivos de rutas
const tipoProductoRoutes = require('./routes/tipoProductoRoutes');
const productoRoutes = require('./routes/productoRoutes');

const app = express();

// Conectar a la base de datos
conectarDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Enlazar Endpoints de la API
app.use('/api/tipos-producto', tipoProductoRoutes);
app.use('/api/productos', productoRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor del Sistema de Cauchos funcionando');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
});