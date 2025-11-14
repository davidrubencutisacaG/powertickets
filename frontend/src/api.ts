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
 * @param body - Credenciales de login (email, password)
 * @returns Promise con { access_token: string, user: any }
 * @throws Error si las credenciales son incorrectas o si falta access_token
 */
export async function login(body: any): Promise<{ access_token: string; user?: any }> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    // Intentar obtener el error del servidor
    let errorData: any;
    try {
      errorData = await res.json();
    } catch (e) {
      // Si no se puede parsear como JSON, intentar obtener como texto
      try {
        const text = await res.text();
        errorData = { message: text || 'Error en el servidor', raw: text };
      } catch (textError) {
        errorData = { message: 'Error en el servidor' };
      }
    }

    // Log detallado del error del backend
    console.error("Login error:", {
      message: errorData?.message,
      status: res.status,
      statusText: res.statusText,
      data: errorData,
      headers: Object.fromEntries(res.headers.entries()),
      url: res.url,
      body: body, // Datos enviados en la petición
    });

    // Manejar errores de autenticación específicamente
    if (res.status === 401) {
      throw { message: 'Credenciales incorrectas', status: 401, data: errorData };
    }
    
    // Para otros errores, lanzar el error con toda la información
    throw { ...errorData, status: res.status };
  }

  // Parsear la respuesta del backend
  const wrapper = await res.json();
  
  // La respuesta puede venir envuelta en { success, data } o directamente como { access_token, user }
  // Si existe wrapper.data, usarlo; si no, usar wrapper directamente
  const payload = wrapper?.data ?? wrapper;
  
  // Obtener el token desde access_token o accessToken (con fallback)
  const token = payload?.access_token ?? payload?.accessToken ?? null;
  
  // Validar que el token existe
  if (!token || typeof token !== 'string') {
    console.error("Login error: No access_token in response", {
      wrapper: wrapper,
      payload: payload,
      hasAccessToken: !!payload?.access_token,
      hasAccessTokenCamel: !!payload?.accessToken,
      accessTokenType: typeof payload?.access_token,
      accessTokenCamelType: typeof payload?.accessToken,
    });
    throw new Error('No se recibió token en la respuesta de login');
  }

  // Retornar en el formato esperado por AuthContext
  return {
    access_token: token,
    user: payload.user,
  };
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

/**
 * Crea un nuevo evento (organizador)
 * @param body - Datos del evento
 * @param token - Token de autenticación
 * @returns Promise con la respuesta del servidor
 */
export async function createEvent(body: any, token: string) {
  const res = await fetch(`${API_URL}/events`, {
    method: 'POST',
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

/**
 * Obtiene los eventos del organizador actual
 * @param token - Token de autenticación
 * @returns Promise con la lista de eventos del organizador
 */
export async function getOrganizerEvents(token: string) {
  const res = await fetch(`${API_URL}/events/organizer/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw await res.json();
  }

  return res.json();
}

/**
 * Rechaza una solicitud de organizador
 * @param id - ID del organizador a rechazar
 * @param token - Token de autenticación
 * @returns Promise con la respuesta del servidor
 */
export async function rejectOrganizer(id: string, token: string) {
  const res = await fetch(`${API_URL}/users/organizers/${id}/reject`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw await res.json();
  }

  return res.json();
}