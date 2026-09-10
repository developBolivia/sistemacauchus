const express = require('express');
const router = express.Router();

// Importamos los métodos controladores que gestionan la lógica de negocio del CRUD
const productoController = require('../controllers/productoController');

// Definición de Endpoints para la entidad Producto:
// GET    /api/productos          -> Lista general de productos registrados
router.get('/', productoController.obtenerProductos);

// POST   /api/productos          -> Registro de nuevo producto
router.post('/', productoController.crearProducto);

// GET    /api/productos/:codigo  -> Consulta de un producto en específico por su clave única
router.get('/:codigo', productoController.obtenerProductoPorCodigo);

// PUT    /api/productos/:codigo  -> Actualización de datos buscando por su clave única
router.put('/:codigo', productoController.actualizarProducto);

// DELETE /api/productos/:codigo  -> Eliminación del registro por su clave única
router.delete('/:codigo', productoController.eliminarProducto);

module.exports = router;