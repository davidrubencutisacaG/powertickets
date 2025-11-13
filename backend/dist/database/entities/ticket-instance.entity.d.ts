import { TicketType } from './ticket-type.entity';
import { Event } from './event.entity';
import { Order } from './order.entity';
export declare enum TicketInstanceStatus {
    AVAILABLE = "Available",
    RESERVED = "Reserved",
    ISSUED = "Issued",
    USED = "Used",
    CANCELLED = "Cancelled"
}
export declare class TicketInstance {
    id: string;
    ticketType: TicketType;
    event: Event;
    serial: string;
    qrCode: string;
    status: TicketInstanceStatus;
    reservedUntil?: Date | null;
    order?: Order | null;
    usedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
