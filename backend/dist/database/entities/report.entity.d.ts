import { Organizer } from './organizer.entity';
import { Event } from './event.entity';
export declare enum ReportFormat {
    CSV = "CSV",
    PDF = "PDF"
}
export declare class Report {
    id: string;
    organization: Organizer;
    event?: Event | null;
    generatedAt: Date;
    format: ReportFormat;
    fileUrl: string;
    fromDate?: string | null;
    toDate?: string | null;
    updatedAt: Date;
}
