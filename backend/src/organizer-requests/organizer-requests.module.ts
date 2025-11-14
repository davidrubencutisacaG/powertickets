import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizerRequest } from '../database/entities/organizer-request.entity';
import { User } from '../database/entities/user.entity';
import { OrganizerRequestsService } from './organizer-requests.service';
import { OrganizerRequestsController } from './organizer-requests.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizerRequest, User])],
  providers: [OrganizerRequestsService],
  controllers: [OrganizerRequestsController],
  exports: [OrganizerRequestsService],
})
export class OrganizerRequestsModule {}

