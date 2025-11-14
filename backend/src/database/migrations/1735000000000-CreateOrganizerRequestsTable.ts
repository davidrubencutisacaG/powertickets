import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class CreateOrganizerRequestsTable1735000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear el tipo enum si no existe
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "organizer_request_status_enum" AS ENUM('Pending', 'Approved', 'Rejected');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Crear la tabla organizer_requests
    await queryRunner.createTable(
      new Table({
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
      }),
      true,
    );

    // Crear la foreign key hacia users
    await queryRunner.createForeignKey(
      'organizer_requests',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar la foreign key
    const table = await queryRunner.getTable('organizer_requests');
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('user_id') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('organizer_requests', foreignKey);
    }

    // Eliminar la tabla
    await queryRunner.dropTable('organizer_requests');

    // Eliminar el tipo enum
    await queryRunner.query(`DROP TYPE IF EXISTS "organizer_request_status_enum";`);
  }
}

