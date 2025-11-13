"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const order_entity_1 = require("../database/entities/order.entity");
const order_line_entity_1 = require("../database/entities/order-line.entity");
const orders_service_1 = require("./orders.service");
const orders_controller_1 = require("./orders.controller");
const tickets_module_1 = require("../tickets/tickets.module");
const ticket_type_entity_1 = require("../database/entities/ticket-type.entity");
const ticket_instance_entity_1 = require("../database/entities/ticket-instance.entity");
const organizer_entity_1 = require("../database/entities/organizer.entity");
const payment_method_entity_1 = require("../database/entities/payment-method.entity");
const schedule_1 = require("@nestjs/schedule");
const orders_scheduler_1 = require("./orders.scheduler");
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([order_entity_1.Order, order_line_entity_1.OrderLine, ticket_type_entity_1.TicketType, ticket_instance_entity_1.TicketInstance, organizer_entity_1.Organizer, payment_method_entity_1.PaymentMethod]),
            tickets_module_1.TicketsModule,
            schedule_1.ScheduleModule,
        ],
        providers: [orders_service_1.OrdersService, orders_scheduler_1.OrdersScheduler],
        controllers: [orders_controller_1.OrdersController],
        exports: [orders_service_1.OrdersService],
    })
], OrdersModule);
//# sourceMappingURL=orders.module.js.map