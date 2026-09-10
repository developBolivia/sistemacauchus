import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = ({ usuario, onCerrarSesion }) => {
  const [hoverBtn, setHoverBtn] = useState(false);
  const [sidebarAbierto, setSidebarAbierto] = useState(window.innerWidth > 768);
  const [esMovil, setEsMovil] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const movil = window.innerWidth <= 768;
      setEsMovil(movil);
      if (!movil) setSidebarAbierto(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cerrarSidebarMovil = () => {
    if (esMovil) setSidebarAbierto(false);
  };

  return (
    <div style={styles.layoutContenedor}>
      {/* Overlay oscuro para cerrar menú en móviles */}
      {esMovil && sidebarAbierto && (
        <div style={styles.overlay} onClick={() => setSidebarAbierto(false)} />
      )}

      <Sidebar 
        usuario={usuario} 
        sidebarAbierto={sidebarAbierto} 
        cerrarSidebarMovil={cerrarSidebarMovil} 
      />

      <div style={{
        ...styles.contenidoArea,
        marginLeft: esMovil ? '0px' : '240px'
      }}>
        {/* Navbar Superior */}
        <header style={styles.headerSuperior}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => setSidebarAbierto(!sidebarAbierto)} 
              style={styles.btnHamburguesa}
              aria-label="Abrir menú"
            >
              ☰
            </button>
            <span style={styles.mensajeBienvenida}>
              Bienvenido/a, <strong>{usuario?.nombre || usuario?.username || 'Usuario'}</strong>
            </span>
          </div>

          {/* Botón On/Off */}
          <div style={styles.contenedorLogout}>
            <button
              onClick={onCerrarSesion}
              onMouseEnter={() => setHoverBtn(true)}
              onMouseLeave={() => setHoverBtn(false)}
              style={{
                ...styles.btnPower,
                backgroundColor: hoverBtn ? '#fecdd3' : '#f1f5f9',
                color: hoverBtn ? '#e11d48' : '#64748b',
                borderColor: hoverBtn ? '#fda4af' : '#cbd5e1',
              }}
              title="Cerrar Sesión"
            >
              ⏻
            </button>
          </div>
        </header>

        <main style={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const styles = {
  layoutContenedor: { display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 },
  contenidoArea: { flex: 1, display: 'flex', flexDirection: 'column', transition: 'margin-left 0.3s ease', minWidth: 0 },
  headerSuperior: { height: '50px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', position: 'sticky', top: 0, zIndex: 100 },
  btnHamburguesa: { border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', color: '#334155', padding: '4px 8px', borderRadius: '4px' },
  mensajeBienvenida: { fontSize: '13px', color: '#475569' },
  contenedorLogout: { position: 'relative', display: 'flex', alignItems: 'center' },
  btnPower: { width: '32px', height: '32px', borderRadius: '50%', border: '1px solid', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' },
  mainContent: { padding: '16px', flex: 1, overflowX: 'hidden' }
};

export default Layout;