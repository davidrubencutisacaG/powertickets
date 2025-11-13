import { Organizer } from './organizer.entity';
import { Payment } from './payment.entity';
export declare enum PaymentProvider {
    CARD = "Card",
    YAPE = "Yape",
    PLIN = "Plin",
    TRANSFER = "Transfer",
    CASH = "Cash"
}
export declare class PaymentMethod {
    id: string;
    organization: Organizer;
    provider: PaymentProvider;
    label: string;
    phoneNumber?: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    payments: Payment[];
}
