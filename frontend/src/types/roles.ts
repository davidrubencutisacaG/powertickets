/**
 * Roles de usuario en el sistema
 */
export enum UserRole {
  COMPRADOR = 'buyer',
  ORGANIZADOR = 'organizer',
  ADMIN = 'admin',
}

/**
 * Tipo para el rol del usuario
 */
export type Role = UserRole.COMPRADOR | UserRole.ORGANIZADOR | UserRole.ADMIN;

/**
 * Tipo para el usuario actual
 */
export type CurrentUser = {
  email: string;
  role: Role;
  id?: string;
  name?: string;
  lastName?: string;
} | null;

