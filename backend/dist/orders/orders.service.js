"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../database/entities/order.entity");
const order_line_entity_1 = require("../database/entities/order-line.entity");
const ticket_type_entity_1 = require("../database/entities/ticket-type.entity");
const ticket_instance_entity_1 = require("../database/entities/ticket-instance.entity");
const organizer_entity_1 = require("../database/entities/organizer.entity");
const tickets_service_1 = require("../tickets/tickets.service");
let OrdersService = class OrdersService {
    constructor(ordersRepository, orderLinesRepository, ticketTypesRepository, ticketInstancesRepository, organizersRepository, ticketsService) {
        this.ordersRepository = ordersRepository;
        this.orderLinesRepository = orderLinesRepository;
        this.ticketTypesRepository = ticketTypesRepository;
        this.ticketInstancesRepository = ticketInstancesRepository;
        this.organizersRepository = organizersRepository;
        this.ticketsService = ticketsService;
    }
    async createOrder(buyer, dto) {
        const organizer = await this.organizersRepository.findOne({ where: { id: dto.organizerId } });
        if (!organizer) {
            throw new common_1.NotFoundException('Organizer not found');
        }
        const order = this.ordersRepository.create({
            buyer,
            organization: organizer,
            status: order_entity_1.OrderStatus.PENDING,
            totalAmount: '0',
            currency: dto.currency,
        });
        const savedOrder = await this.ordersRepository.save(order);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        let total = 0;
        for (const item of dto.items) {
            const ticketType = await this.ticketTypesRepository.findOne({
                where: { id: item.ticketTypeId },
                relations: ['event', 'event.organizer'],
            });
            if (!ticketType) {
                throw new common_1.NotFoundException(`Ticket type ${item.ticketTypeId} not found`);
            }
            if (ticketType.status !== ticket_type_entity_1.TicketTypeStatus.ACTIVE) {
                throw new common_1.BadRequestException('Ticket type not active');
            }
            if (ticketType.event.organizer.id !== organizer.id) {
                throw new common_1.BadRequestException('Ticket type does not belong to this organizer');
            }
            const now = new Date();
            if (ticketType.saleStart > now || ticketType.saleEnd < now) {
                throw new common_1.BadRequestException('Ticket type not on sale');
            }
            if (item.quantity > ticketType.maxPerOrder) {
                throw new common_1.BadRequestException('Quantity exceeds maximum per order');
            }
            if (ticketType.currency !== dto.currency) {
                throw new common_1.BadRequestException('Currency mismatch');
            }
            const lineTotal = Number(ticketType.price) * item.quantity;
            total += lineTotal;
            const orderLine = this.orderLinesRepository.create({
                order: savedOrder,
                ticketType,
                unitPrice: ticketType.price,
                quantity: item.quantity,
                lineTotal: lineTotal.toFixed(2),
                feeTotal: '0.00',
            });
            await this.orderLinesRepository.save(orderLine);
            await this.ticketsService.reserveTickets(ticketType.id, item.quantity, savedOrder.id, expiresAt);
        }
        savedOrder.totalAmount = total.toFixed(2);
        await this.ordersRepository.save(savedOrder);
        return this.ordersRepository.findOne({ where: { id: savedOrder.id }, relations: ['lines'] });
    }
    async findById(id) {
        const order = await this.ordersRepository.findOne({
            where: { id },
            relations: ['lines', 'buyer', 'organization', 'ticketInstances'],
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async markPaid(orderId) {
        const order = await this.findById(orderId);
        order.status = order_entity_1.OrderStatus.PAID;
        order.paidAt = new Date();
        const tickets = await this.ticketInstancesRepository.find({
            where: { order: { id: order.id } },
        });
        tickets.forEach((ticket) => {
            ticket.status = ticket_instance_entity_1.TicketInstanceStatus.ISSUED;
            ticket.reservedUntil = null;
        });
        await this.ticketInstancesRepository.save(tickets);
        return this.ordersRepository.save(order);
    }
    async expirePendingOrders() {
        const now = new Date();
        const orders = await this.ordersRepository.find({
            where: { status: order_entity_1.OrderStatus.PENDING },
            relations: ['ticketInstances'],
        });
        const expiredOrders = orders.filter((order) => {
            var _a;
            return (_a = order.ticketInstances) === null || _a === void 0 ? void 0 : _a.some((ticket) => ticket.reservedUntil && ticket.reservedUntil.getTime() < now.getTime());
        });
        for (const order of expiredOrders) {
            order.status = order_entity_1.OrderStatus.EXPIRED;
            await this.ordersRepository.save(order);
            const tickets = await this.ticketInstancesRepository.find({
                where: { order: { id: order.id } },
            });
            tickets.forEach((ticket) => {
                ticket.status = ticket_instance_entity_1.TicketInstanceStatus.AVAILABLE;
                ticket.order = null;
                ticket.reservedUntil = null;
            });
            await this.ticketInstancesRepository.save(tickets);
        }
        return expiredOrders.length;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_line_entity_1.OrderLine)),
    __param(2, (0, typeorm_1.InjectRepository)(ticket_type_entity_1.TicketType)),
    __param(3, (0, typeorm_1.InjectRepository)(ticket_instance_entity_1.TicketInstance)),
    __param(4, (0, typeorm_1.InjectRepository)(organizer_entity_1.Organizer)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        tickets_service_1.TicketsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map