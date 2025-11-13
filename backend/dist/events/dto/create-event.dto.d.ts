import { EventCategory, EventStatus } from '../../database/entities/event.entity';
import { TicketTypeStatus } from '../../database/entities/ticket-type.entity';
declare class TicketTypeInput {
    name: string;
    price: string;
    currency: string;
    quota: number;
    maxPerOrder: number;
    saleStart: string;
    saleEnd: string;
    status?: TicketTypeStatus;
}
export declare class CreateEventDto {
    organizerId: string;
    name: string;
    description: string;
    category: EventCategory;
    startsAt: string;
    endsAt: string;
    venue: string;
    capacity: number;
    status?: EventStatus;
    ticketTypes: TicketTypeInput[];
}
export {};
