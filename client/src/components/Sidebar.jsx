import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { VIEW_ID as VIEW_PRODUCTOS_LISTADO_GENERAL } from './ProductosListadoGeneral';

const Sidebar = ({ usuario, sidebarAbierto, cerrarSidebarMovil }) => {
  const [productosAbierto, setProductosAbierto] = useState(true);
  const [usuariosAbierto, setUsuariosAbierto] = useState(false);

  const esAdmin = usuario?.rol?.toUpperCase() === 'ADMIN' || usuario?.rol?.toUpperCase() === 'ADMINISTRADOR';

  return (
    <aside style={{
      ...styles.sidebar,
      transform: sidebarAbierto ? 'translateX(0)' : 'translateX(-100%)',
    }}>
      <div style={styles.headerSidebar}>
        <h3 style={styles.tituloApp}>Sistema Cauchus</h3>
        <span style={styles.badgeUsuario}>
          👤 {usuario?.nombre || usuario?.username || 'Usuario'}
        </span>
      </div>

      <nav style={styles.nav}>
        {/* ================= GRUPO 1: PRODUCTOS ================= */}
        <div style={styles.seccionMenu}>
          <button 
            onClick={() => setProductosAbierto(!productosAbierto)} 
            style={styles.btnMenuPadre}
          >
            <span>📦 PRODUCTOS</span>
            <span style={styles.flecha}>{productosAbierto ? '▾' : '▸'}</span>
          </button>

          {productosAbierto && (
            <div style={styles.contenedorSubmenu}>
              <NavLink
                to="/productos/listado-general"
                onClick={cerrarSidebarMovil}
                data-view-id={VIEW_PRODUCTOS_LISTADO_GENERAL}
                style={({ isActive }) => ({
                  ...styles.subMenuItem,
                  backgroundColor: isActive ? '#334155' : 'transparent',
                  color: isActive ? '#38bdf8' : '#94a3b8',
                  fontWeight: isActive ? '600' : 'normal'
                })}
              >
                • Listado General
              </NavLink>
            </div>
          )}
        </div>

        {/* ================= GRUPO 2: USUARIOS (Al mismo nivel) ================= */}
        {esAdmin && (
          <div style={styles.seccionMenu}>
            <button 
              onClick={() => setUsuariosAbierto(!usuariosAbierto)} 
              style={styles.btnMenuPadre}
            >
              <span>👥 USUARIOS</span>
              <span style={styles.flecha}>{usuariosAbierto ? '▾' : '▸'}</span>
            </button>

            {usuariosAbierto && (
              <div style={styles.contenedorSubmenu}>
                <NavLink
                  to="/usuarios"
                  onClick={cerrarSidebarMovil}
                  style={({ isActive }) => ({
                    ...styles.subMenuItem,
                    backgroundColor: isActive ? '#334155' : 'transparent',
                    color: isActive ? '#38bdf8' : '#94a3b8',
                    fontWeight: isActive ? '600' : 'normal'
                  })}
                >
                  • Gestión de Usuarios
                </NavLink>
              </div>
            )}
          </div>
        )}
      </nav>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '240px',
    backgroundColor: '#0f172a',
    color: '#fff',
    height: '100vh',
    padding: '16px 12px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1000,
    transition: 'transform 0.3s ease',
    boxShadow: '2px 0 8px rgba(0,0,0,0.2)'
  },
  headerSidebar: {
    borderBottom: '1px solid #1e293b',
    paddingBottom: '12px',
    marginBottom: '12px'
  },
  tituloApp: { margin: '0 0 6px 0', fontSize: '16px', color: '#f8fafc', fontWeight: 'bold' },
  badgeUsuario: { fontSize: '11px', color: '#94a3b8', backgroundColor: '#1e293b', padding: '3px 6px', borderRadius: '4px', display: 'inline-block' },
  nav: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
  seccionMenu: { display: 'flex', flexDirection: 'column', margin: 0, padding: 0 },
  btnMenuPadre: {
    width: '100%',
    display: 'flex',
    justify: 'space-between',
    alignItems: 'center',
    padding: '8px 10px',
    background: 'none',
    border: 'none',
    color: '#e2e8f0',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    borderRadius: '6px',
    textAlign: 'left'
  },
  flecha: { fontSize: '11px', color: '#64748b' },
  contenedorSubmenu: { display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '14px', marginTop: '2px' },
  subMenuItem: { textDecoration: 'none', padding: '6px 10px', borderRadius: '4px', fontSize: '12px', display: 'block' }
};

export default Sidebar;