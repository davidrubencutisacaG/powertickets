import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  OrganizerRequest,
  OrganizerRequestStatus,
} from '../database/entities/organizer-request.entity';
import { User, UserRole } from '../database/entities/user.entity';
import { CreateOrganizerRequestDto } from './dto/create-organizer-request.dto';

@Injectable()
export class OrganizerRequestsService {
  constructor(
    @InjectRepository(OrganizerRequest)
    private readonly organizerRequestsRepository: Repository<OrganizerRequest>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(userId: string, dto: CreateOrganizerRequestDto): Promise<OrganizerRequest> {
    // Verificar que el usuario existe y es BUYER
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== UserRole.BUYER) {
      throw new BadRequestException(
        'Only buyers can create organizer requests. You are already an organizer or admin.',
      );
    }

    // Verificar si ya tiene una solicitud pendiente
    const existingPendingRequest = await this.organizerRequestsRepository.findOne({
      where: {
        user: { id: userId },
        status: OrganizerRequestStatus.PENDING,
      },
    });

    if (existingPendingRequest) {
      throw new BadRequestException(
        'You already have a pending organizer request. Please wait for it to be reviewed.',
      );
    }

    // Crear la solicitud
    const request = this.organizerRequestsRepository.create({
      ...dto,
      user: { id: userId } as User,
      status: OrganizerRequestStatus.PENDING,
    });

    return this.organizerRequestsRepository.save(request);
  }

  async findMyRequest(userId: string): Promise<OrganizerRequest | null> {
    return this.organizerRequestsRepository.findOne({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  async findAll(status?: OrganizerRequestStatus): Promise<OrganizerRequest[]> {
    const where = status ? { status } : {};
    return this.organizerRequestsRepository.find({
      where,
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<OrganizerRequest> {
    const request = await this.organizerRequestsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!request) {
      throw new NotFoundException('Organizer request not found');
    }

    return request;
  }

  async approve(id: string): Promise<OrganizerRequest> {
    const request = await this.findById(id);

    if (request.status !== OrganizerRequestStatus.PENDING) {
      throw new BadRequestException(
        `Cannot approve request with status ${request.status}. Only pending requests can be approved.`,
      );
    }

    // Actualizar el estado de la solicitud
    request.status = OrganizerRequestStatus.APPROVED;
    await this.organizerRequestsRepository.save(request);

    // Cambiar el rol del usuario a ORGANIZER
    const user = await this.usersRepository.findOne({
      where: { id: request.user.id },
    });

    if (!user) {
      throw new NotFoundException('User associated with request not found');
    }

    user.role = UserRole.ORGANIZER;
    await this.usersRepository.save(user);

    return request;
  }

  async reject(id: string): Promise<OrganizerRequest> {
    const request = await this.findById(id);

    if (request.status !== OrganizerRequestStatus.PENDING) {
      throw new BadRequestException(
        `Cannot reject request with status ${request.status}. Only pending requests can be rejected.`,
      );
    }

    // Actualizar el estado de la solicitud
    request.status = OrganizerRequestStatus.REJECTED;
    await this.organizerRequestsRepository.save(request);

    // El usuario mantiene su rol actual (BUYER)
    return request;
  }
}

