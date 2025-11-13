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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../database/entities/user.entity");
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    findByEmail(email) {
        return this.usersRepository.findOne({ where: { email } });
    }
    findById(id) {
        return this.usersRepository.findOne({ where: { id } });
    }
    async update(id, payload) {
        const user = await this.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        Object.assign(user, payload);
        return this.usersRepository.save(user);
    }
    async list() {
        return this.usersRepository.find();
    }
    async findPendingOrganizers() {
        return this.usersRepository.find({
            where: {
                role: user_entity_1.UserRole.ORGANIZER,
                organizerStatus: user_entity_1.OrganizerStatus.PENDING,
            },
        });
    }
    async updateOrganizerStatus(id, status) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.role !== user_entity_1.UserRole.ORGANIZER) {
            throw new common_1.BadRequestException('User is not an organizer');
        }
        if (user.organizerStatus === status) {
            throw new common_1.BadRequestException(`Organizer status is already ${status}`);
        }
        if (!Object.values(user_entity_1.OrganizerStatus).includes(status)) {
            throw new common_1.BadRequestException(`Invalid organizer status: ${status}`);
        }
        user.organizerStatus = status;
        return this.usersRepository.save(user);
    }
    async approveOrganizer(id) {
        const user = await this.usersRepository.findOne({
            where: { id, role: user_entity_1.UserRole.ORGANIZER },
        });
        if (!user) {
            throw new common_1.NotFoundException('Organizer not found');
        }
        user.organizerStatus = user_entity_1.OrganizerStatus.APPROVED;
        return this.usersRepository.save(user);
    }
    async rejectOrganizer(id) {
        const user = await this.usersRepository.findOne({
            where: { id, role: user_entity_1.UserRole.ORGANIZER },
        });
        if (!user) {
            throw new common_1.NotFoundException('Organizer not found');
        }
        user.organizerStatus = user_entity_1.OrganizerStatus.REJECTED;
        return this.usersRepository.save(user);
    }
    async upgradeBuyerToOrganizer(userId, dto) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.role !== user_entity_1.UserRole.BUYER) {
            throw new common_1.BadRequestException('User is not a buyer. Only buyers can upgrade to organizer.');
        }
        if (dto.phone !== undefined) {
            user.phone = dto.phone;
        }
        if (dto.dni !== undefined) {
            user.dni = dto.dni;
        }
        if (dto.selfieUrl !== undefined) {
            user.selfieUrl = dto.selfieUrl;
        }
        user.role = user_entity_1.UserRole.ORGANIZER;
        user.organizerStatus = user_entity_1.OrganizerStatus.PENDING;
        return this.usersRepository.save(user);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map