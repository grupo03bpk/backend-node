import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveCascadeFromCursoTurmas1764709300000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Não é necessário alterar o banco, pois cascade é apenas uma configuração do TypeORM
    // Nenhuma coluna ou relação física é alterada
    // Migration criada apenas para registro e versionamento
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Nenhuma ação de reversão necessária
  }
}
