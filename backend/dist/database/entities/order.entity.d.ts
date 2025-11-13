import { User } from './user.entity';
import { Organizer } from './organizer.entity';
import { OrderLine } from './order-line.entity';
import { TicketInstance } from './ticket-instance.entity';
import { Payment } from './payment.entity';
export declare enum OrderStatus {
    PENDING = "Pending",
    PAID = "Paid",
    EXPIRED = "Expired",
    CANCELLED = "Cancelled",
    REFUNDED = "Refunded"
}
export declare class Order {
    id: string;
    buyer: User;
    organization: Organizer;
    status: OrderStatus;
    totalAmount: string;
    currency: string;
    placedAt: Date;
    paidAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    lines: OrderLine[];
    ticketInstances: TicketInstance[];
    payments: Payment[];
}
