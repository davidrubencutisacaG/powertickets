import { OrganizerRequestsService } from './organizer-requests.service';
import { User } from '../database/entities/user.entity';
import { CreateOrganizerRequestDto } from './dto/create-organizer-request.dto';
import { OrganizerRequestStatus } from '../database/entities/organizer-request.entity';
export declare class OrganizerRequestsController {
    private readonly organizerRequestsService;
    constructor(organizerRequestsService: OrganizerRequestsService);
    create(user: User, dto: CreateOrganizerRequestDto): Promise<import("../database/entities/organizer-request.entity").OrganizerRequest>;
    getMyRequest(user: User): Promise<import("../database/entities/organizer-request.entity").OrganizerRequest | null>;
    findAll(status?: OrganizerRequestStatus): Promise<import("../database/entities/organizer-request.entity").OrganizerRequest[]>;
    approve(id: string): Promise<import("../database/entities/organizer-request.entity").OrganizerRequest>;
    reject(id: string): Promise<import("../database/entities/organizer-request.entity").OrganizerRequest>;
}
