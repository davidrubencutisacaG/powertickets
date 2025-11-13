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
exports.TicketType = exports.TicketTypeStatus = void 0;
const typeorm_1 = require("typeorm");
const event_entity_1 = require("./event.entity");
const ticket_instance_entity_1 = require("./ticket-instance.entity");
const order_line_entity_1 = require("./order-line.entity");
var TicketTypeStatus;
(function (TicketTypeStatus) {
    TicketTypeStatus["ACTIVE"] = "Active";
    TicketTypeStatus["INACTIVE"] = "Inactive";
})(TicketTypeStatus || (exports.TicketTypeStatus = TicketTypeStatus = {}));
let TicketType = class TicketType {
};
exports.TicketType = TicketType;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TicketType.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => event_entity_1.Event, (event) => event.ticketTypes, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'event_id' }),
    __metadata("design:type", event_entity_1.Event)
], TicketType.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TicketType.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", String)
], TicketType.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TicketType.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], TicketType.prototype, "quota", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 10 }),
    __metadata("design:type", Number)
], TicketType.prototype, "maxPerOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], TicketType.prototype, "saleStart", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], TicketType.prototype, "saleEnd", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TicketTypeStatus, default: TicketTypeStatus.ACTIVE }),
    __metadata("design:type", String)
], TicketType.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TicketType.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TicketType.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ticket_instance_entity_1.TicketInstance, (instance) => instance.ticketType),
    __metadata("design:type", Array)
], TicketType.prototype, "ticketInstances", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_line_entity_1.OrderLine, (line) => line.ticketType),
    __metadata("design:type", Array)
], TicketType.prototype, "orderLines", void 0);
exports.TicketType = TicketType = __decorate([
    (0, typeorm_1.Entity)({ name: 'ticket_types' })
], TicketType);
//# sourceMappingURL=ticket-type.entity.js.map