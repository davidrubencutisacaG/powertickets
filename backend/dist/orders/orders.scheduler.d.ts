import { OrdersService } from './orders.service';
import { TicketsService } from '../tickets/tickets.service';
export declare class OrdersScheduler {
    private readonly ordersService;
    private readonly ticketsService;
    private readonly logger;
    constructor(ordersService: OrdersService, ticketsService: TicketsService);
    handleExpiredReservations(): Promise<void>;
}
