import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/roles';
import logo from '../assets/logo-powertickets.png';
import './Header.css';

type HeaderProps = {
  onSearchChange?: (value: string) => void;
};

export default function Header({ onSearchChange }: HeaderProps) {
  const navigate = useNavigate();
  const { user: currentUser, logout, isAuthenticated, hasRole } = useAuth();
  const [searchValue, setSearchValue] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange?.(value);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="header-logo-link">
            <img src={logo} alt="PowerTickets" className="header-logo" />
          </Link>
        </div>

        <nav className="header-nav">
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/" className="nav-link">Eventos</Link>
          <Link to="/" className="nav-link">Categorías</Link>
          <Link to="/" className="nav-link">Contacto</Link>
        </nav>

        <div className="header-right">
          <div className="header-search">
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={searchValue}
              onChange={handleSearch}
              className="search-input-header"
            />
            <span className="search-icon">🔍</span>
          </div>

          {isAuthenticated && currentUser ? (
            <div className="user-menu-container">
              <button
                className="user-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {currentUser.email}
              </button>
              {showUserMenu && (
                <div className="user-menu-dropdown">
                  {/* Menú para comprador */}
                  {hasRole(UserRole.COMPRADOR) && (
                    <>
                      <Link to="/carrito" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
                        Carrito
                      </Link>
                      <Link to="/mis-compras" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
                        Mis Compras
                      </Link>
                    </>
                  )}

                  {/* Menú para organizador */}
                  {hasRole(UserRole.ORGANIZADOR) && (
                    <>
                      <Link to="/organizador/crear-evento" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
                        Crear Evento
                      </Link>
                      <Link to="/organizador/mis-eventos" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
                        Mis Eventos
                      </Link>
                    </>
                  )}

                  {/* Menú para admin */}
                  {hasRole(UserRole.ADMIN) && (
                    <Link to="/admin/cuentas-por-aprobar" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
                      Cuentas por Aprobar
                    </Link>
                  )}

                  {/* Opciones comunes para todos los usuarios logueados */}
                  <Link to="/mi-cuenta" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
                    Mi Cuenta
                  </Link>
                  
                  <button className="user-menu-item" onClick={handleLogout}>
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button className="register-button" onClick={() => navigate('/registro')}>
                Registrarte
              </button>
              <button className="login-button" onClick={() => navigate('/login')}>
                Iniciar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
