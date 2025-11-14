import './EventCard.css';

type EventCardProps = {
  id: string;
  name: string;
  date: string;
  location: string;
  category: string;
  price?: number;
  imageUrl?: string;
  onClick?: () => void;
  onAddToCart?: (event: { id: string; name: string; date: string; location: string; price: number; imageUrl?: string }) => void;
  showAddToCart?: boolean;
};

export default function EventCard({
  id,
  name,
  date,
  location,
  category,
  price,
  imageUrl,
  onClick,
  onAddToCart,
  showAddToCart = false,
}: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'Gratis';
    return `S/ ${price.toFixed(2)}`;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart && price !== undefined) {
      onAddToCart({
        id,
        name,
        date,
        location,
        price,
        imageUrl,
      });
    }
  };

  return (
    <div className="event-card" onClick={onClick}>
      <div className="event-card-image">
        <img
          src={imageUrl || `/events/${id}.jpg`}
          alt={name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-event.jpg';
          }}
        />
        <div className="event-card-category-badge">{category}</div>
      </div>
      <div className="event-card-content">
        <h3 className="event-card-title">{name}</h3>
        <div className="event-card-info">
          <p className="event-card-date">📅 {formatDate(date)}</p>
          <p className="event-card-location">📍 {location}</p>
        </div>
        {price !== undefined && (
          <div className="event-card-price">{formatPrice(price)}</div>
        )}
        {showAddToCart && onAddToCart && price !== undefined && (
          <button
            className="event-card-add-to-cart"
            onClick={handleAddToCart}
          >
            Agregar al Carrito
          </button>
        )}
      </div>
    </div>
  );
}

