import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { User } from '../database/entities/user.entity';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    create(user: User, dto: CreateEventDto): Promise<import("../database/entities/event.entity").Event | null>;
    findAll(): Promise<import("../database/entities/event.entity").Event[]>;
    getMyEvents(user: User): Promise<import("../database/entities/event.entity").Event[]>;
    findOne(id: string): Promise<import("../database/entities/event.entity").Event>;
    update(id: string, dto: UpdateEventDto): Promise<import("../database/entities/event.entity").Event>;
}
