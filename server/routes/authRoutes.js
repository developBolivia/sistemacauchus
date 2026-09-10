const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { identificador, password } = req.body;

    if (!identificador || !password) {
      return res.status(400).json({ mensaje: 'Por favor ingrese usuario y contraseña' });
    }

    const loginLimpio = identificador.trim().toLowerCase();

    // Busca coincidencia en username, celular o email
    const usuario = await Usuario.findOne({
      $or: [
        { username: loginLimpio },
        { celular: identificador.trim() },
        { email: loginLimpio }
      ]
    });

    if (!usuario) {
      return res.status(400).json({ mensaje: 'Usuario o contraseña incorrectos' });
    }

    if (!usuario.activo) {
      return res.status(403).json({ mensaje: 'Usuario desactivado. Contacte al administrador.' });
    }

    const passwordCorrecto = await usuario.compararPassword(password);
    if (!passwordCorrecto) {
      return res.status(400).json({ mensaje: 'Usuario o contraseña incorrectos' });
    }

    // Generar Token JWT
    const token = jwt.sign(
      { id: usuario._id, nombre: usuario.nombre, rol: usuario.rol },
      process.env.JWT_SECRET || 'secreto_fallback',
      { expiresIn: '8h' }
    );

    res.json({
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        username: usuario.username,
        celular: usuario.celular,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('Error en Login:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

module.exports = router;