import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  // Formulario
  const [mostrarForm, setMostrarForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    username: '',
    celular: '',
    email: '',
    password: '',
    rol: 'ALMACEN'
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/usuarios');
      setUsuarios(res.data);
    } catch (err) {
      setError('Error al cargar la lista de usuarios');
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensajeExito('');

    try {
      await axios.post('http://localhost:5000/api/usuarios', formData);
      setMensajeExito('✅ Usuario creado exitosamente');
      setFormData({ nombre: '', username: '', celular: '', email: '', password: '', rol: 'OPERADOR' });
      setMostrarForm(false);
      cargarUsuarios();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al guardar el usuario');
    }
  };

  return (
    <div style={styles.contenedor}>
      <div style={styles.encabezado}>
        <h2 style={styles.titulo}>Gestión de Usuarios</h2>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          style={mostrarForm ? styles.btnCancelar : styles.btnNuevo}
        >
          {mostrarForm ? '✕ Cancelar' : '+ Nuevo Usuario'}
        </button>
      </div>

      {error && <div style={styles.alertaError}>{error}</div>}
      {mensajeExito && <div style={styles.alertaExito}>{mensajeExito}</div>}

      {/* Formulario desplegable */}
      {mostrarForm && (
        <form onSubmit={handleSubmit} style={styles.formulario}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Crear Nuevo Usuario</h3>
          
          <div style={styles.gridForm}>
            <div>
              <label style={styles.label}>Nombre Completo *</label>
              <input type="text" name="nombre" required value={formData.nombre} onChange={handleChange} style={styles.input} />
            </div>
            <div>
              <label style={styles.label}>Usuario (Username) *</label>
              <input type="text" name="username" required value={formData.username} onChange={handleChange} style={styles.input} />
            </div>
            <div>
              <label style={styles.label}>Celular</label>
              <input type="text" name="celular" value={formData.celular} onChange={handleChange} style={styles.input} />
            </div>
            <div>
              <label style={styles.label}>Correo Electrónico</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} style={styles.input} />
            </div>
            <div>
              <label style={styles.label}>Contraseña *</label>
              <input type="password" name="password" required value={formData.password} onChange={handleChange} style={styles.input} />
            </div>
            <div>
              <label style={styles.label}>Rol de Acceso</label>
              <select name="rol" value={formData.rol} onChange={handleChange} style={styles.input}>
              <option value="ALMACEN">ALMACÉN (Gestión de Inventario)</option>
                <option value="CONSULTA">CONSULTA (Solo Lectura)</option>
                <option value="ADMIN">ADMIN (Acceso Total)</option>
              </select>
            </div>
          </div>

          <button type="submit" style={styles.btnGuardar}>
            Guardar Usuario
          </button>
        </form>
      )}

      {/* Listado de usuarios */}
      {cargando ? (
        <p>Cargando usuarios...</p>
      ) : (
        <div style={styles.tablaContenedor}>
          <table style={styles.tabla}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Usuario / Celular</th>
                <th style={styles.th}>Rol</th>
                <th style={styles.th}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usr) => (
                <tr key={usr._id} style={styles.tdRow}>
                  <td style={styles.td}>
                    <strong>{usr.nombre}</strong>
                    {usr.email && <div style={{ fontSize: '12px', color: '#6b7280' }}>{usr.email}</div>}
                  </td>
                  <td style={styles.td}>
                    <div>👤 {usr.username}</div>
                    {usr.celular && <div style={{ fontSize: '12px', color: '#6b7280' }}>📱 {usr.celular}</div>}
                  </td>
                  <td style={styles.td}>
                    <span style={usr.rol === 'ADMIN' ? styles.badgeAdmin : styles.badgeOperador}>
                      {usr.rol}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ color: usr.activo ? '#16a34a' : '#dc2626', fontWeight: 'bold' }}>
                      {usr.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  contenedor: { maxWidth: '900px', margin: '0 auto' },
  encabezado: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  titulo: { margin: 0, fontSize: '20px', color: '#111827' },
  btnNuevo: { backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  btnCancelar: { backgroundColor: '#6b7280', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  formulario: { backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px' },
  gridForm: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px', color: '#374151' },
  input: { width: '100%', height: '40px', padding: '0 8px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' },
  btnGuardar: { backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  alertaError: { backgroundColor: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '6px', marginBottom: '12px' },
  alertaExito: { backgroundColor: '#dcfce7', color: '#166534', padding: '10px', borderRadius: '6px', marginBottom: '12px' },
  tablaContenedor: { backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto' },
  tabla: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' },
  thRow: { backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' },
  th: { padding: '12px' },
  tdRow: { borderBottom: '1px solid #f3f4f6' },
  td: { padding: '12px' },
  badgeAdmin: { backgroundColor: '#3b82f6', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' },
  badgeOperador: { backgroundColor: '#6b7280', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }
};

export default GestionUsuarios;