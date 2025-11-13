import { Repository } from 'typeorm';
import { Organizer, OrganizerStatus } from '../database/entities/organizer.entity';
export declare class OrganizersService {
    private readonly organizersRepository;
    constructor(organizersRepository: Repository<Organizer>);
    findAll(): Promise<Organizer[]>;
    findById(id: string): Promise<Organizer | null>;
    updateStatus(id: string, status: OrganizerStatus): Promise<Organizer>;
}
