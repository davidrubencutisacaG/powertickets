import { Repository } from 'typeorm';
import { OrganizerRequest, OrganizerRequestStatus } from '../database/entities/organizer-request.entity';
import { User } from '../database/entities/user.entity';
import { CreateOrganizerRequestDto } from './dto/create-organizer-request.dto';
export declare class OrganizerRequestsService {
    private readonly organizerRequestsRepository;
    private readonly usersRepository;
    constructor(organizerRequestsRepository: Repository<OrganizerRequest>, usersRepository: Repository<User>);
    create(userId: string, dto: CreateOrganizerRequestDto): Promise<OrganizerRequest>;
    findMyRequest(userId: string): Promise<OrganizerRequest | null>;
    findAll(status?: OrganizerRequestStatus): Promise<OrganizerRequest[]>;
    findById(id: string): Promise<OrganizerRequest>;
    approve(id: string): Promise<OrganizerRequest>;
    reject(id: string): Promise<OrganizerRequest>;
}
