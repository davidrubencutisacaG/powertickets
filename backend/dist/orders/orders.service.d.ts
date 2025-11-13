import { Repository } from 'typeorm';
import { Order } from '../database/entities/order.entity';
import { OrderLine } from '../database/entities/order-line.entity';
import { TicketType } from '../database/entities/ticket-type.entity';
import { TicketInstance } from '../database/entities/ticket-instance.entity';
import { Organizer } from '../database/entities/organizer.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { TicketsService } from '../tickets/tickets.service';
import { User } from '../database/entities/user.entity';
export declare class OrdersService {
    private readonly ordersRepository;
    private readonly orderLinesRepository;
    private readonly ticketTypesRepository;
    private readonly ticketInstancesRepository;
    private readonly organizersRepository;
    private readonly ticketsService;
    constructor(ordersRepository: Repository<Order>, orderLinesRepository: Repository<OrderLine>, ticketTypesRepository: Repository<TicketType>, ticketInstancesRepository: Repository<TicketInstance>, organizersRepository: Repository<Organizer>, ticketsService: TicketsService);
    createOrder(buyer: User, dto: CreateOrderDto): Promise<Order | null>;
    findById(id: string): Promise<Order>;
    markPaid(orderId: string): Promise<Order>;
    expirePendingOrders(): Promise<number>;
}
