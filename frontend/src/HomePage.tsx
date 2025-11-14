import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./contexts/AuthContext";
import { UserRole } from './types/roles';
import Carousel from './components/Carousel';
import EventCard from './components/EventCard';
import SidebarDestacados from './components/SidebarDestacados';
import './HomePage.css';

type Event = {
  id: string;
  name: string;
  date: string;
  location: string;
  category: string;
  flyerUrl?: string;
  price?: number;
};

type HomePageProps = {
  events: Event[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
};

export default function HomePage({
  events,
  searchTerm,
  onSearchChange,
}: HomePageProps) {
  const navigate = useNavigate();
  const { isAuthenticated, hasRole } = useAuth();
  const [message, setMessage] = useState('');

  // Validación defensiva: asegurar que events siempre sea un array
  const eventsArray = Array.isArray(events) ? events : [];
  
  // Formatear fecha simple
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Preparar slides para el carrusel (usar los primeros 5 eventos)
  const carouselSlides = eventsArray.slice(0, 5).map((event) => ({
    img: event.flyerUrl || `/events/${event.id}.jpg`,
    title: event.name,
    category: event.category,
    date: formatDate(event.date),
  }));

  // Filtrar eventos por searchTerm (nombre y categoría, case-insensitive)
  const filteredEvents = eventsArray.filter((event) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      event.name.toLowerCase().includes(searchLower) ||
      event.category.toLowerCase().includes(searchLower)
    );
  });

  // Eventos destacados para el sidebar (primeros 4)
  const featuredEvents = eventsArray.slice(0, 4).map((event) => ({
    id: event.id,
    name: event.name,
    date: event.date,
    imageUrl: event.flyerUrl || `/events/${event.id}.jpg`,
  }));

  // Función para agregar evento al carrito
  const handleAddToCart = (event: { id: string; name: string; date: string; location: string; price: number; imageUrl?: string }) => {
    if (!isAuthenticated || !hasRole(UserRole.COMPRADOR)) {
      setMessage('Debes iniciar sesión como comprador para agregar eventos al carrito');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find((item: any) => item.id === event.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          ...event,
          quantity: 1,
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      setMessage('Evento agregado al carrito ✅');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error al agregar evento al carrito');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="home-page">
      {/* Carrusel de eventos destacados */}
      {carouselSlides.length > 0 && <Carousel slides={carouselSlides} />}

      {/* Contenido principal con layout de 2 columnas */}
      <div className="home-content-container">
        <div className="home-main-content">
          {/* Barra de búsqueda */}
          <section className="home-search-section">
            <input
              type="text"
              placeholder="Buscar evento o organizador..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="home-search-input"
            />
          </section>

          {message && (
            <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          {/* Grid de eventos */}
          <section className="events-grid-section">
            <h2 className="section-title">Todos los Eventos</h2>
            {filteredEvents.length > 0 ? (
              <div className="events-grid">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    name={event.name}
                    date={event.date}
                    location={event.location}
                    category={event.category}
                    price={event.price}
                    imageUrl={event.flyerUrl || `/events/${event.id}.jpg`}
                    onClick={() => {
                      // Aquí puedes navegar al detalle del evento
                      console.log('Evento clickeado:', event.id);
                    }}
                    onAddToCart={handleAddToCart}
                    showAddToCart={isAuthenticated && hasRole(UserRole.COMPRADOR) && event.price !== undefined}
                  />
                ))}
              </div>
            ) : (
              <div className="no-events-message">
                <p>No se encontraron eventos que coincidan con tu búsqueda.</p>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar de destacados */}
        <aside className="home-sidebar">
          <SidebarDestacados
            events={featuredEvents}
            onEventClick={(id) => {
              console.log('Evento clickeado:', id);
            }}
          />
        </aside>
      </div>
    </div>
  );
}
