import { ReportFormat } from '../../database/entities/report.entity';
export declare class ReportQueryDto {
    fromDate?: string;
    toDate?: string;
    eventId?: string;
    format?: ReportFormat;
}
