"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const report_entity_1 = require("../database/entities/report.entity");
const order_entity_1 = require("../database/entities/order.entity");
const organizer_entity_1 = require("../database/entities/organizer.entity");
const event_entity_1 = require("../database/entities/event.entity");
const config_1 = require("@nestjs/config");
const fs_1 = require("fs");
const fs_2 = require("fs");
const path_1 = require("path");
const pdfkit_1 = require("pdfkit");
const csv_writer_1 = require("csv-writer");
let ReportsService = class ReportsService {
    constructor(reportsRepository, ordersRepository, organizersRepository, eventsRepository, configService) {
        this.reportsRepository = reportsRepository;
        this.ordersRepository = ordersRepository;
        this.organizersRepository = organizersRepository;
        this.eventsRepository = eventsRepository;
        this.configService = configService;
    }
    async getSalesSummary(organizerUser, query) {
        const organizer = await this.organizersRepository.findOne({
            where: { user: { id: organizerUser.id } },
        });
        if (!organizer) {
            throw new common_1.NotFoundException('Organizer profile not found');
        }
        const qb = this.ordersRepository
            .createQueryBuilder('order')
            .innerJoin('order.organization', 'organization')
            .leftJoinAndSelect('order.lines', 'lines')
            .leftJoinAndSelect('lines.ticketType', 'ticketType')
            .leftJoinAndSelect('ticketType.event', 'event')
            .where('organization.id = :organizerId', { organizerId: organizer.id })
            .andWhere('order.status IN (:...statuses)', { statuses: [order_entity_1.OrderStatus.PAID] });
        if (query.fromDate) {
            qb.andWhere('order.paidAt >= :fromDate', { fromDate: query.fromDate });
        }
        if (query.toDate) {
            qb.andWhere('order.paidAt <= :toDate', { toDate: query.toDate });
        }
        if (query.eventId) {
            qb.andWhere('event.id = :eventId', { eventId: query.eventId });
        }
        const orders = await qb.getMany();
        const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
        const totalTickets = orders.reduce((count, order) => count + order.lines.reduce((lineSum, line) => lineSum + line.quantity, 0), 0);
        const perEvent = new Map();
        orders.forEach((order) => {
            order.lines.forEach((line) => {
                var _a, _b;
                const event = line.ticketType.event;
                const key = (_a = event === null || event === void 0 ? void 0 : event.id) !== null && _a !== void 0 ? _a : 'unknown';
                if (!perEvent.has(key)) {
                    perEvent.set(key, {
                        eventName: (_b = event === null || event === void 0 ? void 0 : event.name) !== null && _b !== void 0 ? _b : 'Unassigned',
                        tickets: 0,
                        revenue: 0,
                    });
                }
                const entry = perEvent.get(key);
                entry.tickets += line.quantity;
                entry.revenue += Number(line.lineTotal);
            });
        });
        return {
            organizerId: organizer.id,
            totalRevenue,
            totalTickets,
            perEvent: Array.from(perEvent.values()),
        };
    }
    async generateReport(organizerUser, query) {
        var _a;
        const summary = await this.getSalesSummary(organizerUser, query);
        const organizer = await this.organizersRepository.findOne({
            where: { id: summary.organizerId },
            relations: ['user'],
        });
        if (!organizer) {
            throw new common_1.NotFoundException('Organizer not found');
        }
        const format = (_a = query.format) !== null && _a !== void 0 ? _a : report_entity_1.ReportFormat.CSV;
        const basePath = this.configService.get('storage.basePath', './storage');
        await fs_1.promises.mkdir(basePath, { recursive: true });
        const filename = `sales-report-${organizer.id}-${Date.now()}.${format.toLowerCase()}`;
        const filePath = (0, path_1.join)(basePath, filename);
        if (format === report_entity_1.ReportFormat.PDF) {
            await this.writePdf(filePath, organizer.user.name, summary);
        }
        else {
            await this.writeCsv(filePath, summary);
        }
        let event = null;
        if (query.eventId) {
            event = await this.eventsRepository.findOne({
                where: { id: query.eventId },
                relations: ['organizer'],
            });
            if (!event || event.organizer.id !== summary.organizerId) {
                event = null;
            }
        }
        const report = this.reportsRepository.create({
            organization: organizer,
            event,
            format,
            fileUrl: filePath,
            fromDate: query.fromDate,
            toDate: query.toDate,
        });
        return this.reportsRepository.save(report);
    }
    async writePdf(filePath, organizerName, summary) {
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default();
            const stream = (0, fs_2.createWriteStream)(filePath);
            doc.pipe(stream);
            doc.fontSize(18).text('Pow-er Tickets - Sales Report', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Organizer: ${organizerName}`);
            doc.text(`Generated at: ${new Date().toISOString()}`);
            doc.moveDown();
            doc.text(`Total tickets sold: ${summary.totalTickets}`);
            doc.text(`Total revenue: ${summary.totalRevenue.toFixed(2)}`);
            doc.moveDown();
            summary.perEvent.forEach((event) => {
                doc.text(`${event.eventName} - Tickets: ${event.tickets} - Revenue: ${event.revenue.toFixed(2)}`);
            });
            doc.end();
            stream.on('finish', () => resolve());
            stream.on('error', (error) => reject(error));
        });
    }
    async writeCsv(filePath, summary) {
        const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
            path: filePath,
            header: [
                { id: 'eventName', title: 'Event' },
                { id: 'tickets', title: 'Tickets Sold' },
                { id: 'revenue', title: 'Revenue' },
            ],
        });
        await csvWriter.writeRecords(summary.perEvent.map((event) => (Object.assign(Object.assign({}, event), { revenue: event.revenue.toFixed(2) }))));
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(report_entity_1.Report)),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(2, (0, typeorm_1.InjectRepository)(organizer_entity_1.Organizer)),
    __param(3, (0, typeorm_1.InjectRepository)(event_entity_1.Event)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map