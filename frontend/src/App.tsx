import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './HomePage';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Carrito from './pages/Carrito';
import MisCompras from './pages/MisCompras';
import CrearEvento from './pages/CrearEvento';
import MisEventos from './pages/MisEventos';
import CuentasPorAprobar from './pages/CuentasPorAprobar';
import MiCuenta from './pages/MiCuenta';
import { getEvents } from './api';
import { UserRole } from './types/roles';
import './App.css';

type Event = {
  id: string;
  name: string;
  date: string;
  location: string;
  category: string;
  flyerUrl?: string;
  price?: number;
};

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  // Cargar eventos al montar el componente
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const eventsList = await getEvents();
        // Asegurar que eventsList sea un array
        const eventsArray = Array.isArray(eventsList) 
          ? eventsList 
          : Array.isArray(eventsList?.data) 
            ? eventsList.data 
            : [];
        setEvents(eventsArray);
      } catch (error: any) {
        const errorMessage = error.message || error.error || JSON.stringify(error);
        setMessage(`Error al cargar eventos: ${errorMessage}`);
        setEvents([]);
      }
    };
    loadEvents();
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Header onSearchChange={setSearchTerm} />
          
          <main className="app-main">
            {message && (
              <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                {message}
              </div>
            )}

            <Routes>
              <Route 
                path="/" 
                element={
                  <HomePage
                    events={events}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                  />
                } 
              />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              
              {/* Rutas protegidas para comprador */}
              <Route
                path="/carrito"
                element={
                  <PrivateRoute requiredRole={UserRole.COMPRADOR}>
                    <Carrito />
                  </PrivateRoute>
                }
              />
              <Route
                path="/mis-compras"
                element={
                  <PrivateRoute requiredRole={UserRole.COMPRADOR}>
                    <MisCompras />
                  </PrivateRoute>
                }
              />
              
              {/* Rutas protegidas para organizador */}
              <Route
                path="/organizador/crear-evento"
                element={
                  <PrivateRoute requiredRole={UserRole.ORGANIZADOR}>
                    <CrearEvento />
                  </PrivateRoute>
                }
              />
              <Route
                path="/organizador/mis-eventos"
                element={
                  <PrivateRoute requiredRole={UserRole.ORGANIZADOR}>
                    <MisEventos />
                  </PrivateRoute>
                }
              />
              
              {/* Rutas protegidas para admin */}
              <Route
                path="/admin/cuentas-por-aprobar"
                element={
                  <PrivateRoute requiredRole={UserRole.ADMIN}>
                    <CuentasPorAprobar />
                  </PrivateRoute>
                }
              />
              
              {/* Ruta protegida para todos los usuarios logueados */}
              <Route
                path="/mi-cuenta"
                element={
                  <PrivateRoute>
                    <MiCuenta />
                  </PrivateRoute>
                }
              />
              
              {/* Ruta por defecto */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
