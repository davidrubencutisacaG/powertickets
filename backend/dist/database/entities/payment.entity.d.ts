import { Order } from './order.entity';
import { PaymentMethod } from './payment-method.entity';
export declare enum PaymentStatus {
    INITIATED = "Initiated",
    AUTHORIZED = "Authorized",
    CAPTURED = "Captured",
    FAILED = "Failed",
    REFUNDED = "Refunded"
}
export declare class Payment {
    id: string;
    order: Order;
    paymentMethod: PaymentMethod;
    amount: string;
    currency: string;
    status: PaymentStatus;
    gatewayRef?: string;
    failureReason?: string;
    createdAt: Date;
    capturedAt?: Date | null;
    updatedAt: Date;
}
