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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("../database/entities/payment.entity");
const payment_method_entity_1 = require("../database/entities/payment-method.entity");
const orders_service_1 = require("../orders/orders.service");
const order_entity_1 = require("../database/entities/order.entity");
let PaymentsService = class PaymentsService {
    constructor(paymentsRepository, paymentMethodsRepository, ordersRepository, ordersService) {
        this.paymentsRepository = paymentsRepository;
        this.paymentMethodsRepository = paymentMethodsRepository;
        this.ordersRepository = ordersRepository;
        this.ordersService = ordersService;
    }
    async create(dto) {
        var _a;
        const order = await this.ordersRepository.findOne({
            where: { id: dto.orderId },
            relations: ['organization'],
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const paymentMethod = await this.paymentMethodsRepository.findOne({
            where: { id: dto.paymentMethodId },
            relations: ['organization'],
        });
        if (!paymentMethod) {
            throw new common_1.NotFoundException('Payment method not found');
        }
        if (paymentMethod.organization.id !== order.organization.id) {
            throw new common_1.BadRequestException('Payment method does not belong to the organizer');
        }
        const payment = this.paymentsRepository.create({
            order,
            paymentMethod,
            amount: dto.amount,
            currency: dto.currency,
            status: (_a = dto.status) !== null && _a !== void 0 ? _a : payment_entity_1.PaymentStatus.CAPTURED,
            gatewayRef: `manual-${Date.now()}`,
            capturedAt: new Date(),
        });
        const savedPayment = await this.paymentsRepository.save(payment);
        if (savedPayment.status === payment_entity_1.PaymentStatus.CAPTURED) {
            await this.ordersService.markPaid(order.id);
        }
        return savedPayment;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(1, (0, typeorm_1.InjectRepository)(payment_method_entity_1.PaymentMethod)),
    __param(2, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        orders_service_1.OrdersService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map