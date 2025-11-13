import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddOrganizerStatusToUser1734567890000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear el tipo enum si no existe
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "organizer_status_enum" AS ENUM('Pending', 'Approved', 'Rejected');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Agregar la columna organizerStatus a la tabla users
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'organizerStatus',
        type: 'enum',
        enum: ['Pending', 'Approved', 'Rejected'],
        default: "'Pending'",
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar la columna
    await queryRunner.dropColumn('users', 'organizerStatus');

    // Eliminar el tipo enum (solo si no se usa en otras tablas)
    await queryRunner.query(`DROP TYPE IF EXISTS "organizer_status_enum";`);
  }
}


