const API_URL = 'http://localhost:3000/api';

/**
 * Registra un nuevo comprador
 * @param body - Datos del comprador
 * @returns Promise con la respuesta del servidor
 */
export async function registerBuyer(body: any) {
  const res = await fetch(`${API_URL}/auth/register-buyer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw await res.json();
  }

  return res.json();
}

/**
 * Registra un nuevo organizador
 * @param body - Datos del organizador
 * @returns Promise con la respuesta del servidor
 */
export async function registerOrganizer(body: any) {
  const res = await fetch(`${API_URL}/auth/register-organizer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw await res.json();
  }

  return res.json();
}

/**
 * Inicia sesión y obtiene el token de acceso
 * @param body - Credenciales de login
 * @returns Promise con { access_token }
 */
export async function login(body: any): Promise<{ access_token: string }> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw await res.json();
  }

  return res.json();
}

/**
 * Obtiene la lista de organizadores pendientes de aprobación
 * @param token - Token de autenticación
 * @returns Promise con la lista de organizadores pendientes
 */
export async function getPendingOrganizers(token: string) {
  const res = await fetch(`${API_URL}/users/organizers/pending`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw await res.json();
  }

  return res.json();
}

/**
 * Aprueba un organizador pendiente
 * @param id - ID del organizador a aprobar
 * @param token - Token de autenticación
 * @returns Promise con la respuesta del servidor
 */
export async function approveOrganizer(id: string, token: string) {
  const res = await fetch(`${API_URL}/users/organizers/${id}/approve`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw await res.json();
  }

  return res.json();
}

/**
 * Lista eventos públicos
 * @returns Promise con la lista de eventos
 */
export async function getEvents() {
  const res = await fetch(`${API_URL}/events`);

  if (!res.ok) {
    throw await res.json();
  }

  return res.json();
}

/**
 * Obtiene un evento por id
 * @param id - ID del evento
 * @returns Promise con los datos del evento
 */
export async function getEventById(id: string) {
  const res = await fetch(`${API_URL}/events/${id}`);

  if (!res.ok) {
    throw await res.json();
  }

  return res.json();
}

/**
 * Convierte un comprador en organizador pendiente
 * @param body - Datos para la conversión
 * @param token - Token de autenticación
 * @returns Promise con la respuesta del servidor
 */
export async function upgradeToOrganizer(body: any, token: string) {
  const res = await fetch(`${API_URL}/users/me/upgrade-to-organizer`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw await res.json();
  }

  return res.json();
}
