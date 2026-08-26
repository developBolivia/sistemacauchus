require('dotenv').config();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const conectarDB = require('./db');
const TipoProducto = require('./models/TipoProducto');
const Producto = require('./models/Producto');

const normalizarClave = (str) =>
  str
    ? str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
    : '';

const migrarCatalogo = async () => {
  try {
    await conectarDB();

    // Limpieza previa
    await Producto.deleteMany({});
    await TipoProducto.deleteMany({});
    console.log('🧹 Base de datos de prueba limpiada (0 registros).');

    const rutaArchivo = path.join(__dirname, 'productos_base.csv');

    if (!fs.existsSync(rutaArchivo)) {
      console.error('❌ No se encontró el archivo "productos_base.csv" en la carpeta server.');
      process.exit(1);
    }

    const filasCSV = [];

    // Notar el separador ';' configurado aquí:
    fs.createReadStream(rutaArchivo)
      .pipe(csv({ separator: ';' }))
      .on('data', (data) => {
        const filaNormalizada = {};
        for (const key in data) {
          filaNormalizada[normalizarClave(key)] = data[key];
        }
        filasCSV.push(filaNormalizada);
      })
      .on('end', async () => {
        if (filasCSV.length === 0) {
          console.log('⚠️ El archivo CSV está vacío.');
          process.exit(0);
        }

        console.log(`📄 Se leyeron ${filasCSV.length} registros del CSV.`);
        console.log('🔍 Columnas detectadas:', Object.keys(filasCSV[0]));

        const buscarCampo = (fila, listaPosibles) => {
          for (const p of listaPosibles) {
            if (fila[p] !== undefined) return fila[p]?.trim();
          }
          return '';
        };

        // Extraer tipos únicos
        const tiposUnicos = [
          ...new Set(
            filasCSV
              .map((row) => buscarCampo(row, ['tipo', 'tipoproducto', 'tipo de producto', 'categoria']))
              .filter(Boolean)
          ),
        ];

        console.log(`🏷️ Se encontraron ${tiposUnicos.length} tipos de producto únicos.`);

        // Crear tipos
        const mapaTipos = {};
        for (const nombreTipo of tiposUnicos) {
          const tipoDoc = await TipoProducto.create({ nombre: nombreTipo });
          console.log(`   + Creado tipo: "${nombreTipo}"`);
          mapaTipos[nombreTipo] = tipoDoc._id;
        }

        // Preparar productos
        const productosAInsertar = [];
        let omitidosPorError = 0;

        for (const fila of filasCSV) {
          const codigo = buscarCampo(fila, ['codigo', 'code', 'cod']);
          const descripcion = buscarCampo(fila, ['descripcion', 'desc', 'detalle', 'nombre']);
          const pesoRaw = buscarCampo(fila, ['peso', 'weight']);
          const nombreTipo = buscarCampo(fila, ['tipo', 'tipoproducto', 'tipo de producto', 'categoria']);

          const peso = parseFloat(pesoRaw.replace(',', '.')) || 0;

          if (!codigo || !descripcion || !nombreTipo) {
            console.warn(`⚠️ Fila omitida por datos faltantes:`, fila);
            omitidosPorError++;
            continue;
          }

          productosAInsertar.push({
            codigo,
            descripcion,
            peso,
            tipo: mapaTipos[nombreTipo],
            stockActual: 0,
          });
        }

        // Inserción masiva
        if (productosAInsertar.length > 0) {
          await Producto.insertMany(productosAInsertar);
        }

        console.log('\n================ MIGRACIÓN EXITOSA ================');
        console.log(`✅ Categorías/Tipos creados: ${Object.keys(mapaTipos).length}`);
        console.log(`✅ Productos base importados: ${productosAInsertar.length}`);
        if (omitidosPorError > 0) console.log(`⚠️ Filas omitidas: ${omitidosPorError}`);
        console.log('===================================================\n');

        process.exit(0);
      });
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  }
};

migrarCatalogo();