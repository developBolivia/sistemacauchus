
const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// Rutas para /api/productos
router.get('/', productoController.obtenerProductos);
router.post('/', productoController.crearProducto);
router.get('/:codigo', productoController.obtenerProductoPorCodigo);
router.put('/:codigo', productoController.actualizarProducto);

module.exports = router;