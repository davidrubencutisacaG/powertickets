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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketInstance = exports.TicketInstanceStatus = void 0;
const typeorm_1 = require("typeorm");
const ticket_type_entity_1 = require("./ticket-type.entity");
const event_entity_1 = require("./event.entity");
const order_entity_1 = require("./order.entity");
var TicketInstanceStatus;
(function (TicketInstanceStatus) {
    TicketInstanceStatus["AVAILABLE"] = "Available";
    TicketInstanceStatus["RESERVED"] = "Reserved";
    TicketInstanceStatus["ISSUED"] = "Issued";
    TicketInstanceStatus["USED"] = "Used";
    TicketInstanceStatus["CANCELLED"] = "Cancelled";
})(TicketInstanceStatus || (exports.TicketInstanceStatus = TicketInstanceStatus = {}));
let TicketInstance = class TicketInstance {
};
exports.TicketInstance = TicketInstance;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TicketInstance.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ticket_type_entity_1.TicketType, (ticketType) => ticketType.ticketInstances, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'ticket_type_id' }),
    __metadata("design:type", ticket_type_entity_1.TicketType)
], TicketInstance.prototype, "ticketType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => event_entity_1.Event, (event) => event.ticketInstances),
    (0, typeorm_1.JoinColumn)({ name: 'event_id' }),
    __metadata("design:type", event_entity_1.Event)
], TicketInstance.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TicketInstance.prototype, "serial", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], TicketInstance.prototype, "qrCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TicketInstanceStatus, default: TicketInstanceStatus.AVAILABLE }),
    __metadata("design:type", String)
], TicketInstance.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], TicketInstance.prototype, "reservedUntil", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_entity_1.Order, (order) => order.ticketInstances, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", Object)
], TicketInstance.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], TicketInstance.prototype, "usedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TicketInstance.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TicketInstance.prototype, "updatedAt", void 0);
exports.TicketInstance = TicketInstance = __decorate([
    (0, typeorm_1.Entity)({ name: 'ticket_instances' })
], TicketInstance);
//# sourceMappingURL=ticket-instance.entity.js.map