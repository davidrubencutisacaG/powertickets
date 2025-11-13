import { TicketsService } from './tickets.service';
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    validate(qr: string): Promise<import("../database/entities/ticket-instance.entity").TicketInstance>;
}
