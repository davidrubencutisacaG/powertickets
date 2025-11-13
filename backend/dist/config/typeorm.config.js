"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_entity_1 = require("../database/entities/user.entity");
const organizer_entity_1 = require("../database/entities/organizer.entity");
const event_entity_1 = require("../database/entities/event.entity");
const ticket_type_entity_1 = require("../database/entities/ticket-type.entity");
const ticket_instance_entity_1 = require("../database/entities/ticket-instance.entity");
const order_entity_1 = require("../database/entities/order.entity");
const order_line_entity_1 = require("../database/entities/order-line.entity");
const payment_method_entity_1 = require("../database/entities/payment-method.entity");
const payment_entity_1 = require("../database/entities/payment.entity");
const report_entity_1 = require("../database/entities/report.entity");
exports.default = () => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    return ({
        port: parseInt((_a = process.env.PORT) !== null && _a !== void 0 ? _a : '3000', 10),
        jwt: {
            secret: (_b = process.env.JWT_SECRET) !== null && _b !== void 0 ? _b : 'supersecret',
            expiresIn: (_c = process.env.JWT_EXPIRES) !== null && _c !== void 0 ? _c : '1d',
        },
        storage: {
            basePath: (_d = process.env.STORAGE_BASE_PATH) !== null && _d !== void 0 ? _d : './storage',
        },
        database: {
            type: 'postgres',
            host: (_e = process.env.DB_HOST) !== null && _e !== void 0 ? _e : 'localhost',
            port: parseInt((_f = process.env.DB_PORT) !== null && _f !== void 0 ? _f : '5432', 10),
            username: (_g = process.env.DB_USER) !== null && _g !== void 0 ? _g : 'postgres',
            password: (_h = process.env.DB_PASS) !== null && _h !== void 0 ? _h : 'changeme',
            database: (_j = process.env.DB_NAME) !== null && _j !== void 0 ? _j : 'powertickets',
            synchronize: true,
            logging: false,
            entities: [
                user_entity_1.User,
                organizer_entity_1.Organizer,
                event_entity_1.Event,
                ticket_type_entity_1.TicketType,
                ticket_instance_entity_1.TicketInstance,
                order_entity_1.Order,
                order_line_entity_1.OrderLine,
                payment_method_entity_1.PaymentMethod,
                payment_entity_1.Payment,
                report_entity_1.Report,
            ],
        },
    });
};
//# sourceMappingURL=typeorm.config.js.map