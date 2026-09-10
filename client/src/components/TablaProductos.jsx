import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TablaProductos = () => {
  // === ESTADOS DE LA APLICACIÓN ===
  const [productos, setProductos] = useState([]); // Listado de productos traídos de MongoDB
  const [tipos, setTipos] = useState([]);         // Listado de opciones para el selector 'TipoProducto'
  const [cargando, setCargando] = useState(true); // Indicador de estado de carga inicial
  const [error, setError] = useState('');         // Mensaje de error para notificaciones flotantes/alertas
  const [mensajeExito, setMensajeExito] = useState(''); // Mensaje de éxito para operaciones CRUD

  // === ESTADOS DEL MODAL Y FORMULARIO ===
  const [mostrarModal, setMostrarModal] = useState(false); // Controla la visibilidad del modal desplegable
  const [modoEdicion, setModoEdicion] = useState(false);   // Toggle para saber si guardamos (POST) o actualizamos (PUT)
  const [codigoEdicion, setCodigoEdicion] = useState(''); // Almacena el código original del elemento en edición

  // Estado que mapea directamente los inputs del formulario con la estructura del schema
  const [formData, setFormData] = useState({
    codigo: '',
    descripcion: '',
    peso: '',
    tipo: '',
    stockActual: 0
  });

  // === EFECTOS ===
  // Carga inicial de datos al montar el componente en pantalla
  useEffect(() => {
    cargarDatos();
  }, []);

  /**
   * Carga paralela de productos y tipos de producto desde la API REST.
   */
  const cargarDatos = async () => {
    setCargando(true);
    try {
      // Usamos Promise.all para realizar ambas peticiones HTTP simultáneamente
      const [resProd, resTipos] = await Promise.all([
        axios.get('http://localhost:5000/api/productos'),
        axios.get('http://localhost:5000/api/tipos').catch(() => ({ data: [] })) // En caso de que la ruta varíe, evita romper la app
      ]);

      setProductos(resProd.data);
      setTipos(resTipos.data);
    } catch (err) {
      setError('Error al conectar con el backend y recuperar el inventario');
    } finally {
      setCargando(false);
    }
  };

  /**
   * Prepara y abre el modal en modo CREACIÓN.
   */
  const abrirModalCrear = () => {
    setModoEdicion(false);
    setCodigoEdicion('');
    setFormData({
      codigo: '',
      descripcion: '',
      peso: '',
      tipo: tipos.length > 0 ? tipos[0]._id : '', // Asigna el primer tipo de producto por defecto si existe
      stockActual: 0
    });
    setMostrarModal(true);
  };

  /**
   * Prepara y abre el modal en modo EDICIÓN rellenando los valores del objeto seleccionado.
   * @param {Object} prod - Producto individual obtenido de la lista
   */
  const abrirModalEditar = (prod) => {
    setModoEdicion(true);
    setCodigoEdicion(prod.codigo);
    setFormData({
      codigo: prod.codigo,
      descripcion: prod.descripcion || '',
      peso: prod.peso !== undefined ? prod.peso : '',
      tipo: prod.tipo?._id || prod.tipo || '', // Extrae el ID si viene en formato objeto poblado o String directo
      stockActual: prod.stockActual !== undefined ? prod.stockActual : 0
    });
    setMostrarModal(true);
  };

  /**
   * Manejador genérico para capturar cambios en los inputs del formulario.
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /**
   * Envía el formulario al servidor para CREAR o ACTUALIZAR.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensajeExito('');

    try {
      if (modoEdicion) {
        // Petición PUT utilizando el 'codigo' en la URL como parámetro
        await axios.put(`http://localhost:5000/api/productos/${codigoEdicion}`, formData);
        setMensajeExito('✅ Producto actualizado correctamente');
      } else {
        // Petición POST para guardar un nuevo documento
        await axios.post('http://localhost:5000/api/productos', formData);
        setMensajeExito('✅ Producto registrado correctamente');
      }

      setMostrarModal(false); // Cierra el modal tras el guardado
      cargarDatos();         // Recarga el listado para reflejar los cambios en vivo
    } catch (err) {
      // Muestra el mensaje de error personalizado devuelto por el controlador Express
      setError(err.response?.data?.mensaje || 'Error al procesar la solicitud');
    }
  };

  /**
   * Petición para eliminar un registro tras confirmación del usuario.
   */
  const handleEliminar = async (codigo, descripcion) => {
    if (window.confirm(`¿Estás seguro de eliminar el producto "${descripcion}" (${codigo})?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/productos/${codigo}`);
        setMensajeExito('🗑️ Producto eliminado correctamente');
        cargarDatos(); // Actualiza la tabla tras remover el registro
      } catch (err) {
        setError('Error al intentar eliminar el producto de la base de datos');
      }
    }
  };

  return (
    <div style={styles.contenedor}>
      {/* Encabezado principal y botón de acción */}
      <div style={styles.encabezado}>
        <h2 style={styles.titulo}>Inventario de Productos</h2>
        <button onClick={abrirModalCrear} style={styles.btnNuevo}>
          + Nuevo Producto
        </button>
      </div>

      {/* Alertas de Notificación */}
      {error && <div style={styles.alertaError}>{error}</div>}
      {mensajeExito && <div style={styles.alertaExito}>{mensajeExito}</div>}

      {/* Indicador de Carga / Vista de Tabla */}
      {cargando ? (
        <p>Cargando inventario desde MongoDB...</p>
      ) : (
        <div style={styles.tablaContenedor}>
          <table style={styles.tabla}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>Código</th>
                <th style={styles.th}>Descripción</th>
                <th style={styles.th}>Tipo de Producto</th>
                <th style={styles.th}>Peso (kg)</th>
                <th style={styles.th}>Stock Actual</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                    No hay productos registrados en la base de datos.
                  </td>
                </tr>
              ) : (
                productos.map((prod) => (
                  <tr key={prod._id} style={styles.tdRow}>
                    <td style={styles.td}><strong>{prod.codigo}</strong></td>
                    <td style={styles.td}>{prod.descripcion}</td>
                    <td style={styles.td}>
                      {/* Muestra la propiedad poblada del tipo (nombre o descripción) */}
                      {prod.tipo?.nombre || prod.tipo?.descripcion || 'Sin Tipo'}
                    </td>
                    <td style={styles.td}>{prod.peso} kg</td>
                    <td style={styles.td}>
                      {/* Indicador visual de stock crítico (rojo si es <= 5, verde si hay stock suficiente) */}
                      <span style={{ fontWeight: 'bold', color: prod.stockActual <= 5 ? '#dc2626' : '#16a34a' }}>
                        {prod.stockActual} u.
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button onClick={() => abrirModalEditar(prod)} style={styles.btnEditar}>
                        ✏️ Editar
                      </button>
                      <button onClick={() => handleEliminar(prod.codigo, prod.descripcion)} style={styles.btnEliminar}>
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* === MODAL FLOTANTE DE REGISTRO / EDICIÓN === */}
      {mostrarModal && (
        <div style={styles.overlayModal}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0 }}>
                {modoEdicion ? `Editar Producto (${codigoEdicion})` : 'Crear Nuevo Producto'}
              </h3>
              <button onClick={() => setMostrarModal(false)} style={styles.btnCerrar}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ marginTop: '15px' }}>
              <div style={styles.gridForm}>
                {/* Campo Código (Bloqueado durante edición para mantener integridad de la llave) */}
                <div>
                  <label style={styles.label}>Código *</label>
                  <input
                    type="text"
                    name="codigo"
                    required
                    disabled={modoEdicion}
                    value={formData.codigo}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Ej: PRD-001"
                  />
                </div>

                {/* Campo Descripción */}
                <div>
                  <label style={styles.label}>Descripción *</label>
                  <input
                    type="text"
                    name="descripcion"
                    required
                    value={formData.descripcion}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>

                {/* Campo Peso */}
                <div>
                  <label style={styles.label}>Peso (kg) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="peso"
                    required
                    value={formData.peso}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>

                {/* Selector de Tipo (Referencia ObjectId a TipoProducto) */}
                <div>
                  <label style={styles.label}>Tipo de Producto *</label>
                  <select
                    name="tipo"
                    required
                    value={formData.tipo}
                    onChange={handleChange}
                    style={styles.input}
                  >
                    <option value="">-- Seleccionar Tipo --</option>
                    {tipos.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.nombre || t.descripcion}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Campo Stock Actual */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={styles.label}>Stock Actual</label>
                  <input
                    type="number"
                    min="0"
                    name="stockActual"
                    value={formData.stockActual}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
              </div>

              {/* Botones de Acción dentro del Formulario */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => setMostrarModal(false)} style={styles.btnCancelar}>
                  Cancelar
                </button>
                <button type="submit" style={styles.btnGuardar}>
                  {modoEdicion ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// === ESTILOS CSS-IN-JS ===
const styles = {
  contenedor: { maxWidth: '1000px', margin: '0 auto' },
  encabezado: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  titulo: { margin: 0, fontSize: '20px', color: '#111827' },
  btnNuevo: { backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  tablaContenedor: { backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto' },
  tabla: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' },
  thRow: { backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' },
  th: { padding: '12px' },
  tdRow: { borderBottom: '1px solid #f3f4f6' },
  td: { padding: '12px' },
  btnEditar: { backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', marginRight: '6px' },
  btnEliminar: { backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' },
  alertaError: { backgroundColor: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '6px', marginBottom: '12px' },
  alertaExito: { backgroundColor: '#dcfce7', color: '#166534', padding: '10px', borderRadius: '6px', marginBottom: '12px' },
  overlayModal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  modal: { backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', width: '90%', maxWidth: '500px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' },
  btnCerrar: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#6b7280' },
  gridForm: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px', color: '#374151' },
  input: { width: '100%', height: '38px', padding: '0 8px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' },
  btnGuardar: { backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  btnCancelar: { backgroundColor: '#6b7280', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }
};

export default TablaProductos;