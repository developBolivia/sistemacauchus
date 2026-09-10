import React, { useState, useEffect } from 'react';

export const VIEW_ID = 'VIEW_PRODUCTOS_LISTADO_GENERAL';

const ProductosListadoGeneral = () => {
  const [productos, setProductos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // ÚNICOS FILTROS PERMITIDOS: Descripción y Tipo
  const [filtroDescripcion, setFiltroDescripcion] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');

  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Obtener lista de productos
      const resProd = await fetch('http://localhost:5000/api/productos', { headers });
      const dataProd = await resProd.json();
      const listaProd = Array.isArray(dataProd) ? dataProd : [];
      setProductos(listaProd);

      // 2. Obtener lista de tipos para el desplegable
      try {
        const resTipos = await fetch('http://localhost:5000/api/tipos', { headers });
        if (resTipos.ok) {
          const dataTipos = await resTipos.json();
          setTipos(Array.isArray(dataTipos) ? dataTipos : []);
        } else {
          extraerTiposDeProductos(listaProd);
        }
      } catch (err) {
        extraerTiposDeProductos(listaProd);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setCargando(false);
    }
  };

  const extraerTiposDeProductos = (lista) => {
    const tiposMap = new Map();
    lista.forEach(p => {
      if (p.tipo) {
        if (typeof p.tipo === 'object' && p.tipo._id) {
          tiposMap.set(p.tipo._id, p.tipo.nombre || p.tipo.descripcion);
        } else if (typeof p.tipo === 'string') {
          tiposMap.set(p.tipo, p.tipo);
        }
      }
    });
    setTipos(Array.from(tiposMap.entries()).map(([id, nombre]) => ({ _id: id, nombre })));
  };

  // 1. Filtrado dinámico
  const productosFiltrados = productos.filter((p) => {
    const tipoId = typeof p.tipo === 'object' ? p.tipo?._id : p.tipo;
    const coincideDesc = p.descripcion?.toLowerCase().includes(filtroDescripcion.toLowerCase());
    const coincideTipo = filtroTipo === '' || tipoId === filtroTipo;

    return coincideDesc && coincideTipo;
  });

  // 2. Ordenamiento: 1º Tipo (Ascendente) -> 2º Código (Ascendente)
  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
    // Obtener nombres/textos de los tipos
    const tipoA = (typeof a.tipo === 'object' ? (a.tipo?.nombre || a.tipo?.descripcion) : a.tipo || '').toLowerCase();
    const tipoB = (typeof b.tipo === 'object' ? (b.tipo?.nombre || b.tipo?.descripcion) : b.tipo || '').toLowerCase();

    // Primer criterio: Tipo
    const comparacionTipo = tipoA.localeCompare(tipoB, undefined, { numeric: true, sensitivity: 'base' });
    if (comparacionTipo !== 0) {
      return comparacionTipo;
    }

    // Segundo criterio: Código (si los tipos son iguales)
    const codigoA = (a.codigo || '').toString().toLowerCase();
    const codigoB = (b.codigo || '').toString().toLowerCase();
    return codigoA.localeCompare(codigoB, undefined, { numeric: true, sensitivity: 'base' });
  });

  return (
    <div style={styles.cardContenedor}>
      <h3 style={styles.tituloHeader}>📦 Listado General de Productos</h3>

      {cargando ? (
        <p style={{ fontSize: '12px', color: '#64748b' }}>Cargando catálogo...</p>
      ) : (
        <div style={styles.tablaWrapper}>
          <table style={styles.tabla}>
            <thead>
              <tr style={styles.thFilaHead}>
                <th style={{ ...styles.th, width: '120px' }}>Código</th>
                <th style={styles.th}>Descripción</th>
                <th style={{ ...styles.th, width: '180px' }}>Tipo de Producto</th>
                <th style={{ ...styles.th, width: '90px', textAlign: 'right' }}>Peso (kg)</th>
                <th style={{ ...styles.th, width: '100px', textAlign: 'right' }}>Stock Actual</th>
              </tr>
              {/* FILA DE FILTROS EN CABECERA */}
              <tr style={styles.thFilaFiltros}>
                {/* Columna Código: Sin filtro */}
                <th style={styles.thFiltro}></th>

                {/* Columna Descripción: Texto libre */}
                <th style={styles.thFiltro}>
                  <input
                    type="text"
                    placeholder="🔍 Buscar por descripción..."
                    value={filtroDescripcion}
                    onChange={(e) => setFiltroDescripcion(e.target.value)}
                    style={styles.inputFiltro}
                  />
                </th>

                {/* Columna Tipo de Producto: Desplegable */}
                <th style={styles.thFiltro}>
                  <select
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                    style={styles.inputFiltro}
                  >
                    <option value="">-- Todos los tipos --</option>
                    {tipos.map((t) => (
                      <option key={t._id || t.id || t.nombre} value={t._id || t.id || t.nombre}>
                        {t.nombre || t.descripcion || t}
                      </option>
                    ))}
                  </select>
                </th>

                {/* Columna Peso: Sin filtro */}
                <th style={styles.thFiltro}></th>

                {/* Columna Stock: Sin filtro */}
                <th style={styles.thFiltro}></th>
              </tr>
            </thead>
            <tbody>
              {productosOrdenados.length > 0 ? (
                productosOrdenados.map((p) => (
                  <tr key={p._id || p.id} style={styles.trBody}>
                    <td style={styles.tdBold}>{p.codigo}</td>
                    <td style={styles.td}>{p.descripcion}</td>
                    <td style={styles.td}>
                      {typeof p.tipo === 'object' ? (p.tipo?.nombre || p.tipo?.descripcion) : p.tipo || 'Sin Tipo'}
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>{p.peso}</td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>
                      <span style={{
                        fontWeight: 'bold',
                        color: p.stockActual <= 5 ? '#dc2626' : '#16a34a'
                      }}>
                        {p.stockActual} u.
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={styles.tdVacio}>
                    No hay productos que coincidan con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  cardContenedor: { backgroundColor: '#ffffff', padding: '14px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' },
  tituloHeader: { margin: '0 0 12px 0', fontSize: '15px', color: '#1e293b' },
  tablaWrapper: { overflowX: 'auto', WebkitOverflowScrolling: 'touch' },
  tabla: { width: '100%', borderCollapse: 'collapse', fontSize: '12px', color: '#334155' },
  thFilaHead: { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' },
  thFilaFiltros: { backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' },
  th: { padding: '6px 8px', textAlign: 'left', fontWeight: '600', color: '#475569', fontSize: '12px' },
  thFiltro: { padding: '4px 6px' },
  inputFiltro: { width: '100%', padding: '4px 6px', fontSize: '11px', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box', outline: 'none', backgroundColor: '#ffffff' },
  trBody: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '6px 8px', fontSize: '12px' },
  tdBold: { padding: '6px 8px', fontSize: '12px', fontWeight: 'bold', color: '#0f172a' },
  tdVacio: { padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }
};

export default ProductosListadoGeneral;