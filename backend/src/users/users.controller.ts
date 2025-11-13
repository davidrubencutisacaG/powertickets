import { Body, Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User, UserRole } from '../database/entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpgradeToOrganizerDto } from './dto/upgrade-to-organizer.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  list() {
    return this.usersService.list();
  }

  @Get('organizers/pending')
  @Roles(UserRole.ADMIN)
  getPendingOrganizers() {
    return this.usersService.findPendingOrganizers();
  }

  @Patch('organizers/:id/approve')
  @Roles(UserRole.ADMIN)
  approveOrganizer(@Param('id') id: string) {
    return this.usersService.approveOrganizer(id);
  }

  @Patch('organizers/:id/reject')
  @Roles(UserRole.ADMIN)
  rejectOrganizer(@Param('id') id: string) {
    return this.usersService.rejectOrganizer(id);
  }

  @Patch('me/upgrade-to-organizer')
  @Roles(UserRole.BUYER)
  upgradeToOrganizer(@CurrentUser() user: User, @Body() dto: UpgradeToOrganizerDto) {
    return this.usersService.upgradeBuyerToOrganizer(user.id, dto);
  }
}
