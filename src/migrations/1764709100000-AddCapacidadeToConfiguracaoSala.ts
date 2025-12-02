import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCapacidadeToConfiguracaoSala1764709100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE configuracoes_sala
      ADD COLUMN capacidade INTEGER
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE configuracoes_sala
      DROP COLUMN capacidade
    `);
  }
}
