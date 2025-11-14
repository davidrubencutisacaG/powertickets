import { Repository } from 'typeorm';
import { User, OrganizerStatus } from '../database/entities/user.entity';
import { Organizer } from '../database/entities/organizer.entity';
import { UpgradeToOrganizerDto } from './dto/upgrade-to-organizer.dto';
export declare class UsersService {
    private readonly usersRepository;
    private readonly organizersRepository;
    constructor(usersRepository: Repository<User>, organizersRepository: Repository<Organizer>);
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    update(id: string, payload: Partial<User>): Promise<User>;
    list(): Promise<User[]>;
    findPendingOrganizers(): Promise<User[]>;
    updateOrganizerStatus(id: string, status: OrganizerStatus): Promise<User>;
    approveOrganizer(id: string): Promise<User>;
    rejectOrganizer(id: string): Promise<User>;
    upgradeBuyerToOrganizer(userId: string, dto: UpgradeToOrganizerDto): Promise<User>;
}
