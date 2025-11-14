"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizerRequestsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const organizer_request_entity_1 = require("../database/entities/organizer-request.entity");
const user_entity_1 = require("../database/entities/user.entity");
const organizer_requests_service_1 = require("./organizer-requests.service");
const organizer_requests_controller_1 = require("./organizer-requests.controller");
let OrganizerRequestsModule = class OrganizerRequestsModule {
};
exports.OrganizerRequestsModule = OrganizerRequestsModule;
exports.OrganizerRequestsModule = OrganizerRequestsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([organizer_request_entity_1.OrganizerRequest, user_entity_1.User])],
        providers: [organizer_requests_service_1.OrganizerRequestsService],
        controllers: [organizer_requests_controller_1.OrganizerRequestsController],
        exports: [organizer_requests_service_1.OrganizerRequestsService],
    })
], OrganizerRequestsModule);
//# sourceMappingURL=organizer-requests.module.js.map