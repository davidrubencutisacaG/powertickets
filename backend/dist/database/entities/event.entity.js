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
exports.Event = exports.EventStatus = exports.EventCategory = void 0;
const typeorm_1 = require("typeorm");
const organizer_entity_1 = require("./organizer.entity");
const ticket_type_entity_1 = require("./ticket-type.entity");
const ticket_instance_entity_1 = require("./ticket-instance.entity");
const report_entity_1 = require("./report.entity");
var EventCategory;
(function (EventCategory) {
    EventCategory["CONCERT"] = "Concert";
    EventCategory["PARTY"] = "Party";
    EventCategory["THEATRE"] = "Theatre";
    EventCategory["TALK"] = "Talk";
})(EventCategory || (exports.EventCategory = EventCategory = {}));
var EventStatus;
(function (EventStatus) {
    EventStatus["SCHEDULED"] = "Scheduled";
    EventStatus["ONGOING"] = "Ongoing";
    EventStatus["FINISHED"] = "Finished";
})(EventStatus || (exports.EventStatus = EventStatus = {}));
let Event = class Event {
};
exports.Event = Event;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Event.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organizer_entity_1.Organizer, (organizer) => organizer.events, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'organizer_id' }),
    __metadata("design:type", organizer_entity_1.Organizer)
], Event.prototype, "organizer", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Event.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Event.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EventCategory }),
    __metadata("design:type", String)
], Event.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Event.prototype, "startsAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Event.prototype, "endsAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Event.prototype, "venue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Event.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EventStatus, default: EventStatus.SCHEDULED }),
    __metadata("design:type", String)
], Event.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Event.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Event.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ticket_type_entity_1.TicketType, (ticketType) => ticketType.event),
    __metadata("design:type", Array)
], Event.prototype, "ticketTypes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ticket_instance_entity_1.TicketInstance, (instance) => instance.event),
    __metadata("design:type", Array)
], Event.prototype, "ticketInstances", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => report_entity_1.Report, (report) => report.event),
    __metadata("design:type", Array)
], Event.prototype, "reports", void 0);
exports.Event = Event = __decorate([
    (0, typeorm_1.Entity)({ name: 'events' })
], Event);
//# sourceMappingURL=event.entity.js.map