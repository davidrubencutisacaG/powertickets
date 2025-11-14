"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrganizerRequestsTable1735000000000 = void 0;
const typeorm_1 = require("typeorm");
class CreateOrganizerRequestsTable1735000000000 {
    async up(queryRunner) {
        await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "organizer_request_status_enum" AS ENUM('Pending', 'Approved', 'Rejected');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'organizer_requests',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'user_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'organizationName',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'ruc',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'document',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'phone',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'address',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'website',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'status',
                    type: 'enum',
                    enum: ['Pending', 'Approved', 'Rejected'],
                    default: "'Pending'",
                    isNullable: false,
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                    isNullable: false,
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                    onUpdate: 'CURRENT_TIMESTAMP',
                    isNullable: false,
                },
            ],
        }), true);
        await queryRunner.createForeignKey('organizer_requests', new typeorm_1.TableForeignKey({
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable('organizer_requests');
        const foreignKey = table === null || table === void 0 ? void 0 : table.foreignKeys.find((fk) => fk.columnNames.indexOf('user_id') !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey('organizer_requests', foreignKey);
        }
        await queryRunner.dropTable('organizer_requests');
        await queryRunner.query(`DROP TYPE IF EXISTS "organizer_request_status_enum";`);
    }
}
exports.CreateOrganizerRequestsTable1735000000000 = CreateOrganizerRequestsTable1735000000000;
//# sourceMappingURL=1735000000000-CreateOrganizerRequestsTable.js.map