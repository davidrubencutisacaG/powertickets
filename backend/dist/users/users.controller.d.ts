import { UsersService } from './users.service';
import { User } from '../database/entities/user.entity';
import { UpgradeToOrganizerDto } from './dto/upgrade-to-organizer.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    list(): Promise<User[]>;
    getPendingOrganizers(): Promise<User[]>;
    approveOrganizer(id: string): Promise<User>;
    rejectOrganizer(id: string): Promise<User>;
    upgradeToOrganizer(user: User, dto: UpgradeToOrganizerDto): Promise<User>;
}
