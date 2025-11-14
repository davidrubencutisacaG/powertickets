import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrganizerRequestsService } from './organizer-requests.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User, UserRole } from '../database/entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateOrganizerRequestDto } from './dto/create-organizer-request.dto';
import { OrganizerRequestStatus } from '../database/entities/organizer-request.entity';

@ApiTags('organizer-requests')
@ApiBearerAuth()
@Controller('organizers/requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrganizerRequestsController {
  constructor(
    private readonly organizerRequestsService: OrganizerRequestsService,
  ) {}

  @Post()
  @Roles(UserRole.BUYER)
  create(
    @CurrentUser() user: User,
    @Body() dto: CreateOrganizerRequestDto,
  ) {
    return this.organizerRequestsService.create(user.id, dto);
  }

  @Get('mine')
  getMyRequest(@CurrentUser() user: User) {
    return this.organizerRequestsService.findMyRequest(user.id);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll(@Query('status') status?: OrganizerRequestStatus) {
    return this.organizerRequestsService.findAll(status);
  }

  @Post(':id/approve')
  @Roles(UserRole.ADMIN)
  approve(@Param('id') id: string) {
    return this.organizerRequestsService.approve(id);
  }

  @Post(':id/reject')
  @Roles(UserRole.ADMIN)
  reject(@Param('id') id: string) {
    return this.organizerRequestsService.reject(id);
  }
}

