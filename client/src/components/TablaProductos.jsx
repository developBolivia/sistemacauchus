import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TablaProductos = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const respuesta = await axios.get('http://localhost:5000/api/productos');
        setProductos(respuesta.data);
        setCargando(false);
      } catch (err) {
        console.error('Error al obtener productos:', err);
        setError('No se pudo conectar con el servidor.');
        setCargando(false);
      }
    };

    obtenerProductos();
  }, []);

  const productosFiltrados = productos.filter((prod) => {
    const termino = busqueda.toLowerCase();
    const codigo = prod.codigo?.toLowerCase() || '';
    const descripcion = prod.descripcion?.toLowerCase() || '';
    const tipo = prod.tipo?.nombre?.toLowerCase() || '';

    return codigo.includes(termino) || descripcion.includes(termino) || tipo.includes(termino);
  });

  if (cargando) return <div style={styles.mensaje}>⏳ Cargando catálogo de productos...</div>;
  if (error) return <div style={styles.error}>❌ {error}</div>;

  return (
    <div style={styles.contenedor}>
      <h2>📦 Catálogo de Productos Terminados ({productos.length} ítems)</h2>

      <input
        type="text"
        placeholder="🔍 Buscar por código, descripción o categoría..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={styles.buscador}
      />

      <table style={styles.tabla}>
        <thead>
          <tr style={styles.encabezado}>
            <th style={styles.th}>Código</th>
            <th style={styles.th}>Descripción</th>
            <th style={styles.th}>Tipo / Categoría</th>
            <th style={styles.th}>Peso (kg)</th>
            <th style={styles.th}>Stock Actual</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map((prod) => (
              <tr key={prod._id} style={styles.fila}>
                <td style={{ ...styles.td, ...styles.codigo }}>{prod.codigo}</td>
                <td style={styles.td}>{prod.descripcion}</td>
                <td style={styles.td}>
                  <span style={styles.badge}>
                    {prod.tipo?.nombre || 'Sin Categoría'}
                  </span>
                </td>
                <td style={{ ...styles.td, ...styles.centro }}>{prod.peso ? prod.peso.toFixed(3) : '0.000'}</td>
                <td style={{ ...styles.td, ...styles.centro }}>
                  <strong style={prod.stockActual > 0 ? styles.stockOk : styles.stockCero}>
                    {prod.stockActual}
                  </strong>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={styles.mensaje}>
                No se encontraron productos coincidentes.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  contenedor: { padding: '20px', fontFamily: 'Arial, sans-serif' },
  buscador: { width: '100%', padding: '10px', marginBottom: '20px', fontSize: '15px', borderRadius: '5px', border: '1px solid #ccc' },
  tabla: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  encabezado: { backgroundColor: '#1f2937', color: '#fff' },
  th: { padding: '12px' },
  td: { padding: '10px', borderBottom: '1px solid #e5e7eb' },
  fila: { backgroundColor: '#fff' },
  codigo: { fontWeight: 'bold', color: '#2563eb' },
  badge: { backgroundColor: '#e0e7ff', color: '#3730a3', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' },
  centro: { textAlign: 'center' },
  stockOk: { color: '#16a34a' },
  stockCero: { color: '#dc2626' },
  mensaje: { textAlign: 'center', padding: '20px', color: '#6b7280' },
  error: { textAlign: 'center', padding: '20px', color: '#dc2626', fontWeight: 'bold' }
};

export default TablaProductos;