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
exports.PaymentMethod = exports.PaymentProvider = void 0;
const typeorm_1 = require("typeorm");
const organizer_entity_1 = require("./organizer.entity");
const payment_entity_1 = require("./payment.entity");
var PaymentProvider;
(function (PaymentProvider) {
    PaymentProvider["CARD"] = "Card";
    PaymentProvider["YAPE"] = "Yape";
    PaymentProvider["PLIN"] = "Plin";
    PaymentProvider["TRANSFER"] = "Transfer";
    PaymentProvider["CASH"] = "Cash";
})(PaymentProvider || (exports.PaymentProvider = PaymentProvider = {}));
let PaymentMethod = class PaymentMethod {
};
exports.PaymentMethod = PaymentMethod;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PaymentMethod.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizer_entity_1.Organizer, (organizer) => organizer.paymentMethods, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'organization_id' }),
    __metadata("design:type", organizer_entity_1.Organizer)
], PaymentMethod.prototype, "organization", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PaymentProvider }),
    __metadata("design:type", String)
], PaymentMethod.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentMethod.prototype, "label", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PaymentMethod.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], PaymentMethod.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PaymentMethod.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], PaymentMethod.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_entity_1.Payment, (payment) => payment.paymentMethod),
    __metadata("design:type", Array)
], PaymentMethod.prototype, "payments", void 0);
exports.PaymentMethod = PaymentMethod = __decorate([
    (0, typeorm_1.Entity)({ name: 'payment_methods' })
], PaymentMethod);
//# sourceMappingURL=payment-method.entity.js.map