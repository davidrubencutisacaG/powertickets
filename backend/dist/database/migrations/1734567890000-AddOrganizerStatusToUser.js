"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddOrganizerStatusToUser1734567890000 = void 0;
const typeorm_1 = require("typeorm");
class AddOrganizerStatusToUser1734567890000 {
    async up(queryRunner) {
        await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "organizer_status_enum" AS ENUM('Pending', 'Approved', 'Rejected');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
        await queryRunner.addColumn('users', new typeorm_1.TableColumn({
            name: 'organizerStatus',
            type: 'enum',
            enum: ['Pending', 'Approved', 'Rejected'],
            default: "'Pending'",
            isNullable: false,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('users', 'organizerStatus');
        await queryRunner.query(`DROP TYPE IF EXISTS "organizer_status_enum";`);
    }
}
exports.AddOrganizerStatusToUser1734567890000 = AddOrganizerStatusToUser1734567890000;
//# sourceMappingURL=1734567890000-AddOrganizerStatusToUser.js.map