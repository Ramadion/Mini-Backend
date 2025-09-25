import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1758828645653 implements MigrationInterface {
    name = 'InitMigration1758828645653'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "team" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "rol" varchar NOT NULL, "teamId" integer)`);
        await queryRunner.query(`CREATE TABLE "task" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "userId" integer, "teamId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "rol" varchar NOT NULL, "teamId" integer, CONSTRAINT "FK_1e89f1fd137dc7fea7242377e25" FOREIGN KEY ("teamId") REFERENCES "team" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "name", "rol", "teamId") SELECT "id", "name", "rol", "teamId" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`CREATE TABLE "temporary_task" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "userId" integer, "teamId" integer, CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_de59b0c5e20f83310101e5ca835" FOREIGN KEY ("teamId") REFERENCES "team" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_task"("id", "title", "description", "userId", "teamId") SELECT "id", "title", "description", "userId", "teamId" FROM "task"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`ALTER TABLE "temporary_task" RENAME TO "task"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" RENAME TO "temporary_task"`);
        await queryRunner.query(`CREATE TABLE "task" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "userId" integer, "teamId" integer)`);
        await queryRunner.query(`INSERT INTO "task"("id", "title", "description", "userId", "teamId") SELECT "id", "title", "description", "userId", "teamId" FROM "temporary_task"`);
        await queryRunner.query(`DROP TABLE "temporary_task"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "rol" varchar NOT NULL, "teamId" integer)`);
        await queryRunner.query(`INSERT INTO "user"("id", "name", "rol", "teamId") SELECT "id", "name", "rol", "teamId" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "team"`);
    }

}
