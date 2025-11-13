import { Organizer } from './organizer.entity';
import { TicketType } from './ticket-type.entity';
import { TicketInstance } from './ticket-instance.entity';
import { Report } from './report.entity';
export declare enum EventCategory {
    CONCERT = "Concert",
    PARTY = "Party",
    THEATRE = "Theatre",
    TALK = "Talk"
}
export declare enum EventStatus {
    SCHEDULED = "Scheduled",
    ONGOING = "Ongoing",
    FINISHED = "Finished"
}
export declare class Event {
    id: string;
    organizer: Organizer;
    name: string;
    description: string;
    category: EventCategory;
    startsAt: Date;
    endsAt: Date;
    venue: string;
    capacity: number;
    status: EventStatus;
    createdAt: Date;
    updatedAt: Date;
    ticketTypes: TicketType[];
    ticketInstances: TicketInstance[];
    reports: Report[];
}
