const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// GET /api/usuarios - Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password').sort({ createdAt: -1 });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
});

// POST /api/usuarios - Crear nuevo usuario
router.post('/', async (req, res) => {
  try {
    const { nombre, username, celular, email, password, rol } = req.body;

    if (!nombre || !username || !password) {
      return res.status(400).json({ mensaje: 'Nombre, usuario y contraseña son obligatorios' });
    }

    const loginLimpio = username.trim().toLowerCase();

    // Validar duplicados
    const existe = await Usuario.findOne({
      $or: [{ username: loginLimpio }, { email: email?.toLowerCase() }]
    });

    if (existe) {
      return res.status(400).json({ mensaje: 'El nombre de usuario o correo ya está en uso' });
    }

    const nuevoUsuario = new Usuario({
      nombre,
      username: loginLimpio,
      celular: celular?.trim(),
      email: email ? email.trim().toLowerCase() : undefined,
      password,
      rol: rol ? rol.toUpperCase() : 'ALMACEN' // 👈 Ahora usa 'ALMACEN' por defecto
    });

    await nuevoUsuario.save();

    const respuesta = nuevoUsuario.toObject();
    delete respuesta.password;

    res.status(201).json(respuesta);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ mensaje: 'Error interno al crear usuario' });
  }
});

module.exports = router;