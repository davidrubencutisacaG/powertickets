import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '../database/entities/user.entity';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(user: User, dto: CreateOrderDto): Promise<import("../database/entities/order.entity").Order | null>;
    findOne(id: string): Promise<import("../database/entities/order.entity").Order>;
}
