const TipoProducto = require('../models/TipoProducto');

// Obtener todos los tipos de producto
exports.obtenerTipos = async (req, res) => {
  try {
    const tipos = await TipoProducto.find().sort({ nombre: 1 });
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los tipos de producto', error: error.message });
  }
};

// Crear un nuevo tipo de producto
exports.crearTipo = async (req, res) => {
  try {
    const { nombre } = req.body;

    // Verificar si ya existe un tipo con ese nombre
    const tipoExiste = await TipoProducto.findOne({ nombre });
    if (tipoExiste) {
      return res.status(400).json({ mensaje: `El tipo de producto "${nombre}" ya existe` });
    }

    const nuevoTipo = new TipoProducto({ nombre });
    await nuevoTipo.save();

    res.status(201).json({ mensaje: 'Tipo de producto creado exitosamente', tipo: nuevoTipo });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear el tipo de producto', error: error.message });
  }
};