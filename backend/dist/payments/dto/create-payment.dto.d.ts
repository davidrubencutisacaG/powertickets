import { PaymentStatus } from '../../database/entities/payment.entity';
export declare class CreatePaymentDto {
    orderId: string;
    paymentMethodId: string;
    amount: string;
    currency: string;
    status?: PaymentStatus;
}
