import { useState, useEffect } from 'react';
import './MisCompras.css';

type Purchase = {
  id: string;
  name: string;
  date: string;
  location: string;
  price: number;
  quantity: number;
  purchaseDate: string;
  ticketCode: string;
  imageUrl?: string;
};

export default function MisCompras() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar compras desde localStorage (simulado)
    // En producción, esto vendría del backend
    const savedPurchases = localStorage.getItem('purchases');
    if (savedPurchases) {
      setPurchases(JSON.parse(savedPurchases));
    } else {
      // Datos mock para demostración
      const mockPurchases: Purchase[] = [
        {
          id: '1',
          name: 'Concierto de Rock',
          date: '2024-12-25T20:00:00Z',
          location: 'Lima',
          price: 50,
          quantity: 2,
          purchaseDate: new Date().toISOString(),
          ticketCode: 'TICKET-123456789',
        },
      ];
      setPurchases(mockPurchases);
    }
    setLoading(false);
  }, []);

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
      <div className="mis-compras-container">
        <div className="mis-compras-content">
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mis-compras-container">
      <div className="mis-compras-content">
        <h1 className="mis-compras-title">Mis Compras</h1>

        {purchases.length === 0 ? (
          <div className="mis-compras-empty">
            <p>No has realizado ninguna compra todavía</p>
          </div>
        ) : (
          <div className="purchases-list">
            {purchases.map((purchase, index) => (
              <div key={index} className="purchase-card">
                <div className="purchase-header">
                  <h3>{purchase.name}</h3>
                  <span className="ticket-code">Código: {purchase.ticketCode}</span>
                </div>
                <div className="purchase-details">
                  <div className="purchase-detail-row">
                    <span className="detail-label">Fecha del evento:</span>
                    <span className="detail-value">{formatDate(purchase.date)}</span>
                  </div>
                  <div className="purchase-detail-row">
                    <span className="detail-label">Ubicación:</span>
                    <span className="detail-value">{purchase.location}</span>
                  </div>
                  <div className="purchase-detail-row">
                    <span className="detail-label">Cantidad:</span>
                    <span className="detail-value">{purchase.quantity}</span>
                  </div>
                  <div className="purchase-detail-row">
                    <span className="detail-label">Precio unitario:</span>
                    <span className="detail-value">S/ {purchase.price.toFixed(2)}</span>
                  </div>
                  <div className="purchase-detail-row">
                    <span className="detail-label">Fecha de compra:</span>
                    <span className="detail-value">{formatDate(purchase.purchaseDate)}</span>
                  </div>
                  <div className="purchase-detail-row total-row">
                    <span className="detail-label">Total:</span>
                    <span className="detail-value total">S/ {(purchase.price * purchase.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

