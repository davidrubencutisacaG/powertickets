import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User, UserRole } from '../database/entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER)
  @ApiBearerAuth()
  create(@CurrentUser() user: User, @Body() dto: CreateEventDto) {
    return this.eventsService.create(dto, user.id);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get('organizer/me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER)
  @ApiBearerAuth()
  getMyEvents(@CurrentUser() user: User) {
    return this.eventsService.findByOrganizerUserId(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(id, dto);
  }
}
