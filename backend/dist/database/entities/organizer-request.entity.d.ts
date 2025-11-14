import { User } from './user.entity';
export declare enum OrganizerRequestStatus {
    PENDING = "Pending",
    APPROVED = "Approved",
    REJECTED = "Rejected"
}
export declare class OrganizerRequest {
    id: string;
    user: User;
    organizationName: string;
    ruc?: string;
    document?: string;
    phone?: string;
    address?: string;
    website?: string;
    description?: string;
    status: OrganizerRequestStatus;
    createdAt: Date;
    updatedAt: Date;
}
