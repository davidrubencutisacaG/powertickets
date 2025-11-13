import { OrganizersService } from './organizers.service';
import { VerifyOrganizerDto } from './dto/verify-organizer.dto';
export declare class OrganizersController {
    private readonly organizersService;
    constructor(organizersService: OrganizersService);
    findAll(): Promise<import("../database/entities/organizer.entity").Organizer[]>;
    verify(id: string, dto: VerifyOrganizerDto): Promise<import("../database/entities/organizer.entity").Organizer>;
}
