const Producto = require('../models/Producto');

// Obtener todos los productos (con la información de su tipo unificada via .populate)
exports.obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find().populate('tipo', 'nombre');
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los productos', error: error.message });
  }
};

// Crear un nuevo producto terminado
exports.crearProducto = async (req, res) => {
  try {
    const { codigo, descripcion, peso, tipo, stockActual } = req.body;

    // Verificar si el código ya está registrado
    const productoExiste = await Producto.findOne({ codigo });
    if (productoExiste) {
      return res.status(400).json({ mensaje: `El producto con código ${codigo} ya existe` });
    }

    const nuevoProducto = new Producto({
      codigo,
      descripcion,
      peso,
      tipo,
      stockActual,
    });

    await nuevoProducto.save();
    res.status(201).json({ mensaje: 'Producto creado exitosamente', producto: nuevoProducto });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear el producto', error: error.message });
  }
};

// Buscar un solo producto por su código interno
exports.obtenerProductoPorCodigo = async (req, res) => {
  try {
    const producto = await Producto.findOne({ codigo: req.params.codigo }).populate('tipo', 'nombre');
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar el producto', error: error.message });
  }
};

// Actualizar un producto existente por su código
exports.actualizarProducto = async (req, res) => {
  try {
    const productoActualizado = await Producto.findOneAndUpdate(
      { codigo: req.params.codigo },
      req.body,
      { new: true, runValidators: true }
    );

    if (!productoActualizado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto actualizado exitosamente', producto: productoActualizado });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar el producto', error: error.message });
  }
};