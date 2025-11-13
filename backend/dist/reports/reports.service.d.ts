import { Repository } from 'typeorm';
import { Report } from '../database/entities/report.entity';
import { Order } from '../database/entities/order.entity';
import { Organizer } from '../database/entities/organizer.entity';
import { Event } from '../database/entities/event.entity';
import { ReportQueryDto } from './dto/report-query.dto';
import { ConfigService } from '@nestjs/config';
import { User } from '../database/entities/user.entity';
export declare class ReportsService {
    private readonly reportsRepository;
    private readonly ordersRepository;
    private readonly organizersRepository;
    private readonly eventsRepository;
    private readonly configService;
    constructor(reportsRepository: Repository<Report>, ordersRepository: Repository<Order>, organizersRepository: Repository<Organizer>, eventsRepository: Repository<Event>, configService: ConfigService);
    getSalesSummary(organizerUser: User, query: ReportQueryDto): Promise<{
        organizerId: string;
        totalRevenue: number;
        totalTickets: number;
        perEvent: {
            eventName: string;
            tickets: number;
            revenue: number;
        }[];
    }>;
    generateReport(organizerUser: User, query: ReportQueryDto): Promise<Report>;
    private writePdf;
    private writeCsv;
}
