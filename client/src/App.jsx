import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importación de vistas y layout
import Login from './components/Login';
import Layout from './components/Layout';
import ProductosListadoGeneral from './components/ProductosListadoGeneral';
import TablaProductos from './components/TablaProductos';
import GestionUsuarios from './components/GestionUsuarios';

function App() {
  const [usuario, setUsuario] = useState(null);

  // Verificación de sesión iniciada al cargar la aplicación
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  // Si no hay sesión activa, muestra la pantalla de Login
  if (!usuario) {
    return <Login onLoginExitoso={(usr) => setUsuario(usr)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Contenedor principal Layout */}
        <Route path="/" element={<Layout usuario={usuario} onCerrarSesion={cerrarSesion} />}>
          
          {/* Redirección por defecto al Listado General de Productos */}
          <Route index element={<Navigate to="/productos/listado-general" replace />} />

          {/* Submenú 1: Listado General de Productos (Solo consulta con filtros) */}
          <Route path="productos/listado-general" element={<ProductosListadoGeneral />} />

          {/* Vista antigua/CRUD de productos (se asignará a otro submenú si se requiere) */}
          <Route path="productos/gestion" element={<TablaProductos />} />

          {/* Módulo de Gestión de Usuarios */}
          <Route path="usuarios" element={<GestionUsuarios />} />

          {/* Captura de rutas no encontradas */}
          <Route path="*" element={<Navigate to="/productos/listado-general" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;