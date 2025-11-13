import { Organizer } from './organizer.entity';
import { Order } from './order.entity';
export declare enum UserRole {
    ADMIN = "admin",
    ORGANIZER = "organizer",
    BUYER = "buyer"
}
export declare enum OrganizerStatus {
    PENDING = "Pending",
    APPROVED = "Approved",
    REJECTED = "Rejected"
}
export declare class User {
    id: string;
    name: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    dni?: string;
    selfieUrl?: string;
    role: UserRole;
    organizerStatus: OrganizerStatus;
    createdAt: Date;
    updatedAt: Date;
    organizers: Organizer[];
    orders: Order[];
}
