import { Repository } from 'typeorm';
import { TicketInstance } from '../database/entities/ticket-instance.entity';
export declare class TicketsService {
    private readonly ticketsRepository;
    constructor(ticketsRepository: Repository<TicketInstance>);
    reserveTickets(ticketTypeId: string, quantity: number, orderId: string, expiresAt: Date): Promise<TicketInstance[]>;
    releaseExpiredReservations(now?: Date): Promise<number>;
    markAsUsed(qrCode: string): Promise<TicketInstance>;
    validateQr(qrCode: string): Promise<TicketInstance>;
}
