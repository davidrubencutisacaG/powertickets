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
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ticket_instance_entity_1 = require("../database/entities/ticket-instance.entity");
let TicketsService = class TicketsService {
    constructor(ticketsRepository) {
        this.ticketsRepository = ticketsRepository;
    }
    async reserveTickets(ticketTypeId, quantity, orderId, expiresAt) {
        const tickets = await this.ticketsRepository.find({
            where: {
                ticketType: { id: ticketTypeId },
                status: ticket_instance_entity_1.TicketInstanceStatus.AVAILABLE,
            },
            take: quantity,
            order: { createdAt: 'ASC' },
        });
        if (tickets.length < quantity) {
            throw new common_1.BadRequestException('Not enough tickets available');
        }
        tickets.forEach((ticket) => {
            ticket.status = ticket_instance_entity_1.TicketInstanceStatus.RESERVED;
            ticket.order = { id: orderId };
            ticket.reservedUntil = expiresAt;
        });
        await this.ticketsRepository.save(tickets);
        return tickets;
    }
    async releaseExpiredReservations(now = new Date()) {
        const toRelease = await this.ticketsRepository.find({
            where: {
                status: ticket_instance_entity_1.TicketInstanceStatus.RESERVED,
                reservedUntil: (0, typeorm_2.LessThan)(now),
            },
        });
        if (toRelease.length === 0) {
            return 0;
        }
        toRelease.forEach((ticket) => {
            ticket.status = ticket_instance_entity_1.TicketInstanceStatus.AVAILABLE;
            ticket.order = null;
            ticket.reservedUntil = null;
        });
        await this.ticketsRepository.save(toRelease);
        return toRelease.length;
    }
    async markAsUsed(qrCode) {
        const ticket = await this.ticketsRepository.findOne({ where: { qrCode } });
        if (!ticket) {
            throw new common_1.NotFoundException('Ticket not found');
        }
        if (ticket.status !== ticket_instance_entity_1.TicketInstanceStatus.ISSUED) {
            throw new common_1.BadRequestException('Ticket not issued');
        }
        ticket.status = ticket_instance_entity_1.TicketInstanceStatus.USED;
        ticket.usedAt = new Date();
        return this.ticketsRepository.save(ticket);
    }
    async validateQr(qrCode) {
        const ticket = await this.ticketsRepository.findOne({ where: { qrCode } });
        if (!ticket) {
            throw new common_1.NotFoundException('Ticket not found');
        }
        if (ticket.status === ticket_instance_entity_1.TicketInstanceStatus.USED) {
            throw new common_1.BadRequestException('Ticket already used');
        }
        if (ticket.status !== ticket_instance_entity_1.TicketInstanceStatus.ISSUED) {
            throw new common_1.BadRequestException('Ticket not ready for validation');
        }
        ticket.status = ticket_instance_entity_1.TicketInstanceStatus.USED;
        ticket.usedAt = new Date();
        return this.ticketsRepository.save(ticket);
    }
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ticket_instance_entity_1.TicketInstance)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map