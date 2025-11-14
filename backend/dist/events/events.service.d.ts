import { Repository } from 'typeorm';
import { Event } from '../database/entities/event.entity';
import { Organizer } from '../database/entities/organizer.entity';
import { TicketType } from '../database/entities/ticket-type.entity';
import { TicketInstance } from '../database/entities/ticket-instance.entity';
import { User } from '../database/entities/user.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
export declare class EventsService {
    private readonly eventsRepository;
    private readonly organizersRepository;
    private readonly ticketTypesRepository;
    private readonly ticketInstancesRepository;
    private readonly usersRepository;
    constructor(eventsRepository: Repository<Event>, organizersRepository: Repository<Organizer>, ticketTypesRepository: Repository<TicketType>, ticketInstancesRepository: Repository<TicketInstance>, usersRepository: Repository<User>);
    findOrCreateOrganizerForUser(userId: string): Promise<Organizer>;
    create(dto: CreateEventDto, userId?: string): Promise<Event | null>;
    findAll(): Promise<Event[]>;
    update(id: string, dto: UpdateEventDto): Promise<Event>;
    findById(id: string): Promise<Event>;
    findByOrganizerUserId(userId: string): Promise<Event[]>;
}
