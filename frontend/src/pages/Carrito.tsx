import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Carrito.css';

type CartItem = {
  id: string;
  name: string;
  date: string;
  location: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

export default function Carrito() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    setMessage('Evento eliminado del carrito');
    setTimeout(() => setMessage(''), 3000);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    // Simulación de compra
    if (cartItems.length === 0) {
      setMessage('El carrito está vacío');
      return;
    }
    
    // Aquí se guardarían las compras en localStorage o se enviarían al backend
    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
    const newPurchases = cartItems.map(item => ({
      ...item,
      purchaseDate: new Date().toISOString(),
      ticketCode: `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }));
    
    localStorage.setItem('purchases', JSON.stringify([...purchases, ...newPurchases]));
    localStorage.removeItem('cart');
    setCartItems([]);
    setMessage('Compra realizada exitosamente!');
    setTimeout(() => {
      navigate('/mis-compras');
    }, 2000);
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

  return (
    <div className="carrito-container">
      <div className="carrito-content">
        <h1 className="carrito-title">Carrito de Compras</h1>
        
        {message && (
          <div className={`message ${message.includes('éxito') ? 'success' : 'info'}`}>
            {message}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="carrito-empty">
            <p>Tu carrito está vacío</p>
            <button 
              className="btn-primary" 
              onClick={() => navigate('/')}
            >
              Ver Eventos
            </button>
          </div>
        ) : (
          <>
            <div className="carrito-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img 
                      src={item.imageUrl || `/events/${item.id}.jpg`} 
                      alt={item.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-event.jpg';
                      }}
                    />
                  </div>
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p className="cart-item-date">{formatDate(item.date)}</p>
                    <p className="cart-item-location">{item.location}</p>
                    <p className="cart-item-price">S/ {item.price.toFixed(2)}</p>
                  </div>
                  <div className="cart-item-controls">
                    <div className="quantity-controls">
                      <button 
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                  <div className="cart-item-total">
                    <p>S/ {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="carrito-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>S/ {calculateTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Total:</span>
                <span className="total-price">S/ {calculateTotal().toFixed(2)}</span>
              </div>
              <button className="btn-checkout" onClick={handleCheckout}>
                Proceder al Pago
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

