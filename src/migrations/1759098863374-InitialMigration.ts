import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1759098863374 implements MigrationInterface {
    name = 'InitialMigration1759098863374'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_perfil_enum" AS ENUM('admin', 'coordenador')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "nome" character varying(100) NOT NULL, "username" character varying(50) NOT NULL, "senha" character varying NOT NULL, "perfil" "public"."users_perfil_enum" NOT NULL DEFAULT 'coordenador', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "salas" ("id" SERIAL NOT NULL, "numero" character varying(20) NOT NULL, "bloco" character varying(10) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a74948c5a75eb1be20b46c321e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."configuracoes_sala_tipo_enum" AS ENUM('P', 'M', 'G', 'LAB')`);
        await queryRunner.query(`CREATE TABLE "configuracoes_sala" ("id" SERIAL NOT NULL, "salaId" integer NOT NULL, "ano" integer NOT NULL, "semestre" integer NOT NULL, "area_m2" numeric(10,2) NOT NULL, "tipo" "public"."configuracoes_sala_tipo_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_07004fe2bbfe14f83f20d659577" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "previsoes" ("id" SERIAL NOT NULL, "turmaId" integer NOT NULL, "configSalaId" integer NOT NULL, "ano" integer NOT NULL, "semestre" integer NOT NULL, "taxaOcupacao" numeric(5,2) NOT NULL DEFAULT '0', "observacoes" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1deb4a1d9b2435c4ca39f6f0e33" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."turmas_turno_enum" AS ENUM('manha', 'tarde', 'noite')`);
        await queryRunner.query(`CREATE TABLE "turmas" ("id" SERIAL NOT NULL, "cursoId" integer NOT NULL, "turno" "public"."turmas_turno_enum" NOT NULL, "periodoAtual" integer NOT NULL, "quantidadeAlunos" integer NOT NULL, "ano" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_dc45a711f2b6358996a1ab1be6f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cursos" ("id" SERIAL NOT NULL, "nome" character varying(100) NOT NULL, "duracao" integer NOT NULL, "evasao" numeric(5,2) NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_391c5a635ef6b4bd0a46cb75653" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "configuracoes_sala" ADD CONSTRAINT "FK_d55dfadf417aa1c0be1b33d7b19" FOREIGN KEY ("salaId") REFERENCES "salas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "previsoes" ADD CONSTRAINT "FK_28e1fbec51ca14033b8b0a183e9" FOREIGN KEY ("turmaId") REFERENCES "turmas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "previsoes" ADD CONSTRAINT "FK_778f5982b5a39e5945c0998e540" FOREIGN KEY ("configSalaId") REFERENCES "configuracoes_sala"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "turmas" ADD CONSTRAINT "FK_5bfe7eb67c1e06362cdedd2fa06" FOREIGN KEY ("cursoId") REFERENCES "cursos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "turmas" DROP CONSTRAINT "FK_5bfe7eb67c1e06362cdedd2fa06"`);
        await queryRunner.query(`ALTER TABLE "previsoes" DROP CONSTRAINT "FK_778f5982b5a39e5945c0998e540"`);
        await queryRunner.query(`ALTER TABLE "previsoes" DROP CONSTRAINT "FK_28e1fbec51ca14033b8b0a183e9"`);
        await queryRunner.query(`ALTER TABLE "configuracoes_sala" DROP CONSTRAINT "FK_d55dfadf417aa1c0be1b33d7b19"`);
        await queryRunner.query(`DROP TABLE "cursos"`);
        await queryRunner.query(`DROP TABLE "turmas"`);
        await queryRunner.query(`DROP TYPE "public"."turmas_turno_enum"`);
        await queryRunner.query(`DROP TABLE "previsoes"`);
        await queryRunner.query(`DROP TABLE "configuracoes_sala"`);
        await queryRunner.query(`DROP TYPE "public"."configuracoes_sala_tipo_enum"`);
        await queryRunner.query(`DROP TABLE "salas"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_perfil_enum"`);
    }

}
