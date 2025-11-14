import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventStatus } from '../database/entities/event.entity';
import { Organizer, OrganizerStatus } from '../database/entities/organizer.entity';
import { TicketType, TicketTypeStatus } from '../database/entities/ticket-type.entity';
import { TicketInstance, TicketInstanceStatus } from '../database/entities/ticket-instance.entity';
import { User } from '../database/entities/user.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    @InjectRepository(Organizer)
    private readonly organizersRepository: Repository<Organizer>,
    @InjectRepository(TicketType)
    private readonly ticketTypesRepository: Repository<TicketType>,
    @InjectRepository(TicketInstance)
    private readonly ticketInstancesRepository: Repository<TicketInstance>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Encuentra o crea un Organizer para un User dado
   */
  async findOrCreateOrganizerForUser(userId: string): Promise<Organizer> {
    // Buscar si ya existe un Organizer para este usuario
    let organizer = await this.organizersRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!organizer) {
      // Si no existe, crear uno nuevo
      const user = await this.usersRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      organizer = this.organizersRepository.create({
        user,
        status: OrganizerStatus.PENDING,
      });
      organizer = await this.organizersRepository.save(organizer);
    }

    return organizer;
  }

  async create(dto: CreateEventDto, userId?: string) {
    let organizer: Organizer | null = null;

    // Si se proporciona userId, usar el usuario actual (para compatibilidad con el frontend)
    if (userId) {
      organizer = await this.findOrCreateOrganizerForUser(userId);
    } else if (dto.organizerId) {
      // Si se proporciona organizerId en el DTO, usarlo (para compatibilidad hacia atrás)
      organizer = await this.organizersRepository.findOne({ where: { id: dto.organizerId } });
      if (!organizer) {
        throw new NotFoundException('Organizer not found');
      }
    } else {
      throw new BadRequestException('Either userId or organizerId must be provided');
    }

    // En este punto, organizer está garantizado que no es null
    // (ya sea por findOrCreateOrganizerForUser que siempre retorna Organizer,
    //  o por la validación anterior que lanza excepción si es null)
    const finalOrganizer: Organizer = organizer;

    const event = this.eventsRepository.create({
      organizer: finalOrganizer,
      name: dto.name,
      description: dto.description,
      category: dto.category,
      startsAt: new Date(dto.startsAt),
      endsAt: new Date(dto.endsAt),
      venue: dto.venue,
      capacity: dto.capacity,
      status: dto.status ?? EventStatus.SCHEDULED,
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
        status: ticket.status ?? TicketTypeStatus.ACTIVE,
      });
      const savedTicketType = await this.ticketTypesRepository.save(ticketType);

      const instances: TicketInstance[] = [];
      for (let i = 0; i < ticket.quota; i += 1) {
        const serial = `${savedEvent.id}-${savedTicketType.id}-${i + 1}`;
        instances.push(
          this.ticketInstancesRepository.create({
            ticketType: savedTicketType,
            event: savedEvent,
            serial,
            qrCode: randomUUID(),
            status: TicketInstanceStatus.AVAILABLE,
          }),
        );
      }
      await this.ticketInstancesRepository.save(instances);
    }

    return this.eventsRepository.findOne({ where: { id: savedEvent.id }, relations: ['ticketTypes'] });
  }

  findAll() {
    return this.eventsRepository.find({ relations: ['ticketTypes'] });
  }

  async update(id: string, dto: UpdateEventDto) {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
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

  async findById(id: string) {
    const event = await this.eventsRepository.findOne({ where: { id }, relations: ['ticketTypes'] });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async findByOrganizerUserId(userId: string) {
    // Buscar el Organizer del usuario
    const organizer = await this.organizersRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!organizer) {
      // Si no existe Organizer, retornar array vacío
      return [];
    }

    // Retornar todos los eventos del organizador
    return this.eventsRepository.find({
      where: { organizer: { id: organizer.id } },
      relations: ['ticketTypes', 'organizer'],
      order: { createdAt: 'DESC' },
    });
  }
}
