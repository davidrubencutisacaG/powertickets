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
exports.OrganizerRequestsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const organizer_request_entity_1 = require("../database/entities/organizer-request.entity");
const user_entity_1 = require("../database/entities/user.entity");
let OrganizerRequestsService = class OrganizerRequestsService {
    constructor(organizerRequestsRepository, usersRepository) {
        this.organizerRequestsRepository = organizerRequestsRepository;
        this.usersRepository = usersRepository;
    }
    async create(userId, dto) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.role !== user_entity_1.UserRole.BUYER) {
            throw new common_1.BadRequestException('Only buyers can create organizer requests. You are already an organizer or admin.');
        }
        const existingPendingRequest = await this.organizerRequestsRepository.findOne({
            where: {
                user: { id: userId },
                status: organizer_request_entity_1.OrganizerRequestStatus.PENDING,
            },
        });
        if (existingPendingRequest) {
            throw new common_1.BadRequestException('You already have a pending organizer request. Please wait for it to be reviewed.');
        }
        const request = this.organizerRequestsRepository.create(Object.assign(Object.assign({}, dto), { user: { id: userId }, status: organizer_request_entity_1.OrganizerRequestStatus.PENDING }));
        return this.organizerRequestsRepository.save(request);
    }
    async findMyRequest(userId) {
        return this.organizerRequestsRepository.findOne({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
            relations: ['user'],
        });
    }
    async findAll(status) {
        const where = status ? { status } : {};
        return this.organizerRequestsRepository.find({
            where,
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }
    async findById(id) {
        const request = await this.organizerRequestsRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!request) {
            throw new common_1.NotFoundException('Organizer request not found');
        }
        return request;
    }
    async approve(id) {
        const request = await this.findById(id);
        if (request.status !== organizer_request_entity_1.OrganizerRequestStatus.PENDING) {
            throw new common_1.BadRequestException(`Cannot approve request with status ${request.status}. Only pending requests can be approved.`);
        }
        request.status = organizer_request_entity_1.OrganizerRequestStatus.APPROVED;
        await this.organizerRequestsRepository.save(request);
        const user = await this.usersRepository.findOne({
            where: { id: request.user.id },
        });
        if (!user) {
            throw new common_1.NotFoundException('User associated with request not found');
        }
        user.role = user_entity_1.UserRole.ORGANIZER;
        await this.usersRepository.save(user);
        return request;
    }
    async reject(id) {
        const request = await this.findById(id);
        if (request.status !== organizer_request_entity_1.OrganizerRequestStatus.PENDING) {
            throw new common_1.BadRequestException(`Cannot reject request with status ${request.status}. Only pending requests can be rejected.`);
        }
        request.status = organizer_request_entity_1.OrganizerRequestStatus.REJECTED;
        await this.organizerRequestsRepository.save(request);
        return request;
    }
};
exports.OrganizerRequestsService = OrganizerRequestsService;
exports.OrganizerRequestsService = OrganizerRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(organizer_request_entity_1.OrganizerRequest)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], OrganizerRequestsService);
//# sourceMappingURL=organizer-requests.service.js.map