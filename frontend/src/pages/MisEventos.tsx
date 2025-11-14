import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getOrganizerEvents } from '../api';
import './MisEventos.css';

type Event = {
  id: string;
  name: string;
  description?: string;
  date: string;
  location: string;
  category: string;
  price?: number;
  capacity?: number;
  flyerUrl?: string;
};

export default function MisEventos() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadEvents();
  }, [token]);

  const loadEvents = async () => {
    if (!token) {
      setMessage('Debes iniciar sesión para ver tus eventos');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const eventsList = await getOrganizerEvents(token);
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
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="mis-eventos-container">
        <div className="mis-eventos-content">
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mis-eventos-container">
      <div className="mis-eventos-content">
        <div className="mis-eventos-header">
          <h1 className="mis-eventos-title">Mis Eventos</h1>
          <button
            className="btn-primary"
            onClick={() => navigate('/organizador/crear-evento')}
          >
            Crear Evento
          </button>
        </div>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'info'}`}>
            {message}
          </div>
        )}

        {events.length === 0 ? (
          <div className="mis-eventos-empty">
            <p>No has creado ningún evento todavía</p>
            <button
              className="btn-primary"
              onClick={() => navigate('/organizador/crear-evento')}
            >
              Crear tu Primer Evento
            </button>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-card-image">
                  <img
                    src={event.flyerUrl || `/events/${event.id}.jpg`}
                    alt={event.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-event.jpg';
                    }}
                  />
                </div>
                <div className="event-card-content">
                  <h3 className="event-card-name">{event.name}</h3>
                  <p className="event-card-category">{event.category}</p>
                  <p className="event-card-date">{formatDate(event.date)}</p>
                  <p className="event-card-location">{event.location}</p>
                  {event.price !== undefined && (
                    <p className="event-card-price">S/ {event.price.toFixed(2)}</p>
                  )}
                  {event.capacity && (
                    <p className="event-card-capacity">Aforo: {event.capacity}</p>
                  )}
                  {event.description && (
                    <p className="event-card-description">{event.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

