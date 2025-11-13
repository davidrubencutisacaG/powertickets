import { Repository } from 'typeorm';
import { Payment } from '../database/entities/payment.entity';
import { PaymentMethod } from '../database/entities/payment-method.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { OrdersService } from '../orders/orders.service';
import { Order } from '../database/entities/order.entity';
export declare class PaymentsService {
    private readonly paymentsRepository;
    private readonly paymentMethodsRepository;
    private readonly ordersRepository;
    private readonly ordersService;
    constructor(paymentsRepository: Repository<Payment>, paymentMethodsRepository: Repository<PaymentMethod>, ordersRepository: Repository<Order>, ordersService: OrdersService);
    create(dto: CreatePaymentDto): Promise<Payment>;
}
