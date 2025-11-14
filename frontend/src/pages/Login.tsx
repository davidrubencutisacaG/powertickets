import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { login } from '../api';
import type { CurrentUser } from '../types/roles';
import { UserRole } from '../types/roles';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({
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
      // Llamar a la API de login
      const response = await login(formData);
      
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
          name: response.user.name,
          lastName: response.user.lastName,
        };
      }

      // Guardar en contexto de autenticación (delega todo en AuthContext)
      authLogin(response.access_token, userData);

      setMessage('Login correcto ✅');
      setFormData({ email: '', password: '' });
      
      // Redirigir al home
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error: any) {
      // Manejo de errores amigable
      let errorMessage = 'Error al iniciar sesión';
      
      // Verificar si es un error 401 (credenciales incorrectas)
      if (error.status === 401 || error.statusCode === 401) {
        errorMessage = 'Credenciales incorrectas';
      } 
      // Si el error es sobre token faltante o undefined, mostrar mensaje específico
      else if (error.message?.includes('No se recibió token') || 
               error.message?.includes('access_token') ||
               error.message?.includes('Cannot read properties of undefined')) {
        errorMessage = 'Error en la respuesta del servidor. Por favor, intenta nuevamente.';
      } 
      // Si el mensaje contiene "unauthorized", "401", "invalid" o "credenciales"
      else if (error.message) {
        const messageLower = error.message.toLowerCase();
        if (messageLower.includes('unauthorized') || 
            messageLower.includes('401') ||
            messageLower.includes('invalid') ||
            messageLower.includes('credenciales') ||
            messageLower.includes('incorrect')) {
          errorMessage = 'Credenciales incorrectas';
        } else {
          errorMessage = error.message;
        }
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
    <div className="login-container">
      <div className="login-content">
        <h2 className="login-title">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="login-form">
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
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        <p className="login-hint">
          Para login admin se usa: admin@powertickets.com / Admin123!
        </p>
        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

