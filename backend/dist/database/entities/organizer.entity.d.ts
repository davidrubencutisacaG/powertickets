import { User } from './user.entity';
import { Event } from './event.entity';
import { PaymentMethod } from './payment-method.entity';
import { Order } from './order.entity';
import { Report } from './report.entity';
export declare enum OrganizerStatus {
    PENDING = "Pending",
    APPROVED = "Approved",
    REJECTED = "Rejected"
}
export declare class Organizer {
    id: string;
    user: User;
    photoUrl?: string;
    status: OrganizerStatus;
    createdAt: Date;
    updatedAt: Date;
    events: Event[];
    paymentMethods: PaymentMethod[];
    orders: Order[];
    reports: Report[];
}
