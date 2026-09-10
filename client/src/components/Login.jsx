import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginExitoso }) => {
  const [identificador, setIdentificador] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      // Si pruebas desde un celular físico en tu red local, reemplaza localhost por la IP de tu PC (ej. http://192.168.1.50:5000/...)
      const respuesta = await axios.post('http://localhost:5000/api/auth/login', {
        identificador,
        password
      });

      // Guardar datos de sesión en el almacenamiento local del navegador
      localStorage.setItem('token', respuesta.data.token);
      localStorage.setItem('usuario', JSON.stringify(respuesta.data.usuario));

      if (onLoginExitoso) {
        onLoginExitoso(respuesta.data.usuario);
      }
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={styles.contenedorPantalla}>
      <div style={styles.tarjetaLogin}>
        <div style={styles.encabezado}>
          <h1 style={styles.titulo}>SISTEMA CAUCHUS</h1>
          <p style={styles.subtitulo}>Control de Inventario y Almacén</p>
        </div>

        {error && <div style={styles.alertaError}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.formulario}>
          <div style={styles.grupoCampo}>
            <label style={styles.label}>Usuario, Celular o Correo</label>
            <input
              type="text"
              required
              autoCapitalize="none"
              autoCorrect="off"
              placeholder="Ej: admin o 70000000"
              value={identificador}
              onChange={(e) => setIdentificador(e.target.value)}
              style={styles.inputMobile}
            />
          </div>

          <div style={styles.grupoCampo}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.inputMobile}
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            style={cargando ? { ...styles.botonMobile, opacity: 0.7 } : styles.botonMobile}
          >
            {cargando ? '⏳ Ingresando...' : 'INGRESAR AL SISTEMA'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  contenedorPantalla: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    padding: '16px',
    boxSizing: 'border-box'
  },
  tarjetaLogin: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    boxSizing: 'border-box'
  },
  encabezado: { 
    textAlign: 'center', 
    marginBottom: '24px' 
  },
  titulo: { 
    margin: 0, 
    fontSize: '22px', 
    fontWeight: 'bold', 
    color: '#111827' 
  },
  subtitulo: { 
    margin: '4px 0 0 0', 
    fontSize: '14px', 
    color: '#6b7280' 
  },
  formulario: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '16px' 
  },
  grupoCampo: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '6px' 
  },
  label: { 
    fontSize: '14px', 
    fontWeight: '600', 
    color: '#374151' 
  },
  inputMobile: {
    width: '100%',
    height: '48px', // Alto ideal para toques precisos en teclado táctil
    padding: '0 12px',
    fontSize: '16px', // 16px evita el zoom automático molesto en navegadores móviles de iOS/Android
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    boxSizing: 'border-box',
    outline: 'none'
  },
  botonMobile: {
    width: '100%',
    height: '50px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '8px'
  },
  alertaError: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '16px',
    textAlign: 'center'
  }
};

export default Login;