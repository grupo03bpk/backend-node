import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSalaIdToTurma1764709000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE turmas
      ADD COLUMN salaId INTEGER
    `);

    await queryRunner.query(`
      ALTER TABLE turmas
      ADD CONSTRAINT FK_Turma_Sala
      FOREIGN KEY (salaId) REFERENCES salas(id)
      ON DELETE SET NULL
      ON UPDATE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE turmas
      DROP CONSTRAINT FK_Turma_Sala
    `);

    await queryRunner.query(`
      ALTER TABLE turmas
      DROP COLUMN salaId
    `);
  }
}
