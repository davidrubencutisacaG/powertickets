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
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_entity_1 = require("../database/entities/event.entity");
const organizer_entity_1 = require("../database/entities/organizer.entity");
const ticket_type_entity_1 = require("../database/entities/ticket-type.entity");
const ticket_instance_entity_1 = require("../database/entities/ticket-instance.entity");
const user_entity_1 = require("../database/entities/user.entity");
const crypto_1 = require("crypto");
let EventsService = class EventsService {
    constructor(eventsRepository, organizersRepository, ticketTypesRepository, ticketInstancesRepository, usersRepository) {
        this.eventsRepository = eventsRepository;
        this.organizersRepository = organizersRepository;
        this.ticketTypesRepository = ticketTypesRepository;
        this.ticketInstancesRepository = ticketInstancesRepository;
        this.usersRepository = usersRepository;
    }
    async findOrCreateOrganizerForUser(userId) {
        let organizer = await this.organizersRepository.findOne({
            where: { user: { id: userId } },
            relations: ['user'],
        });
        if (!organizer) {
            const user = await this.usersRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            organizer = this.organizersRepository.create({
                user,
                status: organizer_entity_1.OrganizerStatus.PENDING,
            });
            organizer = await this.organizersRepository.save(organizer);
        }
        return organizer;
    }
    async create(dto, userId) {
        var _a, _b;
        let organizer = null;
        if (userId) {
            organizer = await this.findOrCreateOrganizerForUser(userId);
        }
        else if (dto.organizerId) {
            organizer = await this.organizersRepository.findOne({ where: { id: dto.organizerId } });
            if (!organizer) {
                throw new common_1.NotFoundException('Organizer not found');
            }
        }
        else {
            throw new common_1.BadRequestException('Either userId or organizerId must be provided');
        }
        const finalOrganizer = organizer;
        const event = this.eventsRepository.create({
            organizer: finalOrganizer,
            name: dto.name,
            description: dto.description,
            category: dto.category,
            startsAt: new Date(dto.startsAt),
            endsAt: new Date(dto.endsAt),
            venue: dto.venue,
            capacity: dto.capacity,
            status: (_a = dto.status) !== null && _a !== void 0 ? _a : event_entity_1.EventStatus.SCHEDULED,
        });
        const savedEvent = await this.eventsRepository.save(event);
        for (const ticket of dto.ticketTypes) {
            const ticketType = this.ticketTypesRepository.create({
                event: savedEvent,
                name: ticket.name,
                price: ticket.price,
                currency: ticket.currency,
                quota: ticket.quota,
                maxPerOrder: ticket.maxPerOrder,
                saleStart: new Date(ticket.saleStart),
                saleEnd: new Date(ticket.saleEnd),
                status: (_b = ticket.status) !== null && _b !== void 0 ? _b : ticket_type_entity_1.TicketTypeStatus.ACTIVE,
            });
            const savedTicketType = await this.ticketTypesRepository.save(ticketType);
            const instances = [];
            for (let i = 0; i < ticket.quota; i += 1) {
                const serial = `${savedEvent.id}-${savedTicketType.id}-${i + 1}`;
                instances.push(this.ticketInstancesRepository.create({
                    ticketType: savedTicketType,
                    event: savedEvent,
                    serial,
                    qrCode: (0, crypto_1.randomUUID)(),
                    status: ticket_instance_entity_1.TicketInstanceStatus.AVAILABLE,
                }));
            }
            await this.ticketInstancesRepository.save(instances);
        }
        return this.eventsRepository.findOne({ where: { id: savedEvent.id }, relations: ['ticketTypes'] });
    }
    findAll() {
        return this.eventsRepository.find({ relations: ['ticketTypes'] });
    }
    async update(id, dto) {
        const event = await this.eventsRepository.findOne({ where: { id } });
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        if (dto.name !== undefined) {
            event.name = dto.name;
        }
        if (dto.description !== undefined) {
            event.description = dto.description;
        }
        if (dto.category !== undefined) {
            event.category = dto.category;
        }
        if (dto.startsAt !== undefined) {
            event.startsAt = new Date(dto.startsAt);
        }
        if (dto.endsAt !== undefined) {
            event.endsAt = new Date(dto.endsAt);
        }
        if (dto.venue !== undefined) {
            event.venue = dto.venue;
        }
        if (dto.capacity !== undefined) {
            event.capacity = dto.capacity;
        }
        if (dto.status !== undefined) {
            event.status = dto.status;
        }
        return this.eventsRepository.save(event);
    }
    async findById(id) {
        const event = await this.eventsRepository.findOne({ where: { id }, relations: ['ticketTypes'] });
        if (!event) {
            throw new common_1.NotFoundException('Event not found');
        }
        return event;
    }
    async findByOrganizerUserId(userId) {
        const organizer = await this.organizersRepository.findOne({
            where: { user: { id: userId } },
        });
        if (!organizer) {
            return [];
        }
        return this.eventsRepository.find({
            where: { organizer: { id: organizer.id } },
            relations: ['ticketTypes', 'organizer'],
            order: { createdAt: 'DESC' },
        });
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(event_entity_1.Event)),
    __param(1, (0, typeorm_1.InjectRepository)(organizer_entity_1.Organizer)),
    __param(2, (0, typeorm_1.InjectRepository)(ticket_type_entity_1.TicketType)),
    __param(3, (0, typeorm_1.InjectRepository)(ticket_instance_entity_1.TicketInstance)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EventsService);
//# sourceMappingURL=events.service.js.map