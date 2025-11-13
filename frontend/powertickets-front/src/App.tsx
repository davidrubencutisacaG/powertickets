import { useState, useEffect } from 'react';
import {
  registerBuyer,
  login,
  getPendingOrganizers,
  approveOrganizer,
  getEvents,
  upgradeToOrganizer,
} from './api';
import Header from './components/Header';
import HomePage from './HomePage';
import './App.css';

type View = 'home' | 'buyer' | 'organizer' | 'login' | 'admin';

type CurrentUser = {
  email: string;
  role: 'buyer' | 'organizer' | 'admin';
} | null;

type Organizer = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  organizerStatus: string;
};

type Event = {
  id: string;
  name: string;
  date: string;
  location: string;
  category: string;
  flyerUrl?: string;
};

function App() {
  const [view, setView] = useState<View>('home');
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser>(null);
  const [message, setMessage] = useState<string>('');
  const [pending, setPending] = useState<Organizer[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Debug: mostrar token en consola
  console.log('Token en estado:', token);
  console.log('Current user:', currentUser);

  // Cargar eventos al montar el componente
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const eventsList = await getEvents();
        // Asegurar que eventsList sea un array
        // El backend puede devolver { data: [...] } o directamente [...]
        const eventsArray = Array.isArray(eventsList) 
          ? eventsList 
          : Array.isArray(eventsList?.data) 
            ? eventsList.data 
            : [];
        setEvents(eventsArray);
      } catch (error: any) {
        const errorMessage = error.message || error.error || JSON.stringify(error);
        setMessage(`Error al cargar eventos: ${errorMessage}`);
        // Asegurar que events siempre sea un array incluso si hay error
        setEvents([]);
      }
    };
    loadEvents();
  }, []);

  // Formulario comprador
  const [buyerForm, setBuyerForm] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
  });

  // Formulario organizador
  const [organizerForm, setOrganizerForm] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
  });

  // Formulario login
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  // Función para decodificar JWT
  const decodeJWT = (token: string): { email?: string; role?: string } | null => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = parts[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (error) {
      console.error('Error decodificando JWT:', error);
      return null;
    }
  };

  const handleRegisterBuyer = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      await registerBuyer(buyerForm);
      setMessage('Registro exitoso');
      setBuyerForm({ name: '', lastName: '', email: '', password: '' });
      setView('home');
    } catch (error: any) {
      setMessage(`Error: ${error.message || JSON.stringify(error)}`);
    }
  };

  const handleRegisterOrganizer = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    
    // Verificar que existe token y currentUser
    if (!token || !currentUser) {
      setMessage('Debes iniciar sesión como comprador antes de convertirte en organizador');
      return;
    }
    
    try {
      const formData = {
        name: organizerForm.name,
        lastName: organizerForm.lastName,
      };
      
      const response = await upgradeToOrganizer(formData, token);
      
      // Actualizar currentUser si el back cambia el role
      if (response.role) {
        setCurrentUser({
          ...currentUser,
          role: response.role as 'buyer' | 'organizer' | 'admin',
        });
      }
      
      setMessage('Solicitud enviada, tu cuenta de organizador está en revisión ✅');
      setOrganizerForm({ name: '', lastName: '', email: '', password: '' });
      setView('home');
    } catch (error: any) {
      const errorMessage = error.message || error.error || JSON.stringify(error);
      setMessage(`Error: ${errorMessage}`);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await login(loginForm);
      setToken(res.access_token);
      
      // Decodificar JWT para obtener email y role
      const decoded = decodeJWT(res.access_token);
      if (decoded) {
        const role = decoded.role || 'buyer'; // Default a buyer si no viene role
        const email = decoded.email || loginForm.email;
        setCurrentUser({
          email,
          role: role as 'buyer' | 'organizer' | 'admin',
        });
      } else {
        // Si no se puede decodificar, usar valores del formulario
        setCurrentUser({
          email: loginForm.email,
          role: 'buyer',
        });
      }
      
      setMessage('Login correcto ✅');
      setLoginForm({ email: '', password: '' });
      setView('home'); // Volver al home en lugar de admin
    } catch (error: any) {
      const errorMessage = error.message || error.error || JSON.stringify(error);
      setMessage(`Error en login: ${errorMessage}`);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
    setView('home');
    setMessage('');
  };

  const handleLoadPending = async () => {
    if (!token) {
      setMessage('Debes iniciar sesión como admin');
      setView('login');
      return;
    }
    setMessage('');
    try {
      const list = await getPendingOrganizers(token);
      setPending(list);
    } catch (error: any) {
      setMessage(`Error: ${error.message || JSON.stringify(error)}`);
    }
  };

  const handleApprove = async (id: string) => {
    if (!token) return;
    try {
      await approveOrganizer(id, token);
      setPending(pending.filter((org) => org.id !== id));
      setMessage('Organizador aprobado');
    } catch (error: any) {
      setMessage(`Error: ${error.message || JSON.stringify(error)}`);
    }
  };

  return (
    <div className="app-container">
      {/* Header principal */}
      <Header
        onSearchChange={setSearchTerm}
        onLoginClick={() => {
          if (currentUser) {
            handleLogout();
          } else {
            setView('login');
          }
        }}
        currentUser={currentUser}
      />

      {/* Contenido principal */}
      <main className="app-main">
        {view === 'home' && (
          <HomePage
            events={events}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onEventClick={(id) => {
              // Aquí puedes navegar al detalle del evento
              console.log('Evento clickeado:', id);
            }}
          />
        )}

        {(view === 'buyer' || view === 'organizer' || view === 'login' || view === 'admin') && (
          <div className="content-card">
            {view === 'buyer' && (
              <div className="form-container">
                <h2 className="form-title">Registro de Comprador</h2>
                <form onSubmit={handleRegisterBuyer} className="form">
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={buyerForm.name}
                    onChange={(e) =>
                      setBuyerForm({ ...buyerForm, name: e.target.value })
                    }
                    className="form-input"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Apellido"
                    value={buyerForm.lastName}
                    onChange={(e) =>
                      setBuyerForm({ ...buyerForm, lastName: e.target.value })
                    }
                    className="form-input"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={buyerForm.email}
                    onChange={(e) =>
                      setBuyerForm({ ...buyerForm, email: e.target.value })
                    }
                    className="form-input"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={buyerForm.password}
                    onChange={(e) =>
                      setBuyerForm({ ...buyerForm, password: e.target.value })
                    }
                    className="form-input"
                    required
                  />
                  <button type="submit" className="btn-primary">
                    Registrar
                  </button>
                </form>
                {message && (
                  <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                    {message}
                  </div>
                )}
              </div>
            )}

            {view === 'organizer' && (
              <div className="form-container">
                {currentUser?.role === 'admin' ? (
                  <div className="message error">
                    Los administradores no pueden convertirse en organizadores.
                  </div>
                ) : currentUser?.role === 'organizer' ? (
                  <div className="message success">
                    Ya eres organizador. Tu cuenta está en revisión o ya fue aprobada.
                  </div>
                ) : (
                  <>
                    <h2 className="form-title">Convertirme en organizador</h2>
                    <p className="form-subtitle">
                      Completa el formulario para solicitar convertir tu cuenta de comprador en organizador. 
                      Tu solicitud será revisada por un administrador.
                    </p>
                    <form onSubmit={handleRegisterOrganizer} className="form">
                      <input
                        type="text"
                        placeholder="Nombre"
                        value={organizerForm.name}
                        onChange={(e) =>
                          setOrganizerForm({ ...organizerForm, name: e.target.value })
                        }
                        className="form-input"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Apellido"
                        value={organizerForm.lastName}
                        onChange={(e) =>
                          setOrganizerForm({
                            ...organizerForm,
                            lastName: e.target.value,
                          })
                        }
                        className="form-input"
                        required
                      />
                      <button type="submit" className="btn-primary">
                        Enviar solicitud
                      </button>
                    </form>
                    {message && (
                      <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                        {message}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {view === 'login' && (
              <div className="form-container">
                <h2 className="form-title">Login</h2>
                <form onSubmit={handleLogin} className="form">
                  <input
                    type="email"
                    placeholder="Email"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                    className="form-input"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    className="form-input"
                    required
                  />
                  <button type="submit" className="btn-primary">
                    Iniciar Sesión
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
            )}

            {view === 'admin' && (
              <div className="admin-container">
                <h2 className="admin-title">
                  Panel admin – Organizadores pendientes
                </h2>
                {token ? (
                  <>
                    <button
                      onClick={handleLoadPending}
                      className="btn-primary"
                      type="button"
                    >
                      Cargar pendientes
                    </button>
                    {message && (
                      <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                        {message}
                      </div>
                    )}
                    {pending.length > 0 && (
                      <div className="organizers-list">
                        {pending.map((org) => (
                          <div key={org.id} className="organizer-card">
                            <div className="organizer-info">
                              <div className="organizer-name">
                                {org.name} {org.lastName}
                              </div>
                              <div className="organizer-email">{org.email}</div>
                              <div className="organizer-status">
                                Estado: {org.organizerStatus}
                              </div>
                            </div>
                            <button
                              onClick={() => handleApprove(org.id)}
                              className="btn-approve"
                            >
                              Aprobar
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="message error">
                    Debes iniciar sesión como admin
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
