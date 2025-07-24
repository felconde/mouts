import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPasswordToUsers1704000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('users', new TableColumn({
      name: 'password',
      type: 'varchar',
      isNullable: false,
      default: "'$2b$10$defaulthash'", // Hash temporário para registros existentes
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'password');
  }
  
} 