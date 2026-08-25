const express = require('express');
const router = express.Router();
const tipoProductoController = require('../controllers/tipoProductoController');

// Rutas para /api/tipos-producto
router.get('/', tipoProductoController.obtenerTipos);
router.post('/', tipoProductoController.crearTipo);

module.exports = router;