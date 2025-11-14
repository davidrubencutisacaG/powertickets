import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { registerBuyer, login } from '../api';
import type { CurrentUser } from '../types/roles';
import { UserRole } from '../types/roles';
import './Registro.css';

export default function Registro() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      // Registrar usuario
      await registerBuyer(formData);
      
      // Login automático después del registro
      try {
        // Llamar a la API de login
        const response = await login({
          email: formData.email,
          password: formData.password,
        });
        
        // Validar que access_token existe
        if (!response.access_token) {
          throw new Error('No se recibió token en la respuesta de login');
        }

        // Mapear el user del backend a CurrentUser
        let userData: CurrentUser | undefined;
        if (response.user) {
          // Usar el user que manda el backend directamente
          userData = {
            email: response.user.email || formData.email,
            role: (response.user.role as UserRole) || UserRole.COMPRADOR,
            id: response.user.id,
            name: response.user.name || formData.name,
            lastName: response.user.lastName || formData.lastName,
          };
        } else {
          // Fallback: usar datos del formulario si no hay user del backend
          userData = {
            email: formData.email,
            role: UserRole.COMPRADOR,
            name: formData.name,
            lastName: formData.lastName,
          };
        }

        // Guardar en contexto de autenticación (delega todo en AuthContext)
        authLogin(response.access_token, userData);

        setMessage('Registro exitoso. Ya has iniciado sesión.');
        setFormData({ name: '', lastName: '', email: '', password: '' });
        
        // Redirigir al home
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (loginError: any) {
        // Manejo de errores amigable para el login automático
        let errorMessage = 'Registro exitoso, pero hubo un error al iniciar sesión automáticamente. Por favor, inicia sesión manualmente.';
        
        if (loginError.message) {
          errorMessage = `Registro exitoso, pero ${loginError.message}. Por favor, inicia sesión manualmente.`;
        } else if (loginError.error) {
          errorMessage = `Registro exitoso, pero ${loginError.error}. Por favor, inicia sesión manualmente.`;
        }
        
        setMessage(errorMessage);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error: any) {
      // Manejo de errores amigable para el registro
      let errorMessage = 'Error al registrar usuario';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.error) {
        errorMessage = error.error;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      setMessage(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-content">
        <h2 className="registro-title">Registro</h2>
        <form onSubmit={handleSubmit} className="registro-form">
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Apellido"
            value={formData.lastName}
            onChange={handleChange}
            className="form-input"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            required
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>
        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

