import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getPendingOrganizers, approveOrganizer, rejectOrganizer } from '../api';
import './CuentasPorAprobar.css';

type OrganizerRequest = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  organizerStatus: string;
  createdAt?: string;
  organizationName?: string;
  organizationDescription?: string;
};

export default function CuentasPorAprobar() {
  const { token } = useAuth();
  const [requests, setRequests] = useState<OrganizerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, [token]);

  const loadRequests = async () => {
    if (!token) {
      setMessage('Debes iniciar sesión como admin');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const requestsList = await getPendingOrganizers(token);
      const requestsArray = Array.isArray(requestsList) 
        ? requestsList 
        : Array.isArray(requestsList?.data) 
          ? requestsList.data 
          : [];
      setRequests(requestsArray);
    } catch (error: any) {
      const errorMessage = error.message || error.error || JSON.stringify(error);
      setMessage(`Error al cargar solicitudes: ${errorMessage}`);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!token) return;

    try {
      setProcessingId(id);
      setMessage('');
      await approveOrganizer(id, token);
      setRequests(requests.filter(req => req.id !== id));
      setMessage('Organizador aprobado exitosamente ✅');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      const errorMessage = error.message || error.error || JSON.stringify(error);
      setMessage(`Error al aprobar: ${errorMessage}`);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!token) return;

    if (!confirm('¿Estás seguro de que deseas rechazar esta solicitud?')) {
      return;
    }

    try {
      setProcessingId(id);
      setMessage('');
      await rejectOrganizer(id, token);
      setRequests(requests.filter(req => req.id !== id));
      setMessage('Solicitud rechazada exitosamente ✅');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      const errorMessage = error.message || error.error || JSON.stringify(error);
      setMessage(`Error al rechazar: ${errorMessage}`);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
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
      <div className="cuentas-container">
        <div className="cuentas-content">
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cuentas-container">
      <div className="cuentas-content">
        <div className="cuentas-header">
          <h1 className="cuentas-title">Cuentas por Aprobar</h1>
          <button
            className="btn-refresh"
            onClick={loadRequests}
            disabled={loading}
          >
            Actualizar
          </button>
        </div>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {requests.length === 0 ? (
          <div className="cuentas-empty">
            <p>No hay solicitudes de organizador pendientes de aprobación</p>
          </div>
        ) : (
          <div className="requests-table">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Organización</th>
                  <th>Fecha de Solicitud</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <strong>{request.name} {request.lastName}</strong>
                    </td>
                    <td>{request.email}</td>
                    <td>
                      {request.organizationName || 'N/A'}
                      {request.organizationDescription && (
                        <div className="org-description">
                          {request.organizationDescription}
                        </div>
                      )}
                    </td>
                    <td>{formatDate(request.createdAt)}</td>
                    <td>
                      <span className={`status-badge status-${request.organizerStatus.toLowerCase()}`}>
                        {request.organizerStatus}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-approve"
                          onClick={() => handleApprove(request.id)}
                          disabled={processingId === request.id}
                        >
                          {processingId === request.id ? 'Procesando...' : 'Aprobar'}
                        </button>
                        <button
                          className="btn-reject"
                          onClick={() => handleReject(request.id)}
                          disabled={processingId === request.id}
                        >
                          Rechazar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

