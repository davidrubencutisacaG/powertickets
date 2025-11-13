import { useState } from 'react';
import logo from '../assets/logo-powertickets.png';
import './Header.css';

type HeaderProps = {
  onSearchChange?: (value: string) => void;
  onLoginClick?: () => void;
  currentUser?: { email: string; role: string } | null;
};

export default function Header({
  onSearchChange,
  onLoginClick,
  currentUser,
}: HeaderProps) {
  const [searchValue, setSearchValue] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange?.(value);
  };

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="header-left">
          <img src={logo} alt="PowerTickets" className="header-logo" />
        </div>

        <nav className="header-nav">
          <a href="#" className="nav-link">Inicio</a>
          <a href="#" className="nav-link">Eventos</a>
          <a href="#" className="nav-link">Categorías</a>
          <a href="#" className="nav-link">Contacto</a>
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

          {currentUser ? (
            <div className="user-menu-container">
              <button
                className="user-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {currentUser.email}
              </button>
              {showUserMenu && (
                <div className="user-menu-dropdown">
                  <a href="#" className="user-menu-item">Mi Cuenta</a>
                  <a href="#" className="user-menu-item">Mis Tickets</a>
                  <button className="user-menu-item" onClick={onLoginClick}>
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="login-button" onClick={onLoginClick}>
              Iniciar Sesión
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

