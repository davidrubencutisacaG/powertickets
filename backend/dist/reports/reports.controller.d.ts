import { ReportsService } from './reports.service';
import { ReportQueryDto } from './dto/report-query.dto';
import { User } from '../database/entities/user.entity';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    summary(user: User, query: ReportQueryDto): Promise<{
        organizerId: string;
        totalRevenue: number;
        totalTickets: number;
        perEvent: {
            eventName: string;
            tickets: number;
            revenue: number;
        }[];
    }>;
    download(user: User, query: ReportQueryDto): Promise<import("../database/entities/report.entity").Report>;
}
