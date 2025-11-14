import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/roles';
import './MiCuenta.css';

export default function MiCuenta() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [message] = useState('');

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="mi-cuenta-container">
        <div className="mi-cuenta-content">
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mi-cuenta-container">
        <div className="mi-cuenta-content">
          <div className="message error">
            Debes iniciar sesión para acceder a Mi Cuenta
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mi-cuenta-container">
      <div className="mi-cuenta-content">
        <h1 className="mi-cuenta-title">Mi Cuenta</h1>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="account-info">
          <div className="info-section">
            <h2 className="info-section-title">Información Personal</h2>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{user.email}</span>
            </div>
            {user.name && (
              <div className="info-row">
                <span className="info-label">Nombre:</span>
                <span className="info-value">{user.name}</span>
              </div>
            )}
            {user.lastName && (
              <div className="info-row">
                <span className="info-label">Apellido:</span>
                <span className="info-value">{user.lastName}</span>
              </div>
            )}
            <div className="info-row">
              <span className="info-label">Rol:</span>
              <span className="info-value">
                {user.role === UserRole.COMPRADOR && 'Comprador'}
                {user.role === UserRole.ORGANIZADOR && 'Organizador'}
                {user.role === UserRole.ADMIN && 'Administrador'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

