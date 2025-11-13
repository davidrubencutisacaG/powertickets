import { UserRole } from '../../database/entities/user.entity';
export declare class RegisterDto {
    name: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    dni?: string;
    role?: UserRole;
}
