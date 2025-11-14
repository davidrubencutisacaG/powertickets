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
exports.OrganizerRequest = exports.OrganizerRequestStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
var OrganizerRequestStatus;
(function (OrganizerRequestStatus) {
    OrganizerRequestStatus["PENDING"] = "Pending";
    OrganizerRequestStatus["APPROVED"] = "Approved";
    OrganizerRequestStatus["REJECTED"] = "Rejected";
})(OrganizerRequestStatus || (exports.OrganizerRequestStatus = OrganizerRequestStatus = {}));
let OrganizerRequest = class OrganizerRequest {
};
exports.OrganizerRequest = OrganizerRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], OrganizerRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], OrganizerRequest.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OrganizerRequest.prototype, "organizationName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], OrganizerRequest.prototype, "ruc", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], OrganizerRequest.prototype, "document", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], OrganizerRequest.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], OrganizerRequest.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], OrganizerRequest.prototype, "website", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], OrganizerRequest.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: OrganizerRequestStatus, default: OrganizerRequestStatus.PENDING }),
    __metadata("design:type", String)
], OrganizerRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], OrganizerRequest.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], OrganizerRequest.prototype, "updatedAt", void 0);
exports.OrganizerRequest = OrganizerRequest = __decorate([
    (0, typeorm_1.Entity)({ name: 'organizer_requests' })
], OrganizerRequest);
//# sourceMappingURL=organizer-request.entity.js.map