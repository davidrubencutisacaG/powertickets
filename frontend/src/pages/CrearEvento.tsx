import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createEvent } from '../api';
import './CrearEvento.css';

export default function CrearEvento() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    price: '',
    capacity: '',
    flyerUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMessage('Debes iniciar sesión para crear un evento');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Combinar fecha y hora
      const dateTime = formData.date && formData.time 
        ? `${formData.date}T${formData.time}:00Z`
        : formData.date;

      const eventData = {
        name: formData.name,
        description: formData.description,
        date: dateTime,
        location: formData.location,
        category: formData.category,
        price: formData.price ? parseFloat(formData.price) : undefined,
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
        flyerUrl: formData.flyerUrl || undefined,
      };

      await createEvent(eventData, token);
      setMessage('Evento creado exitosamente ✅');
      
      // Limpiar formulario
      setFormData({
        name: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: '',
        price: '',
        capacity: '',
        flyerUrl: '',
      });

      // Redirigir a Mis Eventos después de 2 segundos
      setTimeout(() => {
        navigate('/organizador/mis-eventos');
      }, 2000);
    } catch (error: any) {
      const errorMessage = error.message || error.error || JSON.stringify(error);
      setMessage(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crear-evento-container">
      <div className="crear-evento-content">
        <h1 className="crear-evento-title">Crear Nuevo Evento</h1>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="evento-form">
          <div className="form-group">
            <label htmlFor="name">Nombre del Evento *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Ej: Concierto de Rock"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              rows={4}
              placeholder="Describe tu evento..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Fecha *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">Hora *</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Ubicación *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Ej: Lima, Perú"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Categoría *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="">Selecciona una categoría</option>
                <option value="Música">Música</option>
                <option value="Deportes">Deportes</option>
                <option value="Arte">Arte</option>
                <option value="Teatro">Teatro</option>
                <option value="Conferencia">Conferencia</option>
                <option value="Festival">Festival</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="price">Precio (S/)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="form-input"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="capacity">Aforo</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                className="form-input"
                placeholder="Ej: 100"
              />
            </div>

            <div className="form-group">
              <label htmlFor="flyerUrl">URL de la Imagen</label>
              <input
                type="url"
                id="flyerUrl"
                name="flyerUrl"
                value={formData.flyerUrl}
                onChange={handleChange}
                className="form-input"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/organizador/mis-eventos')}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

