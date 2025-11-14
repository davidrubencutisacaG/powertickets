import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { CurrentUser } from '../types/roles';
import { UserRole } from '../types/roles';

type AuthContextType = {
  user: CurrentUser;
  token: string | null;
  login: (token: string, user?: CurrentUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type DecodedToken = {
  email?: string;
  role?: string;
  sub?: string;
};

/**
 * Decodifica un JWT para obtener información del usuario
 * @param token - Token JWT a decodificar (puede ser null o undefined)
 * @returns Objeto con email, role y sub (id) o null si hay error
 */
export function decodeJWT(token: string | null | undefined): DecodedToken | null {
  if (!token || typeof token !== 'string') {
    return null;
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payloadBase64 = parts[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    return payload as DecodedToken;
  } catch (error) {
    console.error('Error decodificando JWT:', error);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });
  const [user, setUser] = useState<CurrentUser>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Función para inicializar usuario desde token (solo como fallback)
  const initializeUserFromToken = (token: string | null | undefined) => {
    if (!token) {
      return;
    }

    const decoded = decodeJWT(token);
    if (decoded) {
      const role = decoded.role || UserRole.COMPRADOR;
      const email = decoded.email || decoded.sub || '';
      const userData: CurrentUser = {
        email,
        role: role as UserRole,
        id: decoded.sub,
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  // Inicializar usuario desde token almacenado al cargar (solo si no hay user)
  useEffect(() => {
    if (token && !user) {
      // Solo intentar decodificar si no hay user guardado
      initializeUserFromToken(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (newToken: string, userData?: CurrentUser) => {
    // Validar que el token existe
    if (!newToken || typeof newToken !== 'string') {
      throw new Error('No se recibió token en la respuesta de login');
    }

    // Guardar token
    setToken(newToken);
    localStorage.setItem('token', newToken);
    
    // Si hay userData del backend, usarlo directamente
    if (userData) {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      // Fallback: intentar decodificar el token (solo si no hay userData)
      initializeUserFromToken(newToken);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAuthenticated = !!token && !!user;

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

