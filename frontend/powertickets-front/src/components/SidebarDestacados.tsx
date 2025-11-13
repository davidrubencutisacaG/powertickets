import './SidebarDestacados.css';

type FeaturedEvent = {
  id: string;
  name: string;
  date: string;
  imageUrl?: string;
};

type SidebarDestacadosProps = {
  events: FeaturedEvent[];
  onEventClick?: (id: string) => void;
};

export default function SidebarDestacados({
  events,
  onEventClick,
}: SidebarDestacadosProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (events.length === 0) {
    return null;
  }

  return (
    <aside className="sidebar-destacados">
      <h2 className="sidebar-title">Eventos Destacados</h2>
      <div className="sidebar-events-list">
        {events.map((event) => (
          <div
            key={event.id}
            className="sidebar-event-item"
            onClick={() => onEventClick?.(event.id)}
          >
            <div className="sidebar-event-image">
              <img
                src={event.imageUrl || `/events/${event.id}.jpg`}
                alt={event.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-event.jpg';
                }}
              />
            </div>
            <div className="sidebar-event-content">
              <h3 className="sidebar-event-title">{event.name}</h3>
              <p className="sidebar-event-date">{formatDate(event.date)}</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

