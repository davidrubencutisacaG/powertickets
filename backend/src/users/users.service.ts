import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, OrganizerStatus } from '../database/entities/user.entity';
import { UpgradeToOrganizerDto } from './dto/upgrade-to-organizer.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  findById(id: string) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async update(id: string, payload: Partial<User>) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
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
        role: UserRole.ORGANIZER,
        organizerStatus: OrganizerStatus.PENDING,
      },
    });
  }

  async updateOrganizerStatus(id: string, status: OrganizerStatus) {
    // Validar que el usuario exista
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validar que el usuario tenga rol ORGANIZER
    if (user.role !== UserRole.ORGANIZER) {
      throw new BadRequestException('User is not an organizer');
    }

    // Validar que el nuevo status sea diferente al actual
    if (user.organizerStatus === status) {
      throw new BadRequestException(`Organizer status is already ${status}`);
    }

    // Validar que el status sea válido (enum)
    if (!Object.values(OrganizerStatus).includes(status)) {
      throw new BadRequestException(`Invalid organizer status: ${status}`);
    }

    // Actualizar el organizerStatus
    user.organizerStatus = status;
    return this.usersRepository.save(user);
  }

  async approveOrganizer(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id, role: UserRole.ORGANIZER },
    });
    if (!user) {
      throw new NotFoundException('Organizer not found');
    }
    user.organizerStatus = OrganizerStatus.APPROVED;
    return this.usersRepository.save(user);
  }

  async rejectOrganizer(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id, role: UserRole.ORGANIZER },
    });
    if (!user) {
      throw new NotFoundException('Organizer not found');
    }
    user.organizerStatus = OrganizerStatus.REJECTED;
    return this.usersRepository.save(user);
  }

  async upgradeBuyerToOrganizer(userId: string, dto: UpgradeToOrganizerDto) {
    // Buscar al usuario por id
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validar que existe y que actualmente tiene role === UserRole.BUYER
    if (user.role !== UserRole.BUYER) {
      throw new BadRequestException('User is not a buyer. Only buyers can upgrade to organizer.');
    }

    // Actualizar campos opcionales si se proporcionan
    if (dto.phone !== undefined) {
      user.phone = dto.phone;
    }
    if (dto.dni !== undefined) {
      user.dni = dto.dni;
    }
    if (dto.selfieUrl !== undefined) {
      user.selfieUrl = dto.selfieUrl;
    }

    // Cambiar role a UserRole.ORGANIZER
    user.role = UserRole.ORGANIZER;

    // Poner organizerStatus = OrganizerStatus.PENDING
    user.organizerStatus = OrganizerStatus.PENDING;

    return this.usersRepository.save(user);
  }
}
