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
exports.Report = exports.ReportFormat = void 0;
const typeorm_1 = require("typeorm");
const organizer_entity_1 = require("./organizer.entity");
const event_entity_1 = require("./event.entity");
var ReportFormat;
(function (ReportFormat) {
    ReportFormat["CSV"] = "CSV";
    ReportFormat["PDF"] = "PDF";
})(ReportFormat || (exports.ReportFormat = ReportFormat = {}));
let Report = class Report {
};
exports.Report = Report;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Report.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizer_entity_1.Organizer, (organizer) => organizer.reports, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'organization_id' }),
    __metadata("design:type", organizer_entity_1.Organizer)
], Report.prototype, "organization", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => event_entity_1.Event, (event) => event.reports, { nullable: true, eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'event_id' }),
    __metadata("design:type", Object)
], Report.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Report.prototype, "generatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ReportFormat }),
    __metadata("design:type", String)
], Report.prototype, "format", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Report.prototype, "fileUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Report.prototype, "fromDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Report.prototype, "toDate", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Report.prototype, "updatedAt", void 0);
exports.Report = Report = __decorate([
    (0, typeorm_1.Entity)({ name: 'reports' })
], Report);
//# sourceMappingURL=report.entity.js.map