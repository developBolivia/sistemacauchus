// Importamos el modelo de Mongoose que define la estructura del Producto
const Producto = require('../models/Producto');

/**
 * 1. OBTENER TODOS LOS PRODUCTOS
 * Consulta todos los documentos de la colección 'productos'.
 * Utiliza .populate('tipo') para traer el objeto completo del TipoProducto referenciado.
 */
exports.obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find()
      .populate('tipo', 'nombre descripcion') // Extrae solo los campos necesarios del modelo referenciado
      .sort({ createdAt: -1 }); // Ordena por fecha de creación descendente (más recientes primero)
    
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ mensaje: 'Error al consultar el inventario' });
  }
};

/**
 * 2. OBTENER UN PRODUCTO POR SU CÓDIGO
 * Realiza la búsqueda utilizando la clave primaria personalizada 'codigo' en lugar de '_id'.
 */
exports.obtenerProductoPorCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;

    // Buscamos coincidencia exacta transformando a mayúsculas y quitando espacios extras
    const producto = await Producto.findOne({ codigo: codigo.trim().toUpperCase() })
      .populate('tipo', 'nombre descripcion');

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    console.error('Error al buscar producto:', error);
    res.status(500).json({ mensaje: 'Error al buscar el producto' });
  }
};

/**
 * 3. CREAR UN NUEVO PRODUCTO
 * Recibe los datos obligatorios del formulario, valida duplicados por 'codigo' y registra el documento.
 */
exports.crearProducto = async (req, res) => {
  try {
    const { codigo, descripcion, peso, tipo, stockActual } = req.body;

    // Validación previa de campos requeridos antes de consultar la base de datos
    if (!codigo || !descripcion || peso === undefined || !tipo) {
      return res.status(400).json({ mensaje: 'Código, descripción, peso y tipo son obligatorios' });
    }

    // Normalizamos el código para garantizar consistencia en la clave única
    const codigoLimpio = codigo.trim().toUpperCase();

    // Verificamos si ya existe un registro previo con la misma clave
    const existe = await Producto.findOne({ codigo: codigoLimpio });
    if (existe) {
      return res.status(400).json({ mensaje: 'Ya existe un producto registrado con ese código' });
    }

    // Instanciamos el nuevo objeto basándonos en el esquema
    const nuevoProducto = new Producto({
      codigo: codigoLimpio,
      descripcion: descripcion.trim(),
      peso: Number(peso),
      tipo, // Contiene el ObjectId que referencia a TipoProducto
      stockActual: stockActual !== undefined ? Number(stockActual) : 0
    });

    // Guardamos en la base de datos MongoDB
    await nuevoProducto.save();

    // Poblamos la relación del tipo recién insertado antes de retornar la respuesta al cliente
    const productoPoblado = await Producto.findById(nuevoProducto._id)
      .populate('tipo', 'nombre descripcion');

    res.status(201).json(productoPoblado);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ mensaje: error.message || 'Error al registrar el producto' });
  }
};

/**
 * 4. ACTUALIZAR UN PRODUCTO POR SU CÓDIGO
 * Busca el documento según la llave 'codigo' recibida en req.params y actualiza sus campos.
 */
exports.actualizarProducto = async (req, res) => {
  try {
    const { codigo } = req.params;
    const { descripcion, peso, tipo, stockActual } = req.body;

    // findOneAndUpdate busca por el código único y aplica la actualización
    const productoActualizado = await Producto.findOneAndUpdate(
      { codigo: codigo.trim().toUpperCase() },
      {
        descripcion: descripcion?.trim(),
        peso: peso !== undefined ? Number(peso) : undefined,
        tipo,
        stockActual: stockActual !== undefined ? Number(stockActual) : undefined
      },
      { 
        new: true, // Retorna el documento ya modificado en lugar del anterior
        runValidators: true // Obliga a ejecutar las validaciones definidas en el Schema (ej. peso no negativo)
      }
    ).populate('tipo', 'nombre descripcion');

    if (!productoActualizado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado para actualizar' });
    }

    res.json(productoActualizado);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ mensaje: error.message || 'Error al actualizar el producto' });
  }
};

/**
 * 5. ELIMINAR UN PRODUCTO POR SU CÓDIGO
 * Remueve el documento correspondiente de la base de datos usando el código como identificador.
 */
exports.eliminarProducto = async (req, res) => {
  try {
    const { codigo } = req.params;

    // Eliminación directa por el parámetro de ruta 'codigo'
    const productoEliminado = await Producto.findOneAndDelete({ 
      codigo: codigo.trim().toUpperCase() 
    });

    if (!productoEliminado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ mensaje: 'Error al eliminar el producto' });
  }
};