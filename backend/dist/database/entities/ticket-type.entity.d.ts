import { Event } from './event.entity';
import { TicketInstance } from './ticket-instance.entity';
import { OrderLine } from './order-line.entity';
export declare enum TicketTypeStatus {
    ACTIVE = "Active",
    INACTIVE = "Inactive"
}
export declare class TicketType {
    id: string;
    event: Event;
    name: string;
    price: string;
    currency: string;
    quota: number;
    maxPerOrder: number;
    saleStart: Date;
    saleEnd: Date;
    status: TicketTypeStatus;
    createdAt: Date;
    updatedAt: Date;
    ticketInstances: TicketInstance[];
    orderLines: OrderLine[];
}
