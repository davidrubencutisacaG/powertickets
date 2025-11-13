import { Order } from './order.entity';
import { TicketType } from './ticket-type.entity';
export declare class OrderLine {
    id: string;
    order: Order;
    ticketType: TicketType;
    unitPrice: string;
    quantity: number;
    lineTotal: string;
    feeTotal: string;
}
