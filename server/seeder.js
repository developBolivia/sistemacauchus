require('dotenv').config();
const mongoose = require('mongoose');
const conectarDB = require('./db');
const TipoProducto = require('./models/TipoProducto');
const Producto = require('./models/Producto');

const insertarDatosPrueba = async () => {
  try {
    // 1. Conectar a la base de datos
    await conectarDB();

    // 2. Limpiar registros previos de prueba
    await TipoProducto.deleteMany();
    await Producto.deleteMany();
    console.log('🧹 Base de datos limpia de registros anteriores.');

    // 3. Insertar Tipos de Producto (Categorías)
    const tipoReten = await TipoProducto.create({ nombre: 'Retenes de Nitrilo' });
    const tipoEmpaque = await TipoProducto.create({ nombre: 'Empaques de Neopreno' });
    const tipoAcople = await TipoProducto.create({ nombre: 'Acoples Flexibles' });

    console.log('✅ Tipos de Producto creados con éxito:');
    console.log(`   - ID Retenes: ${tipoReten._id}`);
    console.log(`   - ID Empaques: ${tipoEmpaque._id}`);
    console.log(`   - ID Acoples: ${tipoAcople._id}`);

    // 4. Insertar Productos Terminados usando los _id obtenidos
    const productosPrueba = [
      {
        codigo: 'RET-001',
        descripcion: 'Retén de caucho nitrilo 25x40x7 mm',
        peso: 0.045,
        tipo: tipoReten._id, // Enlace con el tipo "Retenes de Nitrilo"
        stockActual: 150,
      },
      {
        codigo: 'RET-002',
        descripcion: 'Retén de caucho nitrilo 30x50x10 mm',
        peso: 0.068,
        tipo: tipoReten._id, // Enlace con el tipo "Retenes de Nitrilo"
        stockActual: 85,
      },
      {
        codigo: 'EMP-101',
        descripcion: 'Empaque plano de neopreno 4 pulgadas',
        peso: 0.120,
        tipo: tipoEmpaque._id, // Enlace con el tipo "Empaques de Neopreno"
        stockActual: 200,
      },
      {
        codigo: 'ACO-201',
        descripcion: 'Acople estrella de caucho para motor 5HP',
        peso: 0.350,
        tipo: tipoAcople._id, // Enlace con el tipo "Acoples Flexibles"
        stockActual: 40,
      },
    ];

    await Producto.insertMany(productosPrueba);
    console.log('✅ 4 Productos de prueba insertados con éxito.');

    // Finalizar proceso
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al insertar datos de prueba:', error);
    process.exit(1);
  }
};

insertarDatosPrueba();