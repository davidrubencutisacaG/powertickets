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
exports.Organizer = exports.OrganizerStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const event_entity_1 = require("./event.entity");
const payment_method_entity_1 = require("./payment-method.entity");
const order_entity_1 = require("./order.entity");
const report_entity_1 = require("./report.entity");
var OrganizerStatus;
(function (OrganizerStatus) {
    OrganizerStatus["PENDING"] = "Pending";
    OrganizerStatus["APPROVED"] = "Approved";
    OrganizerStatus["REJECTED"] = "Rejected";
})(OrganizerStatus || (exports.OrganizerStatus = OrganizerStatus = {}));
let Organizer = class Organizer {
};
exports.Organizer = Organizer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Organizer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.organizers, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Organizer.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Organizer.prototype, "photoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: OrganizerStatus, default: OrganizerStatus.PENDING }),
    __metadata("design:type", String)
], Organizer.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Organizer.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Organizer.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => event_entity_1.Event, (event) => event.organizer),
    __metadata("design:type", Array)
], Organizer.prototype, "events", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_method_entity_1.PaymentMethod, (method) => method.organization),
    __metadata("design:type", Array)
], Organizer.prototype, "paymentMethods", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.Order, (order) => order.organization),
    __metadata("design:type", Array)
], Organizer.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => report_entity_1.Report, (report) => report.organization),
    __metadata("design:type", Array)
], Organizer.prototype, "reports", void 0);
exports.Organizer = Organizer = __decorate([
    (0, typeorm_1.Entity)({ name: 'organizers' })
], Organizer);
//# sourceMappingURL=organizer.entity.js.map